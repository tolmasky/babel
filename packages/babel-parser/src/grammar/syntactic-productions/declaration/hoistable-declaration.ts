import type FunctionProduction from "../function-production";

type IdentifierBinding = { };
type BindingElement = {};
type BindingRestParameter = { };
type BlockStatement = { };


// https://tc39.es/ecma262/#prod-HoistableDeclaration
export type HoistableDeclaration =
  | FunctionDeclaration
  | GeneratorDeclaration
  | AsyncFunctionDeclaration
  | AsyncGeneratorDeclaration;

export default HoistableDeclaration;

// https://tc39.es/ecma262/#prod-FunctionDeclaration
export interface FunctionDeclaration
  extends ToHoistableDeclaration<"FunctionDeclaration", false, false> {}

// https://tc39.es/ecma262/#prod-GeneratorDeclaration
export interface GeneratorDeclaration
  extends ToHoistableDeclaration<"GeneratorDeclaration", true, false> {}

// https://tc39.es/ecma262/#prod-AsyncFunctionDeclaration
export interface AsyncFunctionDeclaration
  extends ToHoistableDeclaration<"AsyncFunctionDeclaration", false, true> {}

// https://tc39.es/ecma262/#prod-AsyncGeneratorDeclaration
export interface AsyncGeneratorDeclaration
  extends ToHoistableDeclaration<"AsyncGeneratorDeclaration", true, true> {}

type ToHoistableDeclaration<GrammarSymbol, isGenerator, isAsync> =
    FunctionProduction<GrammarSymbol, "FunctionDeclaration", isGenerator, isAsync>;
