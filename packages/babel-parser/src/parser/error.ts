/* eslint sort-keys: "error" */
import type { Position } from "../util/location";
import type { ErrorCode } from "./error-codes";
import { ErrorCodes } from "./error-codes";
import type { NodeBase } from "../types";


type ToMessage = (self: any) => string;

export type ParsingErrorClass = {
  toMessage: ToMessage;
  new(...args: any[]): ParsingError;
};

export type ParsingError = {
  loc: Position;
  pos: number;
//  missingPlugin?: string[];
  code: string;
  reasonCode: string;
}

export type ParsingErrorProperties<T extends ToMessage> = { loc: Position } & Parameters<T>[0];


const toParsingErrorClass = <T extends ToMessage>([key, toMessage] : [string, T]) =>
  class extends SyntaxError {
    loc: Position;
    pos: number;
    code: string = ErrorCodes.SyntaxError;
    reasonCode: string = key;
    static toMessage = toMessage;

    constructor({ loc, ...rest } : ParsingErrorProperties<T>) {
      super();
      Object.assign(this, { ...rest, loc, pos: indexes.get(loc) });
    }/*
      get message () {
        return toMessage(this);
    }*/
}

type Origin = { node: NodeBase } | { at: Position };
export type RaiseProperties<T extends ParsingErrorClass> = Origin & Omit<Parameters<T["toMessage"]>[0], "loc">;

type ParsingErrorClasses<T> = {
  [K in keyof T]: ParsingErrorClass & { toMessage: T[K] }
}

export function toParsingErrorClasses<T>(templates: T) : ParsingErrorClasses<T> {
  // @ts-ignore
  return Object.fromEntries(Object.entries(templates).map(([key, value]) => [key, toErrorClass([key, value])]));
}
