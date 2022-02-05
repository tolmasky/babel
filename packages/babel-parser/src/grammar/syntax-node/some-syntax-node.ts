import type SyntaxNode from "../syntax-node";
import type Comment from "../comment";
import SourceLocation from "../source-location";

import type Statement from "./statement";
import type Expression from "./expression";

type AnySyntaxNode = SyntaxNode<string, string>;

type ValueTuple<O, T extends keyof O = keyof O> = (
  (T extends any ? (t: T) => T : never) extends infer U
    ? (U extends any ? (u: U) => any : never) extends (v: infer V) => any
      ? V
      : never
    : never
) extends (_: any) => infer W
  ? [...ValueTuple<O, Exclude<T, W>>, O[Extract<W, keyof O>]]
  : [];

type Head<Ts extends any[]> = Ts[0];
type Tail<Ts extends any[]> = Ts extends [any, ...infer T] ? T : never;

type GetSyntaxNodes<T> = GetSyntaxNodesRecursive<T>[0];

type Skip =
  | number
  | string
  | boolean
  | null
  | undefined
  | SourceLocation
  | Comment;

type GetSyntaxNodesRecursive<T, Visited = Skip> = T extends Visited
  ? [never, Visited]
  : T extends (infer A)[]
  ? GetSyntaxNodesRecursive<A, Visited | T>
  : T extends { [_: string]: any }
  ? Prepend<
      T extends AnySyntaxNode ? T : never,
      GetSyntaxNodesTuple<ValueTuple<T>, Visited | T>
    >
  : [never, Visited | T];

type GetSyntaxNodesTuple<
  Ts extends any[],
  Visited,
  HeadResult extends [AnySyntaxNode, any] = GetSyntaxNodesRecursive<
    Head<Ts>,
    Visited
  >
> = HeadResult extends any
  ? Prepend<HeadResult[0], GetSyntaxNodesTuple<Tail<Ts>, HeadResult[1]>>
  : [never, Visited];

type Prepend<Found, TraversalPair extends [any, any]> = [
  Found | TraversalPair[0],
  TraversalPair[1]
];

export type SomeSyntaxNode =
  | GetSyntaxNodes<Statement>
  | GetSyntaxNodes<Expression>;

export default SomeSyntaxNode;
