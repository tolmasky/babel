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
export type NullLiteral = SyntaxNode<{
  type: "NullLiteral"
}>;

// https://tc39.es/ecma262/#sec-boolean-literals
export type BooleanLiteral = SyntaxNode<{
  type: "BooleanLiteral";

  extra?: Extra<boolean>;
}>;

// https://tc39.es/ecma262/#sec-literals-numeric-literals
export type NumericLiteral =
  | DecimalLiteral
  | DecimalBigIntegerLiteral
  | NonDecimalIntegerLiteral
  | NonDecimalBigIntLiteral
  | LegacyOctalIntegerLiteral;

// https://tc39.es/ecma262/#prod-DecimalLiteral
export type DecimalLiteral = SyntaxNode<{
  type: "NumericLiteral";
  GrammarSymbol: "DecimalLiteral";

  extra?: Extra<number>;
}>;

// https://tc39.es/ecma262/#prod-DecimalIntegerLiteral
export type DecimalBigIntegerLiteral = SyntaxNode<{
  type: "BigIntLiteral";
  GrammarSymbol: "DecimalBigIntegerLiteral";

  extra?: Extra<BigInt>;
}>;

// https://tc39.es/ecma262/#prod-NonDecimalIntegerLiteral
export type NonDecimalIntegerLiteral = SyntaxNode<{
  type: "NumericLiteral";
  GrammarSymbol: "NonDecimalIntegerLiteral";

  extra?: Extra<number>;
}>;

// https://tc39.es/ecma262/#sec-literals-numeric-literals
export type NonDecimalBigIntLiteral = SyntaxNode<{
  type: "BigIntLiteral";
  GrammarSymbol: "NonDecimalBigIntegerLiteral";

  extra?: Extra<BigInt>;
}>;

// https://tc39.es/ecma262/#prod-LegacyOctalIntegerLiteral
export type LegacyOctalIntegerLiteral = SyntaxNode<{
  type: "NumericLiteral";
  GrammarSymbol: "LegacyOctalIntegerLiteral";

  extra?: Extra<number>;
}>;

// https://tc39.es/ecma262/#prod-RegularExpressionLiteral
export type RegularExpressionLiteral = SyntaxNode<{
  type: "RegExpLiteral";
  GrammarSymbol: "RegularExpressionLiteral";

  // FIXME: (?) Backwards compatibility: Babel currently always assigns a null
  // RegExpLiteral.extra.rawValue.
  extra?: Extra<undefined>;
  // FIXME: (?) Backwards compatibility: Babel currently always assigns a null
  // value to RegExpLiterals.
  value: undefined;

  pattern: string;
  flags: string; //RegExp$flags;
}>;

// https://tc39.es/ecma262/#sec-literals-string-literals
export type StringLiteral = SyntaxNode<{
  type: "StringLiteral";

  extra?: Extra<string>;
}>;

interface Extra<T> {
  raw: string;
  rawValue: T;
}
