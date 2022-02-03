import type SyntacticProduction from "../syntactic-production";

type Expression = { };
type SpreadElement = { };

export interface Decorator extends SyntacticProduction<"Decorator"> {
  type: "Decorator";
  expression: Expression;
  arguments?: (Expression | SpreadElement)[];
};

export default Decorator;
