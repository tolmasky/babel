// @flow

import { toParseErrorCredentials } from "../parse-error";
import toNodeDescription from "./to-node-description";

export type LValAncestor =
  | { type: "UpdateExpression", prefix: boolean }
  | {
      type:
        | "ArrayPattern"
        | "AssignmentExpression"
        | "CatchClause"
        | "ForOfStatement"
        | "FormalParameters"
        | "ForInStatement"
        | "ForStatement"
        | "Identfier"
        | "ObjectPattern"
        | "RestElement"
        | "VariableDeclarator",
    };

export default (_: typeof toParseErrorCredentials) => ({
  AccessorIsGenerator: _<"AccessorIsGenerator", {| kind: "get" | "set" |}>(
    ({ kind }) => `A ${kind}ter cannot be a generator.`,
  ),

  ArgumentsInClass: _<"ArgumentsInClass">(
    "'arguments' is only allowed in functions and class methods.",
  ),
  AsyncFunctionInSingleStatementContext:
    _<"AsyncFunctionInSingleStatementContext">(
      "Async functions can only be declared at the top level or inside a block.",
    ),
  AwaitBindingIdentifier: _<"AwaitBindingIdentifier">(
    "Can not use 'await' as identifier inside an async function.",
  ),
  AwaitBindingIdentifierInStaticBlock: _<"AwaitBindingIdentifierInStaticBlock">(
    "Can not use 'await' as identifier inside a static block.",
  ),
  AwaitExpressionFormalParameter: _<"AwaitExpressionFormalParameter">(
    "'await' is not allowed in async function parameters.",
  ),
  AwaitNotInAsyncContext: _<"AwaitNotInAsyncContext">(
    "'await' is only allowed within async functions and at the top levels of modules.",
  ),
  AwaitNotInAsyncFunction: _<"AwaitNotInAsyncFunction">(
    "'await' is only allowed within async functions.",
  ),
  BadGetterArity: _<"BadGetterArity">(
    "A 'get' accesor must not have any formal parameters.",
  ),
  BadSetterArity: _<"BadSetterArity">(
    "A 'set' accesor must have exactly one formal parameter.",
  ),
  BadSetterRestParameter: _<"BadSetterRestParameter">(
    "A 'set' accesor function argument must not be a rest parameter.",
  ),
  ConstructorClassField: _<"ConstructorClassField">(
    "Classes may not have a field named 'constructor'.",
  ),
  ConstructorClassPrivateField: _<"ConstructorClassPrivateField">(
    "Classes may not have a private field named '#constructor'.",
  ),
  ConstructorIsAccessor: _<"ConstructorIsAccessor">(
    "Class constructor may not be an accessor.",
  ),
  ConstructorIsAsync: _<"ConstructorIsAsync">(
    "Constructor can't be an async function.",
  ),
  ConstructorIsGenerator: _<"ConstructorIsGenerator">(
    "Constructor can't be a generator.",
  ),
  DeclarationMissingInitializer: _<
    "DeclarationMissingInitializer",
    {| kind: "const" | "destructuring" |},
  >(({ kind }) => `Missing initializer in ${kind} declaration.`),
  DecoratorBeforeExport: _<"DecoratorBeforeExport">(
    "Decorators must be placed *before* the 'export' keyword. You can set the 'decoratorsBeforeExport' option to false to use the 'export @decorator class {}' syntax.",
  ),
  DecoratorConstructor: _<"DecoratorConstructor">(
    "Decorators can't be used with a constructor. Did you mean '@dec class { ... }'?",
  ),
  DecoratorExportClass: _<"DecoratorExportClass">(
    "Using the export keyword between a decorator and a class is not allowed. Please use `export @dec class` instead.",
  ),
  DecoratorSemicolon: _<"DecoratorSemicolon">(
    "Decorators must not be followed by a semicolon.",
  ),
  DecoratorStaticBlock: _<"DecoratorStaticBlock">(
    "Decorators can't be used with a static block.",
  ),
  DeletePrivateField: _<"DeletePrivateField">(
    "Deleting a private field is not allowed.",
  ),
  DestructureNamedImport: _<"DestructureNamedImport">(
    "ES2015 named imports do not destructure. Use another statement for destructuring after the import.",
  ),
  DuplicateConstructor: _<"DuplicateConstructor">(
    "Duplicate constructor in the same class.",
  ),
  DuplicateDefaultExport: _<"DuplicateDefaultExport">(
    "Only one default export allowed per module.",
  ),
  DuplicateExport: _<"DuplicateExport", {| exportName: string |}>(
    ({ exportName }) =>
      `\`${exportName}\` has already been exported. Exported identifiers must be unique.`,
  ),
  DuplicateProto: _<"DuplicateProto">("Redefinition of __proto__ property."),
  DuplicateRegExpFlags: _<"DuplicateRegExpFlags">(
    "Duplicate regular expression flag.",
  ),
  ElementAfterRest: _<"ElementAfterRest">("Rest element must be last element."),
  EscapedCharNotAnIdentifier: _<"EscapedCharNotAnIdentifier">(
    "Invalid Unicode escape.",
  ),
  ExportBindingIsString: _<
    "ExportBindingIsString",
    {| localName: string, exportName: string |},
  >(
    ({ localName, exportName }) =>
      `A string literal cannot be used as an exported binding without \`from\`.\n- Did you mean \`export { '${localName}' as '${exportName}' } from 'some-module'\`?`,
  ),
  ExportDefaultFromAsIdentifier: _<"ExportDefaultFromAsIdentifier">(
    "'from' is not allowed as an identifier after 'export default'.",
  ),

  ForInOfLoopInitializer: _<
    "ForInOfLoopInitializer",
    {| type: "ForInStatement" | "ForOfStatement" |},
  >(
    ({ type }) =>
      `'${
        type === "ForInStatement" ? "for-in" : "for-of"
      }' loop variable declaration may not have an initializer.`,
  ),

  ForOfAsync: _<"ForOfAsync">(
    "The left-hand side of a for-of loop may not be 'async'.",
  ),
  ForOfLet: _<"ForOfLet">(
    "The left-hand side of a for-of loop may not start with 'let'.",
  ),
  GeneratorInSingleStatementContext: _<"GeneratorInSingleStatementContext">(
    "Generators can only be declared at the top level or inside a block.",
  ),

  IllegalBreakContinue: _<
    "IllegalBreakContinue",
    {| type: "BreakStatement" | "ContinueStatement" |},
  >(
    ({ type }) =>
      `Unsyntactic ${type === "BreakStatement" ? "break" : "continue"}.`,
  ),

  IllegalLanguageModeDirective: _<"IllegalLanguageModeDirective">(
    "Illegal 'use strict' directive in function with non-simple parameter list.",
  ),
  IllegalReturn: _<"IllegalReturn">("'return' outside of function."),
  ImportBindingIsString: _<"ImportBindingIsString", {| importName: string |}>(
    ({ importName }) =>
      `A string literal cannot be used as an imported binding.\n- Did you mean \`import { "${importName}" as foo }\`?`,
  ),
  ImportCallArgumentTrailingComma: _<"ImportCallArgumentTrailingComma">(
    "Trailing comma is disallowed inside import(...) arguments.",
  ),
  ImportCallArity: _<"ImportCallArity", {| maxArgumentCount: 1 | 2 |}>(
    ({ maxArgumentCount }) =>
      `\`import()\` requires exactly ${
        maxArgumentCount === 1 ? "one argument" : "one or two arguments"
      }.`,
  ),
  ImportCallNotNewExpression: _<"ImportCallNotNewExpression">(
    "Cannot use new with import(...).",
  ),
  ImportCallSpreadArgument: _<"ImportCallSpreadArgument">(
    "`...` is not allowed in `import()`.",
  ),
  IncompatibleRegExpUVFlags: _<"IncompatibleRegExpUVFlags">(
    "The 'u' and 'v' regular expression flags cannot be enabled at the same time.",
  ),
  InvalidBigIntLiteral: _<"InvalidBigIntLiteral">("Invalid BigIntLiteral."),
  InvalidCodePoint: _<"InvalidCodePoint">("Code point out of bounds."),
  InvalidCoverInitializedName: _<"InvalidCoverInitializedName">(
    "Invalid shorthand property initializer.",
  ),
  InvalidDecimal: _<"InvalidDecimal">("Invalid decimal."),
  InvalidDigit: _<"InvalidDigit", {| radix: number |}>(
    ({ radix }) => `Expected number in radix ${radix}.`,
  ),
  InvalidEscapeSequence: _<"InvalidEscapeSequence">(
    "Bad character escape sequence.",
  ),
  InvalidEscapeSequenceTemplate: _<"InvalidEscapeSequenceTemplate">(
    "Invalid escape sequence in template.",
  ),
  InvalidEscapedReservedWord: _<
    "InvalidEscapedReservedWord",
    {| reservedWord: string |},
  >(({ reservedWord }) => `Escape sequence in keyword ${reservedWord}.`),
  InvalidIdentifier: _<"InvalidIdentifier", {| identifierName: string |}>(
    ({ identifierName }) => `Invalid identifier ${identifierName}.`,
  ),
  InvalidLhs: _<"InvalidLhs", {| ancestor: LValAncestor |}>(
    ({ ancestor }) =>
      `Invalid left-hand side in ${toNodeDescription(ancestor)}.`,
  ),
  InvalidLhsBinding: _<"InvalidLhsBinding", {| ancestor: LValAncestor |}>(
    ({ ancestor }) =>
      `Binding invalid left-hand side in ${toNodeDescription(ancestor)}.`,
  ),
  InvalidNumber: _<"InvalidNumber">("Invalid number."),
  InvalidOrMissingExponent: _<"InvalidOrMissingExponent">(
    "Floating-point numbers require a valid exponent after the 'e'.",
  ),
  InvalidOrUnexpectedToken: _<
    "InvalidOrUnexpectedToken",
    {| unexpected: string |},
  >(({ unexpected }) => `Unexpected character '${unexpected}'.`),
  InvalidParenthesizedAssignment: _<"InvalidParenthesizedAssignment">(
    "Invalid parenthesized assignment pattern.",
  ),
  InvalidPrivateFieldResolution: _<
    "InvalidPrivateFieldResolution",
    {| identifierName: string |},
  >(({ identifierName }) => `Private name #${identifierName} is not defined.`),
  InvalidPropertyBindingPattern: _<"InvalidPropertyBindingPattern">(
    "Binding member expression.",
  ),
  InvalidRecordProperty: _<"InvalidRecordProperty">(
    "Only properties and spread elements are allowed in record definitions.",
  ),
  InvalidRestAssignmentPattern: _<"InvalidRestAssignmentPattern">(
    "Invalid rest operator's argument.",
  ),
  LabelRedeclaration: _<"LabelRedeclaration", {| labelName: string |}>(
    ({ labelName }) => `Label '${labelName}' is already declared.`,
  ),
  LetInLexicalBinding: _<"LetInLexicalBinding">(
    "'let' is not allowed to be used as a name in 'let' or 'const' declarations.",
  ),
  LineTerminatorBeforeArrow: _<"LineTerminatorBeforeArrow">(
    "No line break is allowed before '=>'.",
  ),
  MalformedRegExpFlags: _<"MalformedRegExpFlags">(
    "Invalid regular expression flag.",
  ),
  MissingClassName: _<"MissingClassName">("A class name is required."),
  MissingEqInAssignment: _<"MissingEqInAssignment">(
    "Only '=' operator can be used for specifying default value.",
  ),
  MissingSemicolon: _<"MissingSemicolon">("Missing semicolon."),
  MissingPlugin: _<"MissingPlugin", {| missingPlugin: [string] |}>(
    ({ missingPlugin }) =>
      `This experimental syntax requires enabling the parser plugin: ${missingPlugin
        .map(name => JSON.stringify(name))
        .join(", ")}.`,
  ),
  // FIXME: Would be nice to make this "missingPlugins" instead.
  // Also), seems like we can drop the "(s)" from the message and just make it "s".
  MissingOneOfPlugins: _<"MissingOneOfPlugins", {| missingPlugin: string[] |}>(
    ({ missingPlugin }) =>
      `This experimental syntax requires enabling one of the following parser plugin(s): ${missingPlugin
        .map(name => JSON.stringify(name))
        .join(", ")}.`,
  ),
  MissingUnicodeEscape: _<"MissingUnicodeEscape">(
    "Expecting Unicode escape sequence \\uXXXX.",
  ),
  MixingCoalesceWithLogical: _<"MixingCoalesceWithLogical">(
    "Nullish coalescing operator(??) requires parens when mixing with logical operators.",
  ),
  ModuleAttributeDifferentFromType: _<"ModuleAttributeDifferentFromType">(
    "The only accepted module attribute is `type`.",
  ),
  ModuleAttributeInvalidValue: _<"ModuleAttributeInvalidValue">(
    "Only string literals are allowed as module attribute values.",
  ),
  ModuleAttributesWithDuplicateKeys: _<
    "ModuleAttributesWithDuplicateKeys",
    {| key: string |},
  >(({ key }) => `Duplicate key "${key}" is not allowed in module attributes.`),
  ModuleExportNameHasLoneSurrogate: _<
    "ModuleExportNameHasLoneSurrogate",
    {| surrogateCharCode: number |},
  >(
    ({ surrogateCharCode }) =>
      `An export name cannot include a lone surrogate, found '\\u${surrogateCharCode.toString(
        16,
      )}'.`,
  ),
  ModuleExportUndefined: _<"ModuleExportUndefined", {| localName: string |}>(
    ({ localName }) => `Export '${localName}' is not defined.`,
  ),
  MultipleDefaultsInSwitch: _<"MultipleDefaultsInSwitch">(
    "Multiple default clauses.",
  ),
  NewlineAfterThrow: _<"NewlineAfterThrow">("Illegal newline after throw."),
  NoCatchOrFinally: _<"NoCatchOrFinally">("Missing catch or finally clause."),
  NumberIdentifier: _<"NumberIdentifier">("Identifier directly after number."),
  NumericSeparatorInEscapeSequence: _<"NumericSeparatorInEscapeSequence">(
    "Numeric separators are not allowed inside unicode escape sequences or hex escape sequences.",
  ),
  ObsoleteAwaitStar: _<"ObsoleteAwaitStar">(
    "'await*' has been removed from the async functions proposal. Use Promise.all() instead.",
  ),
  OptionalChainingNoNew: _<"OptionalChainingNoNew">(
    "Constructors in/after an Optional Chain are not allowed.",
  ),
  OptionalChainingNoTemplate: _<"OptionalChainingNoTemplate">(
    "Tagged Template Literals are not allowed in optionalChain.",
  ),
  OverrideOnConstructor: _<"OverrideOnConstructor">(
    "'override' modifier cannot appear on a constructor declaration.",
  ),
  ParamDupe: _<"ParamDupe">("Argument name clash."),
  PatternHasAccessor: _<"PatternHasAccessor">(
    "Object pattern can't contain getter or setter.",
  ),
  PatternHasMethod: _<"PatternHasMethod">(
    "Object pattern can't contain methods.",
  ),
  PrivateInExpectedIn: _<"PrivateInExpectedIn", {| identifierName: string |}>(
    ({ identifierName }) =>
      `Private names are only allowed in property accesses (\`obj.#${identifierName}\`) or in \`in\` expressions (\`#${identifierName} in obj\`).`,
  ),
  PrivateNameRedeclaration: _<
    "PrivateNameRedeclaration",
    {| identifierName: string |},
  >(({ identifierName }) => `Duplicate private name #${identifierName}.`),
  RecordExpressionBarIncorrectEndSyntaxType:
    _<"RecordExpressionBarIncorrectEndSyntaxType">(
      "Record expressions ending with '|}' are only allowed when the 'syntaxType' option of the 'recordAndTuple' plugin is set to 'bar'.",
    ),
  RecordExpressionBarIncorrectStartSyntaxType:
    _<"RecordExpressionBarIncorrectStartSyntaxType">(
      "Record expressions starting with '{|' are only allowed when the 'syntaxType' option of the 'recordAndTuple' plugin is set to 'bar'.",
    ),
  RecordExpressionHashIncorrectStartSyntaxType:
    _<"RecordExpressionHashIncorrectStartSyntaxType">(
      "Record expressions starting with '#{' are only allowed when the 'syntaxType' option of the 'recordAndTuple' plugin is set to 'hash'.",
    ),
  RecordNoProto: _<"RecordNoProto">(
    "'__proto__' is not allowed in Record expressions.",
  ),
  RestTrailingComma: _<"RestTrailingComma">(
    "Unexpected trailing comma after rest element.",
  ),
  SloppyFunction: _<"SloppyFunction">(
    "In non-strict mode code, functions can only be declared at top level, inside a block, or as the body of an if statement.",
  ),
  StaticPrototype: _<"StaticPrototype">(
    "Classes may not have static property named prototype.",
  ),
  SuperNotAllowed: _<"SuperNotAllowed">(
    "`super()` is only valid inside a class constructor of a subclass. Maybe a typo in the method name ('constructor') or not extending another class?",
  ),
  SuperPrivateField: _<"SuperPrivateField">(
    "Private fields can't be accessed on super.",
  ),
  TrailingDecorator: _<"TrailingDecorator">(
    "Decorators must be attached to a class element.",
  ),
  TupleExpressionBarIncorrectEndSyntaxType:
    _<"TupleExpressionBarIncorrectEndSyntaxType">(
      "Tuple expressions ending with '|]' are only allowed when the 'syntaxType' option of the 'recordAndTuple' plugin is set to 'bar'.",
    ),
  TupleExpressionBarIncorrectStartSyntaxType:
    _<"TupleExpressionBarIncorrectStartSyntaxType">(
      "Tuple expressions starting with '[|' are only allowed when the 'syntaxType' option of the 'recordAndTuple' plugin is set to 'bar'.",
    ),
  TupleExpressionHashIncorrectStartSyntaxType:
    _<"TupleExpressionHashIncorrectStartSyntaxType">(
      "Tuple expressions starting with '#[' are only allowed when the 'syntaxType' option of the 'recordAndTuple' plugin is set to 'hash'.",
    ),
  UnexpectedArgumentPlaceholder: _<"UnexpectedArgumentPlaceholder">(
    "Unexpected argument placeholder.",
  ),
  UnexpectedAwaitAfterPipelineBody: _<"UnexpectedAwaitAfterPipelineBody">(
    'Unexpected "await" after pipeline body; await must have parentheses in minimal proposal.',
  ),
  UnexpectedDigitAfterHash: _<"UnexpectedDigitAfterHash">(
    "Unexpected digit after hash token.",
  ),
  UnexpectedImportExport: _<"UnexpectedImportExport">(
    "'import' and 'export' may only appear at the top level.",
  ),
  UnexpectedKeyword: _<"UnexpectedKeyword", {| keyword: string |}>(
    ({ keyword }) => `Unexpected keyword '${keyword}'.`,
  ),
  UnexpectedLeadingDecorator: _<"UnexpectedLeadingDecorator">(
    "Leading decorators must be attached to a class declaration.",
  ),
  UnexpectedLexicalDeclaration: _<"UnexpectedLexicalDeclaration">(
    "Lexical declaration cannot appear in a single-statement context.",
  ),
  UnexpectedNewTarget: _<"UnexpectedNewTarget">(
    "`new.target` can only be used in functions or class properties.",
  ),
  UnexpectedNumericSeparator: _<"UnexpectedNumericSeparator">(
    "A numeric separator is only allowed between two digits.",
  ),
  UnexpectedPrivateField: _<"UnexpectedPrivateField">(
    "Unexpected private name.",
  ),
  UnexpectedReservedWord: _<
    "UnexpectedReservedWord",
    {| reservedWord: string |},
  >(({ reservedWord }) => `Unexpected reserved word '${reservedWord}'.`),
  UnexpectedSuper: _<"UnexpectedSuper">(
    "'super' is only allowed in object methods and classes.",
  ),
  UnexpectedToken: _<
    *,
    {|
      expected?: ?string,
      unexpected?: ?string,
    |},
  >(
    ({ expected, unexpected }) =>
      `Unexpected token${unexpected ? ` '${unexpected}'.` : ""}${
        expected ? `, expected "${expected}"` : ""
      }`,
  ),
  UnexpectedTokenUnaryExponentiation: _<"UnexpectedTokenUnaryExponentiation">(
    "Illegal expression. Wrap left hand side or entire exponentiation in parentheses.",
  ),
  UnsupportedBind: _<"UnsupportedBind">(
    "Binding should be performed on object property.",
  ),
  UnsupportedDecoratorExport: _<"UnsupportedDecoratorExport">(
    "A decorated export must export a class declaration.",
  ),
  UnsupportedDefaultExport: _<"UnsupportedDefaultExport">(
    "Only expressions, functions or classes are allowed as the `default` export.",
  ),
  UnsupportedImport: _<"UnsupportedImport">(
    "`import` can only be used in `import()` or `import.meta`.",
  ),
  UnsupportedMetaProperty: _<
    *,
    {|
      target: string,
      onlyValidPropertyName: string,
    |},
  >(
    ({ target, onlyValidPropertyName }) =>
      `The only valid meta property for ${target} is ${target}.${onlyValidPropertyName}.`,
  ),
  UnsupportedParameterDecorator: _<"UnsupportedParameterDecorator">(
    "Decorators cannot be used to decorate parameters.",
  ),
  UnsupportedPropertyDecorator: _<"UnsupportedPropertyDecorator">(
    "Decorators cannot be used to decorate object literal properties.",
  ),
  UnsupportedSuper: _<"UnsupportedSuper">(
    "'super' can only be used with function calls (i.e. super()) or in property accesses (i.e. super.prop or super[prop]).",
  ),
  UnterminatedComment: _<"UnterminatedComment">("Unterminated comment."),
  UnterminatedRegExp: _<"UnterminatedRegExp">(
    "Unterminated regular expression.",
  ),
  UnterminatedString: _<"UnterminatedString">("Unterminated string constant."),
  UnterminatedTemplate: _<"UnterminatedTemplate">("Unterminated template."),
  VarRedeclaration: _<"VarRedeclaration", {| identifierName: string |}>(
    ({ identifierName }) =>
      `Identifier '${identifierName}' has already been declared.`,
  ),
  YieldBindingIdentifier: _<"YieldBindingIdentifier">(
    "Can not use 'yield' as identifier inside a generator.",
  ),
  YieldInParameter: _<"YieldInParameter">(
    "Yield expression is not allowed in formal parameters.",
  ),
  ZeroDigitNumericSeparator: _<"ZeroDigitNumericSeparator">(
    "Numeric separator can not be used after leading 0.",
  ),
});
