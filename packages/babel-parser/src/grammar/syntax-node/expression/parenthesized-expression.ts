import { SyntaxNode, Traversable } from "../../syntax-node";
import Expression from "../expression";

export type ParenthesizedExpression = SyntaxNode<{
  type: "ParenthesizedExpression";

  expression: Expression | Traversable<0>;
}>;

export default ParenthesizedExpression;
