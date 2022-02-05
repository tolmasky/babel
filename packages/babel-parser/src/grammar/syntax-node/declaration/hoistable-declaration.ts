import { FunctionNode, Annotation } from "../function-node";

// https://tc39.es/ecma262/#prod-HoistableDeclaration
export type HoistableDeclaration =
  | FunctionDeclaration
  | GeneratorDeclaration
  | AsyncFunctionDeclaration
  | AsyncGeneratorDeclaration;

export default HoistableDeclaration;

// https://tc39.es/ecma262/#prod-FunctionDeclaration
export type FunctionDeclaration = FunctionNode<{
  type: "FunctionDeclaration"
}>;

// https://tc39.es/ecma262/#prod-GeneratorDeclaration
export type GeneratorDeclaration = FunctionNode<
  Annotation.Generator | {
    type: "FunctionDeclaration";
    GrammarSymbol: "GeneratorDeclaration";
}>;

// https://tc39.es/ecma262/#prod-AsyncFunctionDeclaration
export type AsyncFunctionDeclaration = FunctionNode<
  Annotation.Asynchronous | {
    type: "FunctionDeclaration";
    GrammarSymbol: "AsyncFunctionDeclaration"
}>;

// https://tc39.es/ecma262/#prod-AsyncGeneratorDeclaration
export type AsyncGeneratorDeclaration = FunctionNode<
  Annotation.Asynchronous |
  Annotation.Generator | {
    type:"FunctionDeclaration";
    GrammarSymbol: "AsyncGeneratorDeclaration"
}>;
