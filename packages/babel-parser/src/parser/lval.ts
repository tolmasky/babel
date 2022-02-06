// @flow

/*:: declare var invariant; */
import * as charCodes from "charcodes";
import { tt, type TokenType } from "../tokenizer/types";
import * as N from "../grammar";
import { Pos, Position } from "../grammar/source-location";
import {
  isStrictBindOnlyReservedWord,
  isStrictBindReservedWord,
} from "../util/identifier";
import { NodeUtils } from "./node";
import { type BindingTypes, BIND_NONE } from "../util/scopeflags";
import { ExpressionErrors } from "./util";
import { Errors } from "../parse-error";

type CharCode = charCodes[keyof charCodes];

const unwrapParenthesizedExpression = (
  expression: N.Expression | N.BindingPattern
): Exclude<N.Expression | N.BindingPattern, N.ParenthesizedExpression> =>
  expression.type === "ParenthesizedExpression"
    ? unwrapParenthesizedExpression(expression.expression)
    : expression;

/*
type ObjectMember = N.ObjectProperty | N.ObjectMethod;
type ClassMember =
  | N.ClassMethod
  | N.ClassPrivateMethod
  | N.ClassProperty
  | N.ClassPrivateProperty;
type ObjectOrClassMember = N.ClassMethod | N.ClassProperty | ObjectMember;

type CharCode = charCodes[keyof charCodes];
type BindingListElement = N.PatternLike | RestElement | TSParameterProperty;
type BindingList = BindingListElement[];

type AssignmentTarget = N.Identifier | N.ObjectPattern | N.ArrayPattern | N.MemberExpression;

type TsNamedTypeElementBase = {
  type: string;
  // Not using TypeScript's `PropertyName` here since we don't have a `ComputedPropertyName` node type.
  // This is usually an Identifier but may be e.g. `Symbol.iterator` if `computed` is true.
  key: Expression;
  computed: boolean;
  optional?: true;
};
*/
const UnsafeCast = <From, To>(node: From) => ((node as unknown) as To);

export default abstract class LValParser extends NodeUtils {
  // Forward-declaration: defined in expression.js
  abstract parseIdentifier<T extends N.SyntaxNode<any>>(liberal?: boolean): T;

  abstract parseMaybeAssignAllowIn(
    refExpressionErrors?: ExpressionErrors,
    afterLeftParse?: Function,
    refNeedsArrowPos?: Pos,
  ): N.Expression;

  abstract parseObjectLike<T extends (N.ObjectBindingPattern | N.ObjectLiteral)> (
    close: TokenType,
    isPattern: boolean,
    isRecord?: boolean,
    refExpressionErrors?: ExpressionErrors,
  ): T;

  abstract parseObjPropValue(
    prop: any,
    startPos: number | null,
    startLoc: Position | null,
    isGenerator: boolean,
    isAsync: boolean,
    isPattern: boolean,
    isAccessor: boolean,
    refExpressionErrors?: ExpressionErrors,
  ): void;

  abstract parsePropertyName(
    prop: N.ClassElement | ObjectOrClassMember  | TsNamedTypeElementBase,
  ): N.PropertyName;

  abstract parsePrivateName(): N.PrivateIdentifier;

  // Forward-declaration: defined in statement.js
  abstract parseDecorator(): N.Decorator;

  /**
   * Convert existing expression atom to assignable pattern
   * if possible. Also checks invalid destructuring targets:

   - Parenthesized Destructuring patterns
   - RestElement is not the last element
   - Missing `=` in assignment pattern

   NOTE: There is a corresponding "isAssignable" method.
   When this one is updated, please check if also that one needs to be updated.

   * @param {Node} node The expression atom
   * @param {boolean} [isLHS=false] Whether we are parsing a LeftHandSideExpression. If isLHS is `true`, the following cases are allowed:
                                    `[(a)] = [0]`, `[(a.b)] = [0]`

   * @returns {Node} The converted assignable pattern
   * @memberof LValParser
   */
  toAssignable(node: Node, isLHS: boolean = false): Node {
    switch (node.type) {
      case "Identifier":
      case "ObjectPattern":
      case "ArrayPattern":
      case "AssignmentPattern":
      case "RestElement":
        break;

      case "ObjectExpression":
        const objectPattern =
            UnsafeCast<N.ObjectLiteral, N.ObjectBindingPattern>(node);
        objectPattern.type = "ObjectPattern";
        for (
          let i = 0, length = objectPattern.properties.length, last = length - 1;
          i < length;
          i++
        ) {
          const prop = objectPattern.properties[i];
          const isLast = i === last;
          this.toAssignableObjectExpressionProp(prop, isLast, isLHS);

          if (
            isLast &&
            prop.type === "RestElement" &&
            objectPattern.extra?.trailingCommaLoc instanceof Position
          ) {
            this.raise(Errors.RestTrailingComma, {
              at: objectPattern.extra.trailingCommaLoc,
            });
          }
        }
        break;

      case "ObjectProperty": {
        const { key, value } = node;
        if (this.isPrivateName(key)) {
          this.classScope.usePrivateName(
            this.getPrivateNameSV(key),
            key.loc.start,
          );
        }
        this.toAssignable(value, isLHS);
        break;
      }

      case "SpreadElement": {
        this.checkToRestConversion(node);

        const restElement = UnsafeCast<N.SpreadElement, N.BindingRestElement>(node);
        restElement.type = "RestElement";
        const arg = restElement.argument;
        this.toAssignable(restElement, isLHS);
        break;
      }

      case "ArrayExpression":
        const arrayPattern =
            UnsafeCast<N.ArrayLiteral, N.ArrayBindingPattern>(node);
        arrayPattern.type = "ArrayPattern";
        this.toAssignableList(
          node.elements,
          node.extra?.trailingCommaLoc as Position,
          isLHS,
        );
        break;

      case "AssignmentExpression":
        if (node.operator !== "=") {
          this.raise(Errors.MissingEqInAssignment, { at: node.left.loc.end });
        }

        const assignmentPattern =
            UnsafeCast<N.AssignmentExpression, N.AssignmentPattern>(node);
        assignmentPattern.type = "AssignmentPattern";
        delete node.operator;
        this.toAssignable(assignmentPattern.left, isLHS);
        break;

      case "ParenthesizedExpression":
        const unparenthesized = unwrapParenthesizedExpression(node);

        if (!isLHS) {
          this.raise(Errors.InvalidParenthesizedAssignment, { at: node });
        }
        else if (unparenthesized.type === "Identifier") {
          // An LHS can be reinterpreted to a binding pattern but not vice
          // versa. Therefore a parenthesized identifier is ambiguous until we
          // are sure it is an assignment expression.
          // i.e. `([(a) = []] = []) => {}`
          // See also `recordParenthesizedIdentifierError` signature in
          // packages/babel-parser/src/util/expression-scope.js
          this.expressionScope.recordParenthesizedIdentifierError({ at: node });
        } else if (unparenthesized.type !== "MemberExpression") {
          // A parenthesized member expression can be in LHS, but not in a
          // pattern. If the LHS is later interpreted as a pattern,
          // `checkLVal` will throw for member expression binding
          // i.e. `([(a.b) = []] = []) => {}`
          this.raise(Errors.InvalidParenthesizedAssignment, { at: node });
        }

        this.toAssignable(unparenthesized, isLHS);
        break;

      default:
      // We don't know how to deal with this node. It will
      // be reported by a later call to checkLVal
    }
    return node;
  }

  toAssignableObjectExpressionProp(
    prop: Node,
    isLast: boolean,
    isLHS: boolean,
  ) {
    if (prop.type === "ObjectMethod") {
      /* eslint-disable @babel/development-internal/dry-error-messages */
      this.raise(
        prop.kind === "get" || prop.kind === "set"
          ? Errors.PatternHasAccessor
          : Errors.PatternHasMethod,
        { at: prop.key },
      );
      /* eslint-enable @babel/development-internal/dry-error-messages */
    } else if (prop.type === "SpreadElement" && !isLast) {
      this.raise(Errors.RestTrailingComma, { at: prop });
    } else {
      this.toAssignable(prop, isLHS);
    }
  }

  // Convert list of expression atoms to binding list.

  toAssignableList(
    exprList: (N.Expression | N.SpreadElement | N.BindingPattern)[],
    trailingCommaLoc: Position | null | undefined,
    isLHS: boolean,
  ): N.BindingElementList {
    let end = exprList.length;
    if (end) {
      const last = exprList[end - 1];
      if (last?.type === "RestElement") {
        --end;
      } else if (last?.type === "SpreadElement") {
        UnsafeCast<N.SpreadElement, N.BindingRestElement>(last).type = "RestElement";
        this.toAssignable(last.argument, isLHS);
        const arg = unwrapParenthesizedExpression(last.argument);
        if (
          arg.type !== "Identifier" &&
          arg.type !== "MemberExpression" &&
          arg.type !== "ArrayPattern" &&
          arg.type !== "ObjectPattern"
        ) {
          // FIXME: Seems like this could be turned into an UnexpectedExpression
          // or UnexpectedPattern error and treated as recoverable.
          this.unexpected(arg.loc.start);
        }

        if (trailingCommaLoc) {
          this.raise(Errors.RestTrailingComma, { at: trailingCommaLoc });
        }

        --end;
      }
    }
    for (let i = 0; i < end; i++) {
      const elt = exprList[i];
      if (elt) {
        this.toAssignable(elt, isLHS);
        if (elt.type === "RestElement") {
          this.raise(Errors.RestTrailingComma, { at: elt });
        }
      }
    }
    return exprList as N.BindingElementList;
  }

  isAssignable(node: Node, isBinding: boolean = false): boolean {
    switch (node.type) {
      case "Identifier":
      case "ObjectPattern":
      case "ArrayPattern":
      case "AssignmentPattern":
      case "RestElement":
        return true;

      case "ObjectExpression": {
        const last = node.properties.length - 1;
        return node.properties.every((prop, i) => {
          return (
            prop.type !== "ObjectMethod" &&
            (i === last || prop.type !== "SpreadElement") &&
            this.isAssignable(prop)
          );
        });
      }

      case "ObjectProperty":
        return this.isAssignable(node.value);

      case "SpreadElement":
        return this.isAssignable(node.argument);

      case "ArrayExpression":
        return node.elements.every(
          element => element === null || this.isAssignable(element),
        );

      case "AssignmentExpression":
        return node.operator === "=";

      case "ParenthesizedExpression":
        return this.isAssignable(node.expression);

      case "MemberExpression":
      case "OptionalMemberExpression":
        return !isBinding;

      default:
        return false;
    }
  }

  // Convert list of expression atoms to a list of

  // FIXME: This used to be readonly (Expression | null | undefined)[]
  toReferencedList(
    exprList: readonly (N.Expression | N.SpreadElement)[],
    isParenthesizedExpr: boolean = false, // eslint-disable-line no-unused-vars
  ): readonly N.Expression[] {
    return exprList;
  }

  // FIXME: This used to be readonly (Expression | null | undefined)[]
  toReferencedListDeep(
    exprList: readonly (N.Expression | N.SpreadElement)[],
    isParenthesizedExpr: boolean = false,
  ): void {
    this.toReferencedList(exprList, isParenthesizedExpr);

    for (const expr of exprList) {
      if (expr?.type === "ArrayExpression") {
        this.toReferencedListDeep(expr.elements);
      }
    }
  }

  // Parses spread element.

  parseSpread(
    refExpressionErrors: ExpressionErrors,
    refNeedsArrowPos?: Pos,
  ): N.SpreadElement {
    const node = this.startNode<N.SpreadElement>();
    this.next();
    node.argument = this.parseMaybeAssignAllowIn(
      refExpressionErrors,
      undefined,
      refNeedsArrowPos,
    );
    return this.finishNode(node, "SpreadElement");
  }

  // https://tc39.es/ecma262/#prod-BindingRestProperty
  // https://tc39.es/ecma262/#prod-BindingRestElement
  parseRestBinding(): N.BindingRestElement {
    const node = this.startNode<N.BindingRestElement>();
    this.next(); // eat `...`
    node.argument = this.parseBindingAtom();
    return this.finishNode(node, "RestElement");
  }

  // Parses lvalue (assignable) atom.
  // FIXME: We should have `BindingIdentifier` vs. `Identifier`, so that
  // `BindingIdentifier` can be part of Pattern, but that would require some
  // breaking changes.
  parseBindingAtom(): N.BindingPattern | N.BindingIdentifier {
    // https://tc39.es/ecma262/#prod-BindingPattern
    switch (this.state.type) {
      case tt.bracketL: {
        const node = this.startNode<N.ArrayBindingPattern>();
        this.next();
        node.elements = <N.BindingElementList>this.parseBindingList(
          tt.bracketR,
          charCodes.rightSquareBracket,
          true,
        );
        return this.finishNode(node, "ArrayBindingPattern");
      }

      case tt.braceL:
        return this.parseObjectLike<N.ObjectBindingPattern>(tt.braceR, true);
    }

    // https://tc39.es/ecma262/#prod-BindingIdentifier
    return this.parseIdentifier<N.BindingIdentifier>();
  }

  // https://tc39.es/ecma262/#prod-BindingElementList
  parseBindingList(
    close: TokenType,
    closeCharCode: CharCode,
    allowEmpty: boolean = false,
    allowModifiers: boolean = false,
  ): N.BindingElementList {
    const elts: N.BindingElementList = [];
    let first = true;
    while (!this.eat(close)) {
      if (first) {
        first = false;
      } else {
        this.expect(tt.comma);
      }
      if (allowEmpty && this.match(tt.comma)) {
        // $FlowFixMe This method returns `$ReadOnlyArray<?Pattern>` if `allowEmpty` is set.
        elts.push(null);
      } else if (this.eat(close)) {
        break;
      } else if (this.match(tt.ellipsis)) {
        elts.push(this.parseAssignableListItemTypes(this.parseRestBinding()));
        if (!this.checkCommaAfterRest(closeCharCode)) {
          this.expect(close);
          break;
        }
      } else {
        const decorators = [];
        if (this.match(tt.at) && this.hasPlugin("decorators")) {
          this.raise(Errors.UnsupportedParameterDecorator, {
            at: this.state.startLoc,
          });
        }
        // invariant: hasPlugin("decorators-legacy")
        while (this.match(tt.at)) {
          decorators.push(this.parseDecorator());
        }
        elts.push(this.parseAssignableListItem(allowModifiers, decorators));
      }
    }
    return elts;
  }

  // https://tc39.es/ecma262/#prod-BindingRestProperty
  parseBindingRestProperty(): N.BindingRestProperty {
    const bindingRestProperty = this.startNode<N.BindingRestElement>()
    this.next(); // eat '...'
    // Don't use parseRestBinding() as we only allow Identifier here.
    bindingRestProperty.argument = this.parseIdentifier<N.BindingIdentifier>();
    this.checkCommaAfterRest(charCodes.rightCurlyBrace);
    return this.finishNode(bindingRestProperty, "BindingRestProperty");
  }

  // https://tc39.es/ecma262/#prod-BindingProperty
  parseBindingProperty(): N.BindingProperty | N.BindingRestElement {
    const { type } = this.state;
    if (type === tt.ellipsis) {
      return this.parseBindingRestProperty();
    }

    const { start: startPos, startLoc } = this.state;
    const prop = this.startNode<N.BindingProperty>();

    if (type === tt.privateName) {
      this.expectPlugin("destructuringPrivate", startLoc);
      this.classScope.usePrivateName(this.state.value, startLoc);
      prop.key = this.parsePrivateName();
    } else {
      this.parsePropertyName(prop);
    }
    prop.method = false;
    this.parseObjPropValue(
      prop,
      startPos,
      startLoc,
      false /* isGenerator */,
      false /* isAsync */,
      true /* isPattern */,
      false /* isAccessor */,
    );

    return prop;
  }

  parseAssignableListItem(
    allowModifiers: boolean,
    decorators: N.Decorator[],
  ): BindingListElement {
    const left = this.parseMaybeDefault();
    this.parseAssignableListItemTypes(left);
    const elt = this.parseMaybeDefault(left.start, left.loc.start, left);
    if (decorators.length) {
      left.decorators = decorators;
    }
    return elt;
  }

  // Used by flow/typescript plugin to add type annotations to binding elements
  // : N.BindingPattern | N.BindingRestElement
  parseAssignableListItemTypes(param: N.BindingPattern | N.BindingRestElement) {
    return param;
  }

  // Parses assignment pattern around given atom if possible.
  // https://tc39.es/ecma262/#prod-BindingElement
  parseMaybeDefault(
    startPos: number = this.state.start,
    startLoc: Position = this.state.startLoc,
    left: AssignmentTarget = this.parseBindingAtom(),
  ): N.BindingPattern {
    if (!this.eat(tt.eq)) return left;

    const node = this.startNodeAt<N.AssignmentPattern>(startPos, startLoc);
    node.left = left;
    node.right = this.parseMaybeAssignAllowIn();
    return this.finishNode(node, "AssignmentPattern");
  }

  /**
   * Verify that if a node is an lval - something that can be assigned to.
   *
   * @param {Expression} expr The given node
   * @param {string} contextDescription The auxiliary context information printed when error is thrown
   * @param {BindingTypes} [bindingType=BIND_NONE] The desired binding type. If the given node is an identifier and `bindingType` is not
                                                   BIND_NONE, `checkLVal` will register binding to the parser scope
                                                   See also src/util/scopeflags.js
   * @param {?Set<string>} checkClashes An optional string set to check if an identifier name is included. `checkLVal` will add checked
                                        identifier name to `checkClashes` It is used in tracking duplicates in function parameter lists. If
                                        it is nullish, `checkLVal` will skip duplicate checks
   * @param {boolean} [disallowLetBinding] Whether an identifier named "let" should be disallowed
   * @param {boolean} [strictModeChanged=false] Whether an identifier has been parsed in a sloppy context but should be reinterpreted as
                                                strict-mode. e.g. `(arguments) => { "use strict "}`
   * @memberof LValParser
   */
  checkLVal(
    expr: N.Expression | N.BindingIdentifier | N.BindingPattern | N.BindingRestElement,
    contextDescription: string,
    bindingType: BindingTypes = BIND_NONE,
    checkClashes?: Set<string>,
    disallowLetBinding: boolean = false,
    strictModeChanged: boolean = false,
  ): void {
    switch (expr.type) {
      case "Identifier": {
        const { name } = expr;
        if (
          this.state.strict &&
          // "Global" reserved words have already been checked by parseIdentifier,
          // unless they have been found in the id or parameters of a strict-mode
          // function in a sloppy context.
          (strictModeChanged
            ? isStrictBindReservedWord(name, this.inModule)
            : isStrictBindOnlyReservedWord(name))
        ) {
          this.raise(
            bindingType === BIND_NONE
              ? Errors.StrictEvalArguments
              : Errors.StrictEvalArgumentsBinding,
            { at: expr, name },
          );
        }

        if (checkClashes) {
          if (checkClashes.has(name)) {
            this.raise(Errors.ParamDupe, { at: expr });
          } else {
            checkClashes.add(name);
          }
        }
        if (disallowLetBinding && name === "let") {
          this.raise(Errors.LetInLexicalBinding, { at: expr });
        }
        if (!(bindingType & BIND_NONE)) {
          this.scope.declareName(name, bindingType, expr.loc.start);
        }
        break;
      }

      case "MemberExpression":
        if (bindingType !== BIND_NONE) {
          this.raise(Errors.InvalidPropertyBindingPattern, {
            at: expr,
          });
        }
        break;

      case "ObjectPattern":
        for (let prop of expr.properties) {
          // If we find here an ObjectMethod, it's because this was originally
          // an ObjectExpression which has then been converted.
          // toAssignable already reported this error with a nicer message.
          if (this.isObjectMethod(prop)) continue;

          this.checkLVal(
            prop.type === "ObjectProperty" ? prop.value : prop,
            "object destructuring pattern",
            bindingType,
            checkClashes,
            disallowLetBinding,
          );
        }
        break;

      case "ArrayPattern":
        for (const elem of expr.elements) {
          if (elem) {
            this.checkLVal(
              elem,
              "array destructuring pattern",
              bindingType,
              checkClashes,
              disallowLetBinding,
            );
          }
        }
        break;

      case "AssignmentPattern":
        this.checkLVal(
          expr.left,
          "assignment pattern",
          bindingType,
          checkClashes,
        );
        break;

      case "RestElement":
        this.checkLVal(
          expr.argument,
          "rest element",
          bindingType,
          checkClashes,
        );
        break;

      case "ParenthesizedExpression":
        this.checkLVal(
          expr.expression,
          "parenthesized expression",
          bindingType,
          checkClashes,
        );
        break;

      default: {
        this.raise(
          bindingType === BIND_NONE
            ? Errors.InvalidLhs
            : Errors.InvalidLhsBinding,
          { at: expr, contextDescription },
        );
      }
    }
  }

  checkToRestConversion(node: N.SpreadElement): void {
    if (
      node.argument.type !== "Identifier" &&
      node.argument.type !== "MemberExpression"
    ) {
      this.raise(Errors.InvalidRestAssignmentPattern, {
        at: node.argument,
      });
    }
  }

  checkCommaAfterRest(close: CharCode): boolean {
    if (!this.match(tt.comma)) {
      return false;
    }

    this.raise(
      this.lookaheadCharCode() === close
        ? Errors.RestTrailingComma
        : Errors.ElementAfterRest,
      { at: this.state.startLoc },
    );

    return true;
  }
}
