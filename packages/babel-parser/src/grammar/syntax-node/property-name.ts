import { StringLiteral, NumericLiteral } from "./literal";
import IdentifierName from "./identifier-name";

// https://tc39.es/ecma262/#prod-PropertyName
export type PropertyName =
  | LiteralPropertyName
  | ComputedPropertyName

export default PropertyName;

export type LiteralPropertyName =
  | LiteralPropertyIdentifier
  | StringLiteral
  | NumericLiteral

export type LiteralPropertyIdentifier = IdentifierName<"LiteralPropertyIdentifier">;

// Should be owned...
export type ComputedPropertyName = {};//AssignmentExpression;