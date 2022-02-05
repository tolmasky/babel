import type FunctionNode from "../function-node";

// https://tc39.es/ecma262/#prod-HoistableDeclaration
export type HoistableDeclaration =
  | FunctionDeclaration
  | GeneratorDeclaration
  | AsyncFunctionDeclaration
  | AsyncGeneratorDeclaration;

export default HoistableDeclaration;

// https://tc39.es/ecma262/#prod-FunctionDeclaration
export interface FunctionDeclaration
  extends HoistableDeclarationNode<"FunctionDeclaration", false, false> {}

// https://tc39.es/ecma262/#prod-GeneratorDeclaration
export interface GeneratorDeclaration
  extends HoistableDeclarationNode<"GeneratorDeclaration", true, false> {}

// https://tc39.es/ecma262/#prod-AsyncFunctionDeclaration
export interface AsyncFunctionDeclaration
  extends HoistableDeclarationNode<"AsyncFunctionDeclaration", false, true> {}

// https://tc39.es/ecma262/#prod-AsyncGeneratorDeclaration
export interface AsyncGeneratorDeclaration
  extends HoistableDeclarationNode<"AsyncGeneratorDeclaration", true, true> {}

type HoistableDeclarationNode<GrammarSymbol, isGenerator, isAsync> =
    FunctionNode<GrammarSymbol, "FunctionDeclaration", isGenerator, isAsync>;
