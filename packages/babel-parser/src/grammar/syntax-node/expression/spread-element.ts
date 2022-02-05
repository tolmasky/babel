import type SyntaxNode from "../../syntax-node";

type AssignmentSyntaxNode = { }

// https://tc39.es/ecma262/#prod-SpreadElement
//
// BABEL-ECMA-BRIDGE-NOTE: In Babel, `argument` is an `SyntaxNode` instead of an
// `AssignmentSyntaxNode`, which means it allows for unparenthesized
// `SequenceSyntaxNode`s, by which we mean a `SequenceSyntaxNode` that is
// neither a child of `ParenthesizedSyntaxNode` nor having `extra.parenthesized`
// set to `true`. This means that the generator must do extra work to infer that
// parenthesis are needed at generation time. This can be chalked up to Babel's
// *A(bstract)ST* nature, vs. ECMAScript's grammar being a *C(oncrete)ST*.
//
// We are however choosing to enforce the ECMAScript grammar here, since we are
// parsing from the source text, where this would be an impossibility. It is
// worth considering surfacing this restriction to the main Babel AST too
// though, as it may be helpful during code transformations.
export type SpreadElement = SyntaxNode<{
  type: "SpreadElement";

  argument: AssignmentSyntaxNode;
}>;

export default SpreadElement;
