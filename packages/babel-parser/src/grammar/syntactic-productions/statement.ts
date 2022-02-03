import HoistableDeclaration from "./hoistable-declaration";

export type Statement =
  | HoistableDeclaration;

export default Statement;

export * from "./hoistable-declaration";
