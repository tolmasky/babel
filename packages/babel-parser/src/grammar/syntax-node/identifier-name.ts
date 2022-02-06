import { SyntaxNode, Traversable } from "../syntax-node";

// IdentifierNameNode?
export type IdentifierName<GrammarSymbol extends string> = SyntaxNode<{
  type: "Identifier";
  GrammarSymbol: GrammarSymbol;

  name: string;
}>;

export default IdentifierName;

// https://tc39.es/ecma262/#prod-PrivateIdentifier
export type PrivateIdentifier = SyntaxNode<{
  type: "Identifier";
  GrammarSymbol: "PrivateIdentifier";

  id: PrivateIdentifierName | Traversable<0>;
}>;

export type PrivateIdentifierName = IdentifierName<"PrivateIdentifierName">;