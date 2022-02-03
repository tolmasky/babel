import type SyntacticProduction from "../syntactic-production";

type AssignmentExpression = {};

// https://tc39.es/ecma262/#prod-ArrayLiteral
//
// BABEL-ECMA-BRIDGE-NOTE: In Babel, we call `ArrayLiteral`s `ArrayExpression`s.
// I actually agree that this is a better name, but whatcha gonna do?
export interface ArrayLiteral
  extends SyntacticProduction<"ArrayLiteral", "ArrayExpression"> {
  argument: ElementList;
}

export default ArrayLiteral;

// https://tc39.es/ecma262/#prod-ElementList
//
// NOTE: Have to get creative with this definition, because
// `ArrayLiteralElement` doesn't exist as a syntax production in the ECMAScript
// specificiation. We instead infer it from the left recursion in
// `ElementList`'s definition. However, in the end what it means is that any of
// these productions can appear in the `ElementList` in any position.
export type ElementList = ArrayLiteralElement[];

type ArrayLiteralElement = Elision | AssignmentExpression | SpreadElement;

// https://tc39.es/ecma262/#prod-Elision
//
// NOTE: This is unfortunate, as we'd much prefer this to be an actual object.
// I tried using the same trick as with the ECMAScript grammar bridge, but
// unfortunately `null & SyntacticProduction<"Elision">` results in `never`,
// so it doesn't work. 
export type Elision = null;

// https://tc39.es/ecma262/#prod-SpreadElement
//
// BABEL-ECMA-BRIDGE-NOTE: In Babel, `argument` is an `Expression` instead of an
// `AssignmentExpression`, which means it allows for unparenthesized
// `SequenceExpression`s, by which we mean a `SequenceExpression` that is
// neither a child of `ParenthesizedExpression` nor having `extra.parenthesized`
// set to `true`. This means that the generator must do extra work to infer that
// parenthesis are needed at generation time. This can be chalked up to Babel's
// *A(bstract)ST* nature, vs. ECMAScript's grammar being a *C(oncrete)ST*.
//
// We are however choosing to enforce the ECMAScript grammar here, since we are
// parsing from the source text, where this would be an impossibility. It is
// worth considering surfacing this restriction to the main Babel AST too
// though, as it may be helpful during code transformations.
export interface SpreadElement extends SyntacticProduction<"SpreadElement"> {
  argument: AssignmentExpression;
}
