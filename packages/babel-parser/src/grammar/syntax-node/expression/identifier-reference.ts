import type IdentifierName from "../identifier-name";

// https://tc39.es/ecma262/#prod-IdentifierReference
export interface IdentifierReference
  extends IdentifierName<"IdentifierReference"> {}

export default IdentifierReference;
