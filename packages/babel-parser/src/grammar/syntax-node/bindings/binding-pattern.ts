import SyntaxNode from "../../syntax-node";
import BindingIdentifier from "./binding-identifier";

type AssignmentExpression = {};

export type BindingPattern = ObjectBindingPattern | ArrayBindingPattern;

export default BindingPattern;

// https://tc39.es/ecma262/#prod-ObjectBindingPattern
export interface ObjectBindingPattern
  extends SyntaxNode<"ObjectBindingPattern", "ObjectPattern"> {
  properties: BindingPropertyList;
}

// https://tc39.es/ecma262/#prod-BindingPropertyList
type BindingPropertyList = [...BindingProperty[], BindingRestElement];

// https://tc39.es/ecma262/#prod-BindingRestProperty
export interface BindingRestProperty
  extends SyntaxNode<"BindingRestProperty", "RestElement"> {
  argument: BindingIdentifier;
}

// https://tc39.es/ecma262/#prod-BindingProperty
export interface BindingProperty
  extends SyntaxNode<"BindingProperty", "ObjectProperty"> {}

// https://tc39.es/ecma262/#prod-ArrayBindingPattern
export interface ArrayBindingPattern
  extends SyntaxNode<"ArrayBindingPattern", "ArrayPattern"> {
  elements: BindingElementList;
}

// https://tc39.es/ecma262/#prod-BindingElementList
export type BindingElementList = [
  ...(BindingElement | BindingElisionElement)[],
  BindingRestElement
];

// https://tc39.es/ecma262/#prod-BindingElement
export type BindingElement = SingleNameBinding | AssignmentPattern;

// https://tc39.es/ecma262/#prod-SingleNameBinding
export interface SingleNameBinding
  extends SyntaxNode<"SingleNameBinding", "AssignmentPattern"> {
  left: BindingIdentifier;
  right: AssignmentExpression;
}

export interface AssignmentPattern
  extends SyntaxNode<"AssignmentPattern", "AssignmentPattern"> {
  left: BindingPattern;
  right: AssignmentExpression;
}

type BindingElisionElement = null;

// https://tc39.es/ecma262/#prod-BindingRestElement
export interface BindingRestElement
  extends SyntaxNode<"BindingRestElement", "RestElement"> {
  argument: BindingIdentifier | BindingPattern;
}
