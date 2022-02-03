import type SyntacticProduction from "../syntactic-production";

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

interface ToHoistableDeclaration<GrammarSymbol, isGenerator, isAsync>
  extends SyntacticProduction<GrammarSymbol, "FunctionDeclaration"> {
  id: IdentifierBinding | null;
  body: BlockStatement;

  parameters: FormalParameters;

  generator: isGenerator;
  async: isAsync;
}

// https://tc39.es/ecma262/#prod-FormalParameters
type FormalParameters = [...FormalParameter[], FunctionRestParameter];

type FormalParameter = BindingElement;
type FunctionRestParameter = BindingRestParameter;
