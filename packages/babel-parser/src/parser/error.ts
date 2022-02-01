/* eslint sort-keys: "error" */
import { Position } from "../util/location";
import type { ErrorCode } from "./error-codes";
import { ErrorCodes } from "./error-codes";
import type { NodeBase } from "../types";

type ToMessage = (self: any) => string;

/*export type ParsingErrorClass<T extends ToMessage> = new (
  properties: ParsingErrorConstructorProperties<T>
) => ParsingError;
*/
export interface ParsingErrorClass<T extends ToMessage>
{
    new(properties: ParsingErrorConstructorProperties<T>): ParsingError;
    //(message?: string): ParsingError;
    readonly prototype: ParsingError;
};

export interface ParsingError {
  loc: Position;
  pos: number;
  //  missingPlugin?: string[];
  code: string;
  reasonCode: string;
};

type Origin = { at: Position | NodeBase };
type ParsingErrorConstructorProperties<T extends ToMessage> = Origin &
  Omit<Parameters<T>[0], "loc">;

const toParsingErrorClass = <T extends ToMessage>([key, toMessage]: [
  string,
  T
]): ParsingErrorClass<T> =>
  class extends SyntaxError implements ParsingError {
    loc: Position;
    pos: number;
    code: string = ErrorCodes.SyntaxError;
    reasonCode: string = key;

    constructor({ at, ...rest }: ParsingErrorConstructorProperties<T>) {
      super();
      this.loc = at instanceof Position ? at : at.loc;
      Object.assign(this, { ...rest, pos: indexes.get(this.loc) });
    }

    get message() {
      return toMessage(this);
    }
  };

type ParsingErrorTemplates = { [key: string]: ToMessage };

type ParsingErrorClasses<T extends ParsingErrorTemplates> = {
  [K in keyof T]: ParsingErrorClass<T[K]> & { NominalType: K };
};

export function toParsingErrorClasses<T extends ParsingErrorTemplates>(
  templates: T
): ParsingErrorClasses<T> {
  // @ts-ignore
  return Object.fromEntries(
    Object.entries(templates).map(([key, value]) => [
      key,
      toParsingErrorClass([key, value]),
    ])
  );
}

export type DeferredErrorDescription<T extends ParsingErrorClass<any>> = [
    ParsingError: T,
    properties: ConstructorParameters<T>[0]];

export type DeferredErrorDescriptionMap<T extends ParsingErrorClass<any>> = Map<number, DeferredErrorDescription<T>>;