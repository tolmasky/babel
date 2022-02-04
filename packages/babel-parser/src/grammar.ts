export * from "./grammar/source-location";

export * from "./grammar/lexical-productions/comment";

export * from "./grammar/syntactic-productions/statement";
export * from "./grammar/syntactic-productions/expression";

export * from "./grammar/syntactic-productions/export-declaration";

export * from "./grammar/syntactic-productions/bindings/binding-identifier";
export * from "./grammar/syntactic-productions/bindings/binding-pattern";

import BindingIdentifier from "./grammar/syntactic-productions/bindings/binding-identifier";
import { BindingPattern, AssignmentPattern, BindingRestElement, BindingRestProperty } from "./grammar/syntactic-productions/bindings/binding-pattern";
import Statement from "./grammar/syntactic-productions/statement";
import Expression from "./grammar/syntactic-productions/expression";
import ExportDeclaration from "./grammar/syntactic-productions/export-declaration";

import SpreadElement from "./grammar/syntactic-productions/expression/spread-element";
import { FunctionRestParameter } from "./grammar/syntactic-productions/function-production";


export type SyntacticNode =
  | BindingIdentifier
  | BindingPattern
  | BindingRestElement
  | FunctionRestParameter
  | BindingRestProperty
  | AssignmentPattern
  | ExportDeclaration
  | SpreadElement
  | Statement
  | Expression;
