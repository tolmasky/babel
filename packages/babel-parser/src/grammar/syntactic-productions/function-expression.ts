import type FunctionProduction from "./function-production";

export interface FunctionExpression
  extends FunctionProduction<
    "FunctionExpression",
    "FunctionExpression",
    false,
    false
  > {}

export interface GeneratorExpression
  extends FunctionProduction<
    "GeneratorExpression",
    "FunctionExpression",
    true,
    false
  > {}

export interface AsyncGeneratorExpression
  extends FunctionProduction<
    "AsyncGeneratorExpression",
    "FunctionExpression",
    true,
    true
  > {}

export interface AsyncFunctionExpression
  extends FunctionProduction<
    "AsyncFunctionExpression",
    "FunctionExpression",
    false,
    true
  > {}

export interface ArrowFunction
  extends FunctionProduction<
    "ArrowFunction",
    "ArrowFunctionExpression",
    false,
    false
  > {}

export interface AsyncArrowFunction
  extends FunctionProduction<
    "ArrowFunction",
    "ArrowFunctionExpression",
    false,
    true
  > {}
