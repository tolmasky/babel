import type ArrayLiteral from "./array-literal";
import type Literal from "./literal";
import type Decorator from "./decorator";

export type Expression =
    | ArrayLiteral
    | Literal
    | Decorator

export default Expression;

export * from "./array-literal";
export * from "./literal";
export * from "./identifier";
export * from "./decorator";
