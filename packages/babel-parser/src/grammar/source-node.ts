import type SourceLocation from "./source-location";

const ECMAScriptGrammarSymbol = Symbol("ECMAScript Grammar Symbol");

export interface SourceNode<GrammarSymbol, type = GrammarSymbol> {
  [ECMAScriptGrammarSymbol]: GrammarSymbol;
  type: type;

  start: number;
  end: number;
  loc: SourceLocation;
  range?: [number, number];
}

export default SourceNode;

export * from "./comment";
export * from "./syntax-node";
