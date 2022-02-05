import type IdentifierName from "../identifier-name";

// https://tc39.es/ecma262/#prod-BindingIdentifier
export interface BindingIdentifier
  extends IdentifierName<"BindingIdentifier"> {}

export default BindingIdentifier;
