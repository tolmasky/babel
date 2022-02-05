import SyntaxNode from "../../syntax-node";

// https://tc39.es/ecma262/#prod-LexicalDeclaration
export interface LexicalDeclaration
  extends SyntaxNode<"LexicalDeclaration", "VariableDeclaration"> {
    kind: "let" | "const";
    // declarations: readonly VariableDeclarator[];
  };

export default LexicalDeclaration;
