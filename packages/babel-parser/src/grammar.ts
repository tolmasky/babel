export * from "./grammar/source-location";

export * from "./grammar/lexical-productions/comment";

export * from "./grammar/syntactic-productions/statement";
export * from "./grammar/syntactic-productions/expression";

import Statement from "./grammar/syntactic-productions/statement";
import Expression from "./grammar/syntactic-productions/expression";

export type SyntacticNode =
    | Statement
    | Expression;
