import { SyntaxNode, Position } from "./grammar";

export enum ParserErrorCode {
  SyntaxError =  "BABEL_PARSER_SYNTAX_ERROR",
  SourceTypeModuleError = "BABEL_PARSER_SOURCETYPE_MODULE_REQUIRED",
}

type ToMessage = (self: any) => string;

export interface ParseErrorClass<T extends ToMessage> {
  new (properties: ParseErrorConstructorProperties<T>): ParseError;
  //(message?: string): ParseError;
  readonly prototype: ParseError;
}

export interface ParseError {
  name: string;
  message: string;

  loc: Position;
  pos: number;
  code: ParserErrorCode;
  reasonCode: string;
}

// Can we get rid of this any?
type Origin = { at: Position | SyntaxNode<any> };
type ParseErrorConstructorProperties<T extends ToMessage> = Origin &
  Omit<Parameters<T>[0], "loc">;

const toParseErrorClass = <T extends ToMessage>([key, toMessage]: [
  string,
  T
]): ParseErrorClass<T> =>
  class extends SyntaxError implements ParseError {
    // For backwards compatibility for now.
    name: string = "SyntaxError";

    loc: Position;
    pos: number;
    code: ParserErrorCode = ParserErrorCode.SyntaxError;
    reasonCode: string = key;

    constructor({ at, ...rest }: ParseErrorConstructorProperties<T>) {
      super();
      this.loc = at instanceof Position ? at : at.loc.start;
      Object.assign(this, { ...rest, pos: this.loc.index });
    }

    get message() {
      return toMessage(this);
    }
  };

type ParseErrorTemplates = { [key: string]: ToMessage };

type ParseErrorClasses<T extends ParseErrorTemplates> = {
  [K in keyof T]: ParseErrorClass<T[K]> & { NominalType: K };
};

export function toParseErrorClasses<T extends ParseErrorTemplates>(
  templates: T
): ParseErrorClasses<T> {
  // @ts-ignore
  return Object.fromEntries(
    Object.entries(templates).map(([key, value]) => [
      key,
      toParseErrorClass([key, value]),
    ])
  );
}

export type DeferredErrorDescription<T extends ParseErrorClass<any>> = [
  ParseError: T,
  properties: ConstructorParameters<T>[0]
];

export type DeferredParseErrorMap<T extends ParseErrorClass<any>> = Map<
  number,
  DeferredErrorDescription<T>
>;

import StandardErrors from "./parse-error/standard";
import StrictErrors from "./parse-error/strict-mode";

export const Errors = { ...StandardErrors, ...StrictErrors };
