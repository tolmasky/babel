import { Traversable, SyntaxNode } from "../../syntax-node";
import Expression from "../expression";

export type ExpressionStatement = SyntaxNode<{
  type: "ExpressionStatement";

  expression: Expression | Traversable<0>;
}>;

export default ExpressionStatement;

