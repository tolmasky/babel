import type Production from "./production";

export default interface LexicalProduction<GrammarSymbol, type = GrammarSymbol>
  extends Production<symbol, type> {
  value: string;
}
