import type SyntaxNode from "../syntax-node";
import BindingIdentifier from "./bindings/binding-identifier";
import { BindingElement, BindingRestElement } from "./bindings/binding-pattern";

type BlockStatement = { };


export default interface FunctionNode<GrammarSymbol, type, isGenerator, isAsync>
  extends SyntaxNode<GrammarSymbol, type> {
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
