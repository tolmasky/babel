import SyntaxNode from "../syntax-node";
import SpreadElement from "./expression/spread-element";

type Expression = { };

export type Decorator = SyntaxNode<{
  type: "Decorator";

  expression: Expression;
  arguments?: (Expression | SpreadElement)[];
}>;

export default Decorator;
