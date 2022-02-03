// https://tc39.es/ecma262/#sec-ecmascript-language-lexical-grammar-literals

import type SyntacticProduction from "../syntactic-production";

export type Literal =
  | NullLiteral
  | BooleanLiteral
  | NumericLiteral
  | StringLiteral
  | RegularExpressionLiteral;

export default Literal;

// https://tc39.es/ecma262/#prod-NullLiteral
export type NullLiteral = LiteralProduction<null>;

// https://tc39.es/ecma262/#sec-boolean-literals
export type BooleanLiteral = LiteralProduction<boolean>;

// https://tc39.es/ecma262/#sec-literals-numeric-literals
export type NumericLiteral =
  | DecimalLiteral
  | DecimalBigIntegerLiteral
  | NonDecimalIntegerLiteral
  | NonDecimalBigIntLiteral
  | LegacyOctalIntegerLiteral;

// https://tc39.es/ecma262/#prod-DecimalLiteral
export type DecimalLiteral = LiteralProduction<
  number,
  "DecimalLiteral",
  "NumericLiteral"
>;

// https://tc39.es/ecma262/#prod-DecimalIntegerLiteral
export type DecimalBigIntegerLiteral = LiteralProduction<
  number,
  "DecimalBigIntegerLiteral",
  "BigIntLiteral"
>;

// https://tc39.es/ecma262/#prod-NonDecimalIntegerLiteral
export type NonDecimalIntegerLiteral = LiteralProduction<
  number,
  "NonDecimalIntegerLiteral",
  "NumericLiteral"
>;

// https://tc39.es/ecma262/#sec-literals-numeric-literals
export type NonDecimalBigIntLiteral = LiteralProduction<
  BigInt,
  "NonDecimalBigIntegerLiteral",
  "BigIntLiteral"
>;

// https://tc39.es/ecma262/#prod-LegacyOctalIntegerLiteral
export type LegacyOctalIntegerLiteral = LiteralProduction<
  number,
  "LegacyOctalIntegerLiteral",
  "NumericLiteral"
>;

// https://tc39.es/ecma262/#prod-RegularExpressionLiteral
export interface RegularExpressionLiteral
  extends SyntacticProduction<"RegularExpressionLiteral", "RegExpLiteral"> {
  // FIXME: (?) Backwards compatibility: Babel currently always assigns a null
  // RegExpLiteral.extra.rawValue.
  extra?: Extra<undefined>;
  // FIXME: (?) Backwards compatibility: Babel currently always assigns a null
  // value to RegExpLiterals.
  value: undefined;

  pattern: string;
  flags: string; //RegExp$flags;
}

// https://tc39.es/ecma262/#sec-literals-string-literals
export type StringLiteral = LiteralProduction<string>;

type LiteralProduction<
  T,
  GrammarSymbol = `${Capitalize<typename<T>>}Literal`,
  type = GrammarSymbol
> = SyntacticProduction<GrammarSymbol, type> &
  (T extends null ? {} : { value: T; extra?: Extra<T> });

interface Extra<T> {
  raw: string;
  rawValue: T;
}

type typename<T> = T extends string
  ? "string"
  : T extends number
  ? "number"
  : T extends boolean
  ? "boolean"
  : T extends BigInt
  ? "bigint"
  : T extends null
  ? "null"
  : never;
