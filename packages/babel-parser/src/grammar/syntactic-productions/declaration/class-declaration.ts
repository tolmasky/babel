import SyntacticProduction from "../../syntactic-production";

// https://tc39.es/ecma262/#prod-ClassDeclaration
export interface ClassDeclaration
  extends SyntacticProduction<"ClassDeclaration"> {
    // declarations: readonly VariableDeclarator[];
  }

export default ClassDeclaration;
