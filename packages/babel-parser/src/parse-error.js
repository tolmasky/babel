// @flow

import { Position } from "./util/location";
import type { NodeBase } from "./types";
import {
  type ParseErrorCode,
  ParseErrorCodes,
  type ParseErrorCredentials,
} from "./parse-error/credentials";

const ArrayIsArray = Array.isArray;
const { defineProperty: ObjectDefineProperty, keys: ObjectKeys } = Object;

type ToMessage<ErrorDetails> = (self: ErrorDetails) => string;

// This should really be an abstract class, but that concept doesn't exist in
// Flow, outside of just creating an interface, but then you can't specify that
// it's a subclass of `SyntaxError`. You could do something like:
//
// interface IParseError<ErrorDetails> { ... }
// type ParseError<ErrorDetails> = SyntaxError & IParseError<ErrorDetails>;
//
// But this is just a more complicated way of getting the same behavior, with
// the added clumsiness of not being able to extends ParseError directly. So,
// to keep things simple and prepare for a Typescript future, we just make it a
// "private" superclass that we exclusively subclass:

export class ParseError<+ReasonCode: string, ErrorDetails> extends SyntaxError {
  code: ParseErrorCode;
  +reasonCode: ReasonCode;
  #toMessage: ToMessage<ErrorDetails>;

  loc: Position;
  details: ErrorDetails;

  // There are no optional fields in classes in Flow, so we can't list these
  // here: https://github.com/facebook/flow/issues/2859
  // syntaxPlugin?: SyntaxPlugin
  // missingPlugin?: string[]

  constructor({
    reasonCode,
    code,
    toMessage,
    loc,
    details,
  }: {
    reasonCode: ReasonCode,
    code: ParseErrorCode,
    toMessage: ToMessage<ErrorDetails>,
    loc: Position,
    details: ErrorDetails,
  }): ParseError<ReasonCode, ErrorDetails> {
    super();

    this.reasonCode = reasonCode;
    this.code = code;
    this.#toMessage = toMessage;
    this.loc = loc;

    ObjectDefineProperty(this, "details", {
      value: details,
      enumerable: false,
    });

    // $FlowIgnore
    if (details.missingPlugin) {
      ObjectDefineProperty(this, "missingPlugin", {
        get() {
          return this.details.missingPlugin;
        },
        enumerable: true,
      });
    }

    return this;
  }

  clone({
    loc,
    details,
  }: {
    loc?: Position,
    details?: ErrorDetails,
  } = {}): ParseError<ReasonCode, ErrorDetails> {
    return new ParseError({
      reasonCode: this.reasonCode,
      code: this.code,
      toMessage: this.#toMessage,
      loc: loc || this.loc,
      details: { ...this.details, ...details },
    });
  }

  get pos() {
    return this.loc.index;
  }

  get message() {
    // $FlowIgnore - Flow thinks #toMessage does not exist
    const message = this.#toMessage(this.details);
    return `${message} (${this.loc.line}:${this.loc.column})`;
  }

  set message(value: string) {
    ObjectDefineProperty(this, "message", {
      value,
      writable: true,
      configurable: true,
      enumerable: true,
    });
  }
}

export type ErrorDescription<+ReasonCode, ErrorDetails> = {
  +reasonCode: ReasonCode,
  toMessage: ToMessage<ErrorDetails>,
  code: ParseErrorCode,
  syntaxPlugin?: $PropertyType<ParseErrorCredentials, "syntaxPlugin">,
};

function toParseErrorInfo<ReasonCode, ErrorDetails>(
  reasonCode: ReasonCode,
  toMessage: ToMessage<ErrorDetails>,
  credentials: ParseErrorCredentials,
): ErrorDescription<ReasonCode, ErrorDetails> {
  return {
    reasonCode,
    toMessage,
    code: credentials.code,
    syntaxPlugin: credentials.syntaxPlugin,
  };
}

// This part is tricky, and only necessary due to some bugs in Flow that won't
// be fixed for a year(?): https://github.com/facebook/flow/issues/8838
// Flow has a very difficult time extracting the parameter types of functions,
// so we are forced to pretend the class exists earlier than it does.
// `toParseErrorCredentials` *does not* actuall return a
// `Class<ParseError<ErrorDetails>>`, but we simply mark it as such to "carry"
// the `ErrorDetails` type parameter around. This is not a problem in Typescript
// where this intermediate function actually won't be needed at all.
declare function toParseErrorCredentials<ReasonCode: string>(
  string,
  ?{ code?: ParseErrorCode, reasonCode?: ReasonCode } | boolean,
): ErrorDescription<ReasonCode, {||}>;

// ESLint seems to erroneously think that Flow's overloading syntax is an
// accidental redeclaration of the function:
// https://github.com/babel/eslint-plugin-babel/issues/162
// eslint-disable-next-line no-redeclare
declare function toParseErrorCredentials<ReasonCode: string, T>(
  (T) => string,
  ?{ code?: ParseErrorCode, reasonCode?: ReasonCode } | boolean,
): ErrorDescription<ReasonCode, T>;

// See comment about eslint and Flow overloading above.
// eslint-disable-next-line no-redeclare
export function toParseErrorCredentials(toMessageOrMessage, credentials) {
  return [
    typeof toMessageOrMessage === "string"
      ? () => toMessageOrMessage
      : toMessageOrMessage,
    credentials,
  ];
}

declare function toParseErrorClasses(string[]): typeof toParseErrorClasses;

// See comment about eslint and Flow overloading above.
// eslint-disable-next-line no-redeclare
declare function toParseErrorClasses<T: Object>(
  toClasses: (typeof toParseErrorCredentials) => T,
  syntaxPlugin?: string,
): T;

// toParseErrorClasses can optionally be template tagged to provide a
// syntaxPlugin:
//
// toParseErrorClasses`syntaxPlugin` (_ => ... )
//
// See comment about eslint and Flow overloading above.
// eslint-disable-next-line no-redeclare
export function toParseErrorClasses(argument, syntaxPlugin) {
  // If the first parameter is an array, that means we were called with a tagged
  // template literal. Extract the syntaxPlugin from this, and call again in
  // the "normalized" form.
  if (ArrayIsArray(argument)) {
    return toClasses => toParseErrorClasses(toClasses, argument[0]);
  }

  const classes = argument(toParseErrorCredentials);

  for (const reasonCode of ObjectKeys(classes)) {
    const [toMessage, credentials = {}] = classes[reasonCode];
    const ParseErrorClass = toParseErrorInfo(
      credentials.reasonCode || reasonCode,
      toMessage,
      {
        reasonCode: credentials.reasonCode || reasonCode,
        code: credentials.code || ParseErrorCodes.SyntaxError,
        ...(syntaxPlugin ? { syntaxPlugin } : {}),
      },
    );

    classes[reasonCode] = ParseErrorClass;
  }

  return classes;
}

export type RaiseProperties<ErrorDetails> = {|
  ...ErrorDetails,
  at: Position | NodeBase,
|};

import ModuleErrors from "./parse-error/module-errors";
import StandardErrors from "./parse-error/standard-errors";
import StrictModeErrors from "./parse-error/strict-mode-errors";
import PipelineOperatorErrors from "./parse-error/pipeline-operator-errors";

export const Errors = {
  ...toParseErrorClasses(ModuleErrors),
  ...toParseErrorClasses(StandardErrors),
  ...toParseErrorClasses(StrictModeErrors),
  ...toParseErrorClasses`pipelineOperator`(PipelineOperatorErrors),
};

export type { LValAncestor } from "./parse-error/standard-errors";

export * from "./parse-error/credentials";
