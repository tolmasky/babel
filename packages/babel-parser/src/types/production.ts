import type { SourceLocation } from "../util/location";

const ECMAScriptGrammarSymbol = Symbol("ECMAScript Grammar Symbol");

export default interface Production<GrammarSymbol, type = GrammarSymbol> {
  [ECMAScriptGrammarSymbol]: GrammarSymbol;
  type: type;

  start: number;
  end: number;
  loc: SourceLocation;
  range?: [number, number];
}
