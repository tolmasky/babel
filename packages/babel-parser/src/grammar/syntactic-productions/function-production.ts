import type SyntacticProduction from "../syntactic-production";
import BindingIdentifier from "./bindings/binding-identifier";
import { BindingElement, BindingRestElement } from "./bindings/binding-pattern";

type BlockStatement = { };


export default interface ToFunctionProduction<GrammarSymbol, type, isGenerator, isAsync>
  extends SyntacticProduction<GrammarSymbol, type> {
  // This can be null in export default declarations.
  id: BindingIdentifier | null;
  body: BlockStatement;

  params: FormalParameters;

  generator: isGenerator;
  async: isAsync;
}

// https://tc39.es/ecma262/#prod-FormalParameters
export type FormalParameters = [...FormalParameter[], FunctionRestParameter];

export type FormalParameter = BindingElement;
export type FunctionRestParameter = BindingRestElement;
