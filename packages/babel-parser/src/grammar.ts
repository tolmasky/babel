export * from "./grammar/source-location";

export * from "./grammar/lexical-productions/comment";

export * from "./grammar/syntactic-productions/array-literal";
export * from "./grammar/syntactic-productions/literal";
export * from "./grammar/syntactic-productions/identifier";
export * from "./grammar/syntactic-productions/decorator";

import type Literal from "./grammar/syntactic-productions/literal";
import type Decorator from "./grammar/syntactic-productions/decorator";

export type SyntacticNode =
    | Literal
    | Decorator
