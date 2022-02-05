import type SourceNode from "./source-node";
import type Comment from "./comment";
import SourceLocation from "./source-location";

export default interface SyntaxNode<GrammarSymbol, type = GrammarSymbol>
  extends SourceNode<symbol, type> {
  leadingComments?: Comment[];
  trailingComments?: Comment[];
  innerComments?: Comment[];

//  extra?: { [key: string]: any };
}

export * from "./syntax-node/some-syntax-node";

export * from "./syntax-node/statement";
export * from "./syntax-node/expression";

export * from "./syntax-node/export-declaration";

export * from "./syntax-node/bindings/binding-identifier";
export * from "./syntax-node/bindings/binding-pattern";

