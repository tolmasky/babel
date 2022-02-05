import SyntaxNode from "../syntax-node";
import { StringLiteral } from "./literal";
import BindingIdentifier from "./bindings/binding-identifier";

type ImportSpecifier = {};

export type ImportDeclaration = SyntaxNode<{
  type: "ImportDeclaration";
  // TODO: readonly
  specifiers: ImportSpecifier[];
  //    (ImportSpecifier | ImportDefaultSpecifier | ImportNamespaceSpecifier)[];
  source: StringLiteral;

  //  importKind?: "type" | "typeof" | "value", // TODO: Not in spec

  //  assertions?: readonly ImportAttribute[];
}>;
/*
type ImportedBinding = BindingIdentifier;

type ModuleSpecifier = {
    local: ImportedBinding;
    }

export type ImportSpecifier = ModuleSpecifier & {
  type: "ImportSpecifier";
  imported: Identifier | StringLiteral;
  importKind?: "type" | "value";
};

export type ImportDefaultSpecifier = ModuleSpecifier & {
  type: "ImportDefaultSpecifier";
};

export type ImportNamespaceSpecifier = ModuleSpecifier & {
  type: "ImportNamespaceSpecifier";
};
*/
