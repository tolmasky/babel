import type SyntaxNode from "../syntax-node";

// IdentifierNameNode?
export default interface IdentifierName<GrammarSymbol>
  extends SyntaxNode<GrammarSymbol, "Identifier"> {
  name: string;
}
