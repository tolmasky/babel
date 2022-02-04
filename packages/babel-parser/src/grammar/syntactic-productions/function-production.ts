import type SyntacticProduction from "../syntactic-production";

type IdentifierBinding = { };
type BindingElement = {};
type BindingRestParameter = { };
type BlockStatement = { };


export default interface ToFunctionProduction<GrammarSymbol, type, isGenerator, isAsync>
  extends SyntacticProduction<GrammarSymbol, type> {
  // This can be null in export default declarations.
  id: IdentifierBinding | null;
  body: BlockStatement;

  params: FormalParameters;

  generator: isGenerator;
  async: isAsync;
}

// https://tc39.es/ecma262/#prod-FormalParameters
type FormalParameters = [...FormalParameter[], FunctionRestParameter];

type FormalParameter = BindingElement;
type FunctionRestParameter = BindingRestParameter;
