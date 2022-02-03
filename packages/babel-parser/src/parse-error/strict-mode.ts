import { toParseErrorClasses } from "../parse-error";

export default toParseErrorClasses({
  StrictDelete: () => "Deleting local variable in strict mode.",
  StrictEvalArguments: ({ name }: { name: string }) =>
    `Assigning to '${name}' in strict mode.`,
  StrictEvalArgumentsBinding: ({ name }: { name: string }) =>
    `Binding '${name}' in strict mode.`,
  StrictFunction: () =>
    "In strict mode code, functions can only be declared at top level or inside a block.",
  StrictNumericEscape: () =>
    "The only valid numeric escape in strict mode is '\\0'.",
  StrictOctalLiteral: () =>
    "Legacy octal literals are not allowed in strict mode.",
  StrictWith: () => "'with' in strict mode.",
});
