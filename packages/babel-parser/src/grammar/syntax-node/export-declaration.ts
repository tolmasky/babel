import SyntaxNode from "../syntax-node";
import ClassDeclaration from "./declaration/class-declaration";
import HoistableDeclaration from "./declaration/hoistable-declaration";

export type ExportDeclaration =
  | ExportNamedDeclaration
  | ExportDefaultDeclaration;

export default ExportDeclaration;

export type ExportNamedDeclaration = SyntaxNode<{
  type: "ExportNamedDeclaration";

  declaration: HoistableDeclaration;
}>;

export type ExportDefaultDeclaration = SyntaxNode<{
  type: "ExportDefaultDeclaration";

  delcaration: HoistableDeclaration | ClassDeclaration | AssignmentExpression;
}>;

type AssignmentExpression = {};
