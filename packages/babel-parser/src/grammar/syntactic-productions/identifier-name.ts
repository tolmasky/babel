import type SyntacticProduction from "../syntactic-production";

export default interface Identifier<GrammarSymbol>
  extends SyntacticProduction<GrammarSymbol, "Identifier"> {
  name: string;
}
