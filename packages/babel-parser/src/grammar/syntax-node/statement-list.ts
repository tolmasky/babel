import Statement from "./statement";
import Declaration from "./declaration";

// https://tc39.es/ecma262/#prod-StatementList
export type StatementList = StatementListItem[];

export default StatementList;

// https://tc39.es/ecma262/#prod-StatementListItem
export type StatementListItem =
  | Statement
  | Declaration;

export * from "./declaration";
export * from "./statement";
