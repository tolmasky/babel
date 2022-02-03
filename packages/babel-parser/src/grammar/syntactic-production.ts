import type Production from "./production";
import type Comment from "./lexical-productions/comment";

export default interface SyntacticProduction<GrammarSymbol, type = GrammarSymbol>
  extends Production<symbol, type> {
  leadingComments?: Comment[];
  trailingComments?: Comment[];
  innerComments?: Comment[];

  extra?: { [key: string]: any };
}
