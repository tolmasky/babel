import SyntaxNode from "../../syntax-node";

// https://tc39.es/ecma262/#prod-ClassDeclaration
export interface ClassDeclaration
  extends SyntaxNode<"ClassDeclaration"> {
    // declarations: readonly VariableDeclarator[];
  }

export default ClassDeclaration;
