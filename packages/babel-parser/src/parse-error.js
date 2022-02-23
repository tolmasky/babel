// @flow

import { Position } from "./util/location";
import type { NodeBase } from "./types";
import {
  type ParseErrorCode,
  ParseErrorCodes,
  type ParseErrorCredentials,
} from "./parse-error/credentials";

const ArrayIsArray = Array.isArray;
const {
  assign: ObjectAssign,
  defineProperty: ObjectDefineProperty,
  keys: ObjectKeys,
} = Object;

type ToMessage<ErrorDetails> = (self: ErrorDetails) => string;

const NoMessage = Symbol("NoMessage");

// This is should really be an abstract class, but that concept doesn't exist in
// Flow, outside of just creating an interface, but then you can't specify that
// it's a subclass of `SyntaxError`. You could do something like:
//
// interface IParseError<ErrorDetails> { ... }
// type ParseError<ErrorDetails> = SyntaxError & IParseError<ErrorDetails>;
//
// But this is just a more complicated way of getting the same behavior, with
// the added clumsiness of not being able to extends ParseError directly. So,
// to keep things simple and prepare for a Typescript future, just make it a
// class that we exclusively subclass:

export class ParseError<ErrorDetails> extends SyntaxError {
  code: ParseErrorCode;
  reasonCode: string;

  loc: Position;
  details: ErrorDetails;

  constructor({
    loc,
    details,
  }: {
    loc: Position,
    details: ErrorDetails,
  }): ParseError<ErrorDetails> {
    super();

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

  get pos() {
    return this.loc.index;
  }
}

function toParseErrorClass<ErrorDetails>(
  toMessage: ToMessage<ErrorDetails>,
  credentials: ParseErrorCredentials,
): Class<ParseError<ErrorDetails>> {
  return class extends ParseError<ErrorDetails> {
    #message: typeof NoMessage | string = NoMessage;

    constructor(...args): ParseError<ErrorDetails> {
      super(...args);
      // $FlowIgnore
      ObjectAssign(this, credentials);
      return this;
    }

    get message() {
      return this.#message !== NoMessage
        ? String(this.#message)
        : `${toMessage(this.details)} (${this.loc.line}:${this.loc.column})`;
    }

    set message(message) {
      this.#message = message;
    }
  };
}

declare function toParseErrorCredentials<T: string>(
  T,
  ?{ code?: ParseErrorCode, reasonCode?: string } | boolean,
): Class<ParseError<{||}>>;

// eslint-disable-next-line no-redeclare
declare function toParseErrorCredentials<T>(
  (T) => string,
  ?{ code?: ParseErrorCode, reasonCode?: string } | boolean,
): Class<ParseError<T>>;

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

// eslint-disable-next-line no-redeclare
declare function toParseErrorClasses<T: Object>(
  toClasses: (typeof toParseErrorCredentials) => T,
  syntaxPlugin?: string,
): T;

// eslint-disable-next-line no-redeclare
export function toParseErrorClasses(argument, syntaxPlugin) {
  if (ArrayIsArray(argument)) {
    return toClasses => toParseErrorClasses(toClasses, argument[0]);
  }

  const classes = argument(toParseErrorCredentials);

  for (const reasonCode of ObjectKeys(classes)) {
    const [toMessage, credentials = {}] = classes[reasonCode];
    const ParseErrorClass = toParseErrorClass(toMessage, {
      code: credentials.code || ParseErrorCodes.SyntaxError,
      reasonCode: credentials.reasonCode || reasonCode,
      ...(syntaxPlugin ? { syntaxPlugin } : {}),
    });

    classes[reasonCode] = ParseErrorClass;

    // We do this for backwards compatibility so that all errors just have the
    // "SyntaxError" name in their messages instead of leaking the private
    // subclass name.
    ObjectDefineProperty(ParseErrorClass.prototype.constructor, "name", {
      value: "SyntaxError",
    });
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

export const Errors = {
  ...toParseErrorClasses(ModuleErrors),
  ...toParseErrorClasses(StandardErrors),
  ...toParseErrorClasses(StrictModeErrors),
};

export * from "./parse-error/credentials";
