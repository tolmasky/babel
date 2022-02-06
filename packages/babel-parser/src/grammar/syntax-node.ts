import { Specification, SourceNode } from "./source-node";
import Comment from "./comment";
import SourceLocation from "./source-location";

export type SyntaxNode<specification extends Specification> = SourceNode<
  {
    leadingComments?: Comment[];
    trailingComments?: Comment[];
    innerComments?: Comment[];
  } & WithoutAnnotations<specification> & {
      specification: {
        trailingCommaProperty: NeverToUndefined<
          GetTrailingCommaProperty<specification>
        >;
      };
    }
>;

export default SyntaxNode;

const AllowsTrailingComma = Symbol("AllowsTrailingComma");
export type AllowsTrailingComma = { [AllowsTrailingComma]: true };

const Traversable = Symbol("Traversable");
export type Traversable<Index extends number> = { [Traversable]: { index: Index } };

type WithoutAnnotations<T extends { [_: string]: any }> =
{
  [K in keyof T]: Exclude<T[K], Traversable<0> | AllowsTrailingComma>;
};

type NeverToUndefined<T> = [T] extends [never] ? undefined : T;

type GetTrailingCommaProperty<T extends { [_: string]: any }> =
{
  [K in keyof T]: AllowsTrailingComma extends T[K] ? K : never;
}[keyof T];

export * from "./syntax-node/statement-list";
export * from "./syntax-node/expression";
export * from "./syntax-node/class";
export * from "./syntax-node/identifier-name";
export * from "./syntax-node/property-name";

export * from "./syntax-node/export-declaration";

export * from "./syntax-node/bindings/binding-identifier";
export * from "./syntax-node/bindings/binding-pattern";

export * from "./syntax-node/expression/spread-element";

