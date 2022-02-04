import SyntacticProduction from "../../syntactic-production";

// https://tc39.es/ecma262/#prod-LexicalDeclaration
export interface LexicalDeclaration
  extends SyntacticProduction<"LexicalDeclaration", "VariableDeclaration"> {
    kind: "let" | "const";
    // declarations: readonly VariableDeclarator[];
  };

export default LexicalDeclaration;
