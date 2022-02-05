import type FunctionNode from "./function-node";

export interface FunctionExpression
  extends FunctionNode<
    "FunctionExpression",
    "FunctionExpression",
    false,
    false
  > {}

export interface GeneratorExpression
  extends FunctionNode<
    "GeneratorExpression",
    "FunctionExpression",
    true,
    false
  > {}

export interface AsyncGeneratorExpression
  extends FunctionNode<
    "AsyncGeneratorExpression",
    "FunctionExpression",
    true,
    true
  > {}

export interface AsyncFunctionExpression
  extends FunctionNode<
    "AsyncFunctionExpression",
    "FunctionExpression",
    false,
    true
  > {}

export interface ArrowFunction
  extends FunctionNode<
    "ArrowFunction",
    "ArrowFunctionExpression",
    false,
    false
  > {}

export interface AsyncArrowFunction
  extends FunctionNode<
    "ArrowFunction",
    "ArrowFunctionExpression",
    false,
    true
  > {}
