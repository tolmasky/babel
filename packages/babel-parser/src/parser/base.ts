import type { Options } from "../options";
import type State from "../tokenizer/state";
import type { PluginsMap } from "./index";
import type ScopeHandler from "../util/scope";
import type ExpressionScopeHandler from "../util/expression-scope";
import type ClassScopeHandler from "../util/class-scope";
import type ProductionParameterHandler from "../util/production-parameter";

export default class BaseParser {
  // Properties set by constructor in index.js
  declare options: Options;
  declare inModule: boolean;
  declare scope: ScopeHandler;
  declare classScope: ClassScopeHandler;
  declare prodParam: ProductionParameterHandler;
  declare expressionScope: ExpressionScopeHandler;
  declare plugins: PluginsMap;
  declare filename: string | null | undefined;
  // Names of exports store. `default` is stored as a name for both
  // `export default foo;` and `export { foo as default };`.
  declare exportedIdentifiers: Set<string>;
  sawUnambiguousESM: boolean = false;
  ambiguousScriptDifferentAst: boolean = false;

  // Initialized by Tokenizer
  declare state: State;
  // input and length are not in state as they are constant and we do
  // not want to ever copy them, which happens if state gets cloned
  declare input: string;
  declare length: number;

  // This method accepts either a string (plugin name) or an array pair
  // (plugin name and options object). If an options object is given,
  // then each value is non-recursively checked for identity with that
  // plugin’s actual option value.
  hasPlugin(pluginConfig: PluginConfig): boolean {
    if (typeof pluginConfig === "string") {
      return this.plugins.has(pluginConfig);
    } else {
      const [pluginName, pluginOptions] = pluginConfig;
      if (!this.hasPlugin(pluginName)) {
        return false;
      }
      const actualOptions = this.plugins.get(pluginName);
      for (const key of Object.keys(pluginOptions)) {
        if (actualOptions?.[key] !== pluginOptions[key]) {
          return false;
        }
      }
      return true;
    }
  }

  getPluginOption(plugin: string, name: string) {
    return this.plugins.get(plugin)?.[name];
  }
}

export type PluginConfig = string | [string, { [key: string]: any }];
