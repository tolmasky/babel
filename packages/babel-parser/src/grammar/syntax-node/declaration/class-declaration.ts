import SyntaxNode from "../../syntax-node";

// https://tc39.es/ecma262/#prod-ClassDeclaration
export type ClassDeclaration = SyntaxNode<{
  type: "ClassDeclaration";
    // declarations: readonly VariableDeclarator[];
}>;

export default ClassDeclaration;
