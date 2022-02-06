import { SyntaxNode, Traversable } from "../syntax-node";
import { PropertyName } from "./property-name";
import { PrivateIdentifier } from "./identifier-name";
import { FunctionBody } from "./function-node";

export type ClassBody = ClassElementList;

export type ClassElementList = ClassElement[];

export type ClassElement = Method;
/*
  | N.ClassMethod
  | N.ClassPrivateMethod
  | N.ClassProperty
  | N.ClassPrivateProperty;
  

MethodDefinition[Yield, Await] :
ClassElementName[?Yield, ?Await] ( UniqueFormalParameters[~Yield, ~Await] ) { FunctionBody[~Yield, ~Await] }
GeneratorMethod[?Yield, ?Await]
AsyncMethod[?Yield, ?Await]
AsyncGeneratorMethod[?Yield, ?Await]
get ClassElementName[?Yield, ?Await] ( ) { FunctionBody[~Yield, ~Await] }
set ClassElementName[?Yield, ?Await] ( PropertySetParameterList ) { FunctionBody[~Yield, ~Await] }
*/
// https://tc39.es/ecma262/#prod-MethodDefinition
export type MethodDefinition = Method;/*
  | Method
  | GeneratorMethod
  | AsyncMethod
  | AsyncGeneratorMethod
  | GetterMethod
  | SetterMethod*/

export default MethodDefinition;

export type Method = SyntaxNode<{
  type: "ClassMethod" | "PrivateClassMethod";
  GrammarSymbol: "MethodDefinition";

  key: ClassElementName | Traversable<0>;
  computed: boolean;
  static: boolean;

  body: FunctionBody | Traversable<1>;
}>;

export type ClassElementName = 
  | PropertyName
  | PrivateIdentifier;
