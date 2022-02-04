export * from "./grammar/source-location";

export * from "./grammar/lexical-productions/comment";

export * from "./grammar/syntactic-productions/statement";
export * from "./grammar/syntactic-productions/expression";

export * from "./grammar/syntactic-productions/export-declaration";

import Statement from "./grammar/syntactic-productions/statement";
import Expression from "./grammar/syntactic-productions/expression";
import ExportDeclaration from "./grammar/syntactic-productions/export-declaration";

export type SyntacticNode =
  | ExportDeclaration
  | Statement
  | Expression;
