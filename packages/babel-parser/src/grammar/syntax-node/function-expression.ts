import { FunctionNode, Annotation } from "./function-node";

export type FunctionExpression = FunctionNode<{
  type: "FunctionExpression"
}>;

export type GeneratorExpression = FunctionNode<
  Annotation.Generator | {
    type: "FunctionExpression";
    GrammarSymbol: "GeneratorExpression"
}>;

export type AsyncGeneratorExpression = FunctionNode<
  Annotation.Asynchronous |
  Annotation.Generator | {
    type: "FunctionExpression";
    GrammarSymbol: "AsyncGeneratorExpression"
}>;

export type AsyncFunctionExpression = FunctionNode<
  Annotation.Asynchronous | {
    type: "FunctionExpression";
    GrammarSymbol: "AsyncFunctionExpression";
}>;

export type ArrowFunction = FunctionNode<{
  type: "ArrowFunctionExpression";
  GrammarSymbol: "ArrowFunction";
}>;

export type AsyncArrowFunction = FunctionNode<
  Annotation.Asynchronous | {
    type: "ArrowFunctionExpression";
    GrammarSymbol: "AsyncArrowFunction";
}>;
