import type SyntacticProduction from "../../syntactic-production";

type AssignmentExpression = { }

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
export default interface SpreadElement
  extends SyntacticProduction<"SpreadElement"> {
  argument: AssignmentExpression;
}

