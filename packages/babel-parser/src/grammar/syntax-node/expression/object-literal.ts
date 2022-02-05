import type SyntaxNode from "../../syntax-node";
import IdentifierReference from "./identifier-reference";
import SpreadElement from "./spread-element";

// https://tc39.es/ecma262/#prod-ObjectLiteral
export type ObjectLiteral = SyntaxNode<{
  type: "ObjectExpression";
  GrammarSymbol: "ObjectLiteral";

  properties: PropertyDefinitionList;
}>;

export default ObjectLiteral;

// https://tc39.es/ecma262/#prod-PropertyDefinitionList
type PropertyDefinitionList = PropertyDefinition[];

// https://tc39.es/ecma262/#prod-PropertyDefinition
type PropertyDefinition =
  | IdentifierReference
  | SpreadElement;

// export type ObjectLiteralElement = ObjectProperty | ObjectMethod | SpreadElement;

