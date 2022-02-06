import IdentifierReference from "./expression/identifier-reference";
import Literal from "./literal";
import Decorator from "./decorator";
import ArrayLiteral from "./expression/array-literal";
import ObjectLiteral from "./expression/object-literal";
import ParenthesizedExpression from "./expression/parenthesized-expression";

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
    | ArrowFunction
    | ParenthesizedExpression;

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
export * from "./expression/parenthesized-expression";
