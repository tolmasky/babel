import SyntaxNode from "../../syntax-node";
import SpreadElement from "./spread-element"; 

type AssignmentExpression = {};

// https://tc39.es/ecma262/#prod-ArrayLiteral
//
// BABEL-ECMA-BRIDGE-NOTE: In Babel, we call `ArrayLiteral`s `ArrayExpression`s.
// I actually agree that this is a better name, but whatcha gonna do?
export type ArrayLiteral = SyntaxNode<{
  type: "ArrayExpression";
  GrammarSymbol: "ArrayLiteral";

  elements: ElementList;
}>;

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
// unfortunately `null & SyntaxNode<Elision>` results in `never`,
// so it doesn't work. 
export type Elision = null;
