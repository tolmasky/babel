import type SourceLocation from "./source-location";

export type SourceNode<specification extends Specification> =
{
  type: specification["type"];
  specification: {
    GrammarSymbol: specification["GrammarSymbol"] extends string
      ? specification["GrammarSymbol"]
      : specification["type"]
  }

  start: number;
  end: number;
  loc: SourceLocation;
  range?: [number, number];
} & Exclude<specification, "ECMAType" | "type">;

export default SourceNode;

export interface Specification {
  type: string;
  GrammarSymbol?: string;
}

export * from "./comment";
export * from "./syntax-node";
