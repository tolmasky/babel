import SyntaxNode from "../../syntax-node";

// https://tc39.es/ecma262/#prod-LexicalDeclaration
export type LexicalDeclaration = SyntaxNode<{
  type: "VariableDeclaration";
  GrammarSymbol: "LexicalDeclaration"

  kind: "let" | "const";
    // declarations: readonly VariableDeclarator[];
}>;

export default LexicalDeclaration;
