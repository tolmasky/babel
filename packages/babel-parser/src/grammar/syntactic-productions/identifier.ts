import type SyntacticProduction from "../syntactic-production";

export interface Identifier extends SyntacticProduction<"Identifier"> {
    name: string;
}
