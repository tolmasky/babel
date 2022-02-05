import type SyntaxNode from "../syntax-node";

type Expression = { };
type SpreadElement = { };

export interface Decorator extends SyntaxNode<"Decorator"> {
  type: "Decorator";
  expression: Expression;
  arguments?: (Expression | SpreadElement)[];
};

export default Decorator;
