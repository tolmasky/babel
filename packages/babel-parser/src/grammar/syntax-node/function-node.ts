import { Specification } from "../source-node";
import { SyntaxNode, Traversable } from "../syntax-node";
import BindingIdentifier from "./bindings/binding-identifier";
import { BindingElement, BindingRestElement } from "./bindings/binding-pattern";
import StatementList from "./statement-list";

export enum Annotation {
  Asynchronous,
  Generator
};

export type FunctionNode<specification extends Specification | Annotation> = SyntaxNode<
  Exclude<specification, Annotation.Asynchronous | Annotation.Generator> & {

  id: BindingIdentifier | null;
  params: FormalParameters;

  body: FunctionBody;

  generator: specification extends Annotation.Generator ? true : false;
  async: specification extends Annotation.Asynchronous ? true : false;
}>;

export default FunctionNode;

// https://tc39.es/ecma262/#prod-FunctionBody
export type FunctionBody = SyntaxNode<{
  type: "BlockStatement";

  body: StatementList | Traversable<0>;
}>;

// https://tc39.es/ecma262/#prod-FormalParameters
export type FormalParameters = [...FormalParameter[], FunctionRestParameter];

export type FormalParameter = BindingElement;
export type FunctionRestParameter = BindingRestElement;
