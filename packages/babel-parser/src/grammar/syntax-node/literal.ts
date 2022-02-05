// https://tc39.es/ecma262/#sec-ecmascript-language-lexical-grammar-literals

import type SyntaxNode from "../syntax-node";

export type Literal =
  | NullLiteral
  | BooleanLiteral
  | NumericLiteral
  | StringLiteral
  | RegularExpressionLiteral;

export default Literal;

// https://tc39.es/ecma262/#prod-NullLiteral
export interface NullLiteral extends SyntaxNode<"NullLiteral"> {}

// https://tc39.es/ecma262/#sec-boolean-literals
export interface BooleanLiteral extends SyntaxNode<"BooleanLiteral"> {
  extra?: Extra<boolean>;
}

// https://tc39.es/ecma262/#sec-literals-numeric-literals
export type NumericLiteral =
  | DecimalLiteral
  | DecimalBigIntegerLiteral
  | NonDecimalIntegerLiteral
  | NonDecimalBigIntLiteral
  | LegacyOctalIntegerLiteral;

// https://tc39.es/ecma262/#prod-DecimalLiteral
export interface DecimalLiteral
  extends SyntaxNode<"DecimalLiteral", "NumericLiteral"> {
  extra?: Extra<number>;
}

// https://tc39.es/ecma262/#prod-DecimalIntegerLiteral
export interface DecimalBigIntegerLiteral
  extends SyntaxNode<"DecimalBigIntegerLiteral", "BigIntLiteral"> {
  extra?: Extra<BigInt>;
}

// https://tc39.es/ecma262/#prod-NonDecimalIntegerLiteral
export interface NonDecimalIntegerLiteral
  extends SyntaxNode<"NonDecimalIntegerLiteral", "NumericLiteral"> {
  extra?: Extra<number>;
}

// https://tc39.es/ecma262/#sec-literals-numeric-literals
export interface NonDecimalBigIntLiteral
  extends SyntaxNode<"NonDecimalBigIntegerLiteral", "BigIntLiteral"> {
  extra?: Extra<BigInt>;
}

// https://tc39.es/ecma262/#prod-LegacyOctalIntegerLiteral
export interface LegacyOctalIntegerLiteral
  extends SyntaxNode<"LegacyOctalIntegerLiteral", "NumericLiteral"> {
  extra?: Extra<number>;
}

// https://tc39.es/ecma262/#prod-RegularExpressionLiteral
export interface RegularExpressionLiteral
  extends SyntaxNode<"RegularExpressionLiteral", "RegExpLiteral"> {
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
export interface StringLiteral extends SyntaxNode<string, "StringLiteral"> {
  extra?: Extra<string>;
}

interface Extra<T> {
  raw: string;
  rawValue: T;
}
