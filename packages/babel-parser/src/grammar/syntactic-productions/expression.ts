
import type IdentifierReference from "./expression/identifier-reference";
import type Literal from "./literal";
import type Decorator from "./decorator";
import type ArrayLiteral from "./expression/array-literal";
import type ObjectLiteral from "./expression/object-literal";

export type Expression =
    | IdentifierReference
    | Literal
    | ArrayLiteral
    | ObjectLiteral
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

export * from "./expression/identifier-reference";
export * from "./expression/array-literal";
export * from "./expression/object-literal";
export * from "./literal";
export * from "./decorator";
export * from "./function-expression";
