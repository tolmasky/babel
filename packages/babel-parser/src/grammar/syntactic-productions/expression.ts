import type ArrayLiteral from "./array-literal";
import type Literal from "./literal";
import type Decorator from "./decorator";

export type Expression =
    | ArrayLiteral
    | Literal
    | Decorator
    | FunctionExpression
    | GeneratorExpression
    | AsyncFunctionExpression
    | AsyncGeneratorExpression
    | ArrowFunction;

export default Expression;

import {
    FunctionExpression,
    GeneratorExpression,
    AsyncFunctionExpression,
    AsyncGeneratorExpression,
    ArrowFunction,
} from "./function-expression";

export * from "./array-literal";
export * from "./literal";
export * from "./identifier";
export * from "./decorator";
export * from "./function-expression";
