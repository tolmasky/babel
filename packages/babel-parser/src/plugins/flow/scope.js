// @flow

import { Position } from "../../util/location";
import ScopeHandler, { Scope } from "../../util/scope";
import {
  BIND_FLAGS_FLOW_DECLARE_FN,
  type ScopeFlags,
  type BindingTypes,
} from "../../util/scopeflags";

// Reference implementation: https://github.com/facebook/flow/blob/23aeb2a2ef6eb4241ce178fde5d8f17c5f747fb5/src/typing/env.ml#L536-L584
class FlowScope extends Scope {
  // declare function foo(): type;
  declareFunctions: Set<string> = new Set();

  has(name: string) {
    return this.declareFunctions.has(name) || super.has(name);
  }
}

export default class FlowScopeHandler extends ScopeHandler<FlowScope> {
  createScope(flags: ScopeFlags): FlowScope {
    return new FlowScope(flags);
  }

  declareName(name: string, bindingType: BindingTypes, loc: Position) {
    const scope = this.currentScope();
    if (bindingType & BIND_FLAGS_FLOW_DECLARE_FN) {
      this.checkRedeclarationInScope(scope, name, bindingType, loc);
      this.maybeExportDefined(scope, name);
      scope.declareFunctions.add(name);
      return;
    }

    super.declareName(...arguments);
  }

  isRedeclaredInScope(
    scope: FlowScope,
    name: string,
    bindingType: BindingTypes,
  ): boolean {
    if (super.isRedeclaredInScope(...arguments)) return true;

    if (bindingType & BIND_FLAGS_FLOW_DECLARE_FN) {
      return (
        !scope.declareFunctions.has(name) &&
        (scope.lexical.has(name) || scope.functions.has(name))
      );
    }

    return false;
  }
}
