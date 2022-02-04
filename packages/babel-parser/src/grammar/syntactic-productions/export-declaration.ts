import SyntactiProduction from "../syntactic-production";
import HoistableDeclaration from "./hoistable-declaration";

export type ExportDeclaration =
  | ExportNamedDeclaration
  | ExportDefaultDeclaration;

export default ExportDeclaration;

export interface ExportNamedDeclaration
  extends SyntactiProduction<"ExportNamedDeclaration"> {
  declaration: HoistableDeclaration;
}

export interface ExportDefaultDeclaration
  extends SyntactiProduction<"ExportDefaultDeclaration"> {
  delcaration: HoistableDeclaration | ClassDeclaration | AssignmentExpression;
}

type ClassDeclaration = {};
type AssignmentExpression = {};
