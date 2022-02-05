import type SyntaxNode from "../syntax-node";

// IdentifierNameNode?
export type IdentifierName<GrammarSymbol extends string> = SyntaxNode<{
  type: "Identifier";
  GrammarSymbol: GrammarSymbol;

  name: string;
}>;

export default IdentifierName;
