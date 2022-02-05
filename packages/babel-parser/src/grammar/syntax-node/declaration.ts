import HoistableDeclaration from "./declaration/hoistable-declaration";
import ClassDeclaration from "./declaration/class-declaration";
import LexicalDeclaration from "./declaration/lexical-declaration";

// https://tc39.es/ecma262/#prod-Declaration
export type Declaration =
  | HoistableDeclaration
  | ClassDeclaration
  | LexicalDeclaration;

export default Declaration;

export * from "./declaration/hoistable-declaration";
export * from "./declaration/class-declaration";
export * from "./declaration/lexical-declaration";
