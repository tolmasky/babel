import type SourceLocation from "./source-location";

const ECMAScriptGrammarSymbol = Symbol("ECMAScript Grammar Symbol");

export default interface Production<GrammarSymbol, type = GrammarSymbol> {
  [ECMAScriptGrammarSymbol]: GrammarSymbol;
  type: type;

  start: number;
  end: number;
  loc: SourceLocation;
  range?: [number, number];
}
