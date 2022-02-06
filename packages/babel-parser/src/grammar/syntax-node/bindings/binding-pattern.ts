import { SyntaxNode, Traversable, AllowsTrailingComma } from "../../syntax-node";
import BindingIdentifier from "./binding-identifier";
import PropertyName from "../property-name";
import Decorator from "../decorator";

type AssignmentExpression = {};

export type BindingPattern = ObjectBindingPattern | ArrayBindingPattern;

export default BindingPattern;

// https://tc39.es/ecma262/#prod-ObjectBindingPattern
export type ObjectBindingPattern = SyntaxNode<{
  type: "ObjectPattern";
  GrammarSymbol: "ObjectBindingPattern";

  properties: BindingPropertyList | Traversable<0> | AllowsTrailingComma;
  decorators?: Decorator[] | Traversable<1>;
}>;

// https://tc39.es/ecma262/#prod-BindingPropertyList
type BindingPropertyList = [...BindingProperty[], BindingRestElement];

// https://tc39.es/ecma262/#prod-BindingRestProperty
export type BindingRestProperty = SyntaxNode<{
  type: "RestElement";
  GrammarSymbol: "BindingRestProperty"

  argument: BindingIdentifier | Traversable<0>;
}>;


// https://tc39.es/ecma262/#prod-BindingProperty
export type BindingProperty = SyntaxNode<{
  type: "ObjectProperty";
  GrammarSymbol: "BindingProperty";

  key: PropertyName | Traversable<0>;
  value: BindingElement | Traversable<1>;
}>;

// https://tc39.es/ecma262/#prod-ArrayBindingPattern
export type ArrayBindingPattern = SyntaxNode<{
  type: "ArrayPattern";
  GrammarSymbol: "ArrayBindingPattern";

  elements: BindingElementList | Traversable<0>;
}>;

// https://tc39.es/ecma262/#prod-BindingElementList
export type BindingElementList = [
  ...(BindingElement | BindingElisionElement)[],
  BindingRestElement
];

// https://tc39.es/ecma262/#prod-BindingElement
export type BindingElement = SingleNameBinding | AssignmentPattern;

// https://tc39.es/ecma262/#prod-SingleNameBinding
export type SingleNameBinding = SyntaxNode<{
  type: "AssignmentPattern";
  GrammarSymbol: "SingleNameBinding";

  left: BindingIdentifier | Traversable<0>;
  right: AssignmentExpression | Traversable<1>;
}>;

export type AssignmentPattern = SyntaxNode<{
  type: "AssignmentPattern";

  left: BindingPattern | Traversable<0>;
  right: AssignmentExpression | Traversable<1>;
}>;

type BindingElisionElement = null;

// https://tc39.es/ecma262/#prod-BindingRestElement
export type BindingRestElement = SyntaxNode<{
  type: "RestElement";
  GrammarSymbol: "BindingRestElement";

  argument: BindingIdentifier | BindingPattern | Traversable<0>;
}>;
