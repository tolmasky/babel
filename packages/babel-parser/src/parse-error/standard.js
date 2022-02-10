// @flow

import { Position } from "../util/location";
import { toParseErrorClasses } from "../parse-error";

export default toParseErrorClasses(_ => ({
  AccessorIsGenerator: _<{ accessor: string }>(
    ({ accessor }) => `A ${accessor} cannot be a generator`,
  ),

  ArgumentsInClass: _(
    "'arguments' is only allowed in functions and class methods.",
  ),
  AsyncFunctionInSingleStatementContext: _(
    "Async functions can only be declared at the top level or inside a block.",
  ),
  AwaitBindingIdentifier: _(
    "Can not use 'await' as identifier inside an async function.",
  ),
  AwaitBindingIdentifierInStaticBlock: _(
    "Can not use 'await' as identifier inside a static block.",
  ),
  AwaitExpressionFormalParameter: _(
    "'await' is not allowed in async function parameters.",
  ),
  AwaitNotInAsyncContext: _(
    "'await' is only allowed within async functions and at the top levels of modules.",
  ),
  AwaitNotInAsyncFunction: _("'await' is only allowed within async functions."),
  BadGetterArity: _("A 'get' accesor must not have any formal parameters."),
  BadSetterArity: _("A 'set' accesor must have exactly one formal parameter."),
  BadSetterRestParameter: _(
    "A 'set' accesor function argument must not be a rest parameter.",
  ),
  ConstructorClassField: _("Classes may not have a field named 'constructor'."),
  ConstructorClassPrivateField: _(
    "Classes may not have a private field named '#constructor'.",
  ),
  ConstructorIsAccessor: _("Class constructor may not be an accessor."),
  ConstructorIsAsync: _("Constructor can't be an async function."),
  ConstructorIsGenerator: _("Constructor can't be a generator."),
  DeclarationMissingInitializer: _<{ declaration: string }>(
    ({ declaration }) => `${declaration}' require an initialization value.`,
  ),
  DecoratorBeforeExport: _(
    "Decorators must be placed *before* the 'export' keyword. You can set the 'decoratorsBeforeExport' option to false to use the 'export @decorator class {}' syntax.",
  ),
  DecoratorConstructor: _(
    "Decorators can't be used with a constructor. Did you mean '@dec class { ... }'?",
  ),
  DecoratorExportClass: _(
    "Using the export keyword between a decorator and a class is not allowed. Please use `export @dec class` instead.",
  ),
  DecoratorSemicolon: _("Decorators must not be followed by a semicolon."),
  DecoratorStaticBlock: _("Decorators can't be used with a static block."),
  DeletePrivateField: _("Deleting a private field is not allowed."),
  DestructureNamedImport: _(
    "ES2015 named imports do not destructure. Use another statement for destructuring after the import.",
  ),
  DuplicateConstructor: _("Duplicate constructor in the same class."),
  DuplicateDefaultExport: _("Only one default export allowed per module."),
  DuplicateExport: _<{| export: string |}>(
    ({ export: name }) =>
      `\`${name}\` has already been exported. Exported identifiers must be unique.`,
  ),
  DuplicateProto: _("Redefinition of __proto__ property."),
  DuplicateRegExpFlags: _("Duplicate regular expression flag."),
  ElementAfterRest: _("Rest element must be last element."),
  EscapedCharNotAnIdentifier: _("Invalid Unicode escape."),
  ExportBindingIsString: _<{ localBinding: string, exportBinding: string }>(
    ({ localBinding, exportBinding }) =>
      `A string literal cannot be used as an exported binding without \`from\`.\n- Did you mean \`export { '${localBinding}' as '${exportBinding}' } from 'some-module'?\``,
  ),
  ExportDefaultFromAsIdentifier: _(
    "'from' is not allowed as an identifier after 'export default'.",
  ),

  ForInOfLoopInitializer: _<{ construct: "for-in" | "for-of" }>(
    ({ construct }) =>
      `'${construct}' loop variable declaration may not have an initializer.`,
  ),

  ForOfAsync: _("The left-hand side of a for-of loop may not be 'async'."),
  ForOfLet: _("The left-hand side of a for-of loop may not start with 'let'."),
  GeneratorInSingleStatementContext: _(
    "Generators can only be declared at the top level or inside a block.",
  ),

  IllegalBreakContinue: _<{ construct: "break" | "continue" }>(
    ({ construct }) => `Unsyntactic ${construct}.`,
  ),

  IllegalLanguageModeDirective: _(
    "Illegal 'use strict' directive in function with non-simple parameter list.",
  ),
  IllegalReturn: _("'return' outside of function."),
  ImportBindingIsString: _<{ importBinding: string }>(
    ({ importBinding }) =>
      `A string literal cannot be used as an imported binding.\n- Did you mean \`import { "${importBinding}" as foo }\`?`,
  ),
  ImportCallArgumentTrailingComma: _(
    "Trailing comma is disallowed inside import(...) arguments.",
  ),
  ImportCallArity: _<{ required: 1 | 2 }>(
    ({ required }) =>
      `\`import()\` requires exactly ${
        required === 1 ? "one argument" : "one or two arguments"
      }.`,
  ),
  ImportCallNotNewExpression: _("Cannot use new with import(...)."),
  ImportCallSpreadArgument: _("`...` is not allowed in `import()`."),
  IncompatibleRegExpUVFlags: _(
    "The 'u' and 'v' regular expression flags cannot be enabled at the same time.",
  ),
  InvalidBigIntLiteral: _("Invalid BigIntLiteral."),
  InvalidCodePoint: _("Code point out of bounds."),
  InvalidCoverInitializedName: _("Invalid shorthand property initializer."),
  InvalidDecimal: _("Invalid decimal."),
  InvalidDigit: _<{ radix: number }>(
    ({ radix }) => `Expected number in radix ${radix}.`,
  ),
  InvalidEscapeSequence: _("Bad character escape sequence."),
  InvalidEscapeSequenceTemplate: _("Invalid escape sequence in template."),
  InvalidEscapedReservedWord: _<{ keyword: string }>(
    ({ keyword }) => `Escape sequence in keyword ${keyword}.`,
  ),
  InvalidIdentifier: _<{ identifier: string }>(
    ({ identifier }) => `Invalid identifier ${identifier}.`,
  ),
  InvalidLhs: _<{ contextDescription: string }>(
    ({ contextDescription }) =>
      `Invalid left-hand side in ${contextDescription}.`,
  ),
  InvalidLhsBinding: _<{ contextDescription: string }>(
    ({ contextDescription }) =>
      `Binding invalid left-hand side in ${contextDescription}.`,
  ),
  InvalidNumber: _("Invalid number."),
  InvalidOrMissingExponent: _(
    "Floating-point numbers require a valid exponent after the 'e'.",
  ),
  InvalidOrUnexpectedToken: _<{ found: string }>(
    ({ found }) => `Unexpected character '${found}'.`,
  ),
  InvalidParenthesizedAssignment: _(
    "Invalid parenthesized assignment pattern.",
  ),
  InvalidPrivateFieldResolution: _<{ name: string }>(
    ({ name }) => `Private name #${name} is not defined.`,
  ),
  InvalidPropertyBindingPattern: _("Binding member expression."),
  InvalidRecordProperty: _(
    "Only properties and spread elements are allowed in record definitions.",
  ),
  InvalidRestAssignmentPattern: _("Invalid rest operator's argument."),
  LabelRedeclaration: _<{ label: string }>(
    ({ label }) => `Label '${label}' is already declared.`,
  ),
  LetInLexicalBinding: _(
    "'let' is not allowed to be used as a name in 'let' or 'const' declarations.",
  ),
  LineTerminatorBeforeArrow: _("No line break is allowed before '=>'."),
  MalformedRegExpFlags: _("Invalid regular expression flag."),
  MissingClassName: _("A class name is required."),
  MissingEqInAssignment: _(
    "Only '=' operator can be used for specifying default value.",
  ),
  MissingSemicolon: _("Missing semicolon."),
  MissingPlugin: _<{ missingPlugin: string }>(
    ({ missingPlugin }) =>
      `This experimental syntax requires enabling the parser plugin: "${missingPlugin}".`,
  ),
  // FIXME: Would be nice to make this "missingPlugins" instead.
  // Also), seems like we can drop the "(s)" from the message and just make it "s".
  MissingOneOfPlugins: _<{ missingPlugin: string[] }>(
    ({ missingPlugin }) =>
      `This experimental syntax requires enabling one of the following parser plugin(s): ${missingPlugin
        .map(name => JSON.stringify(name))
        .join("), ")}.`,
  ),
  MissingUnicodeEscape: _("Expecting Unicode escape sequence \\uXXXX."),
  MixingCoalesceWithLogical: _(
    "Nullish coalescing operator(??) requires parens when mixing with logical operators.",
  ),
  ModuleAttributeDifferentFromType: _(
    "The only accepted module attribute is `type`.",
  ),
  ModuleAttributeInvalidValue: _(
    "Only string literals are allowed as module attribute values.",
  ),
  ModuleAttributesWithDuplicateKeys: _<{ key: string }>(
    ({ key }) => `Duplicate key "${key}" is not allowed in module attributes.`,
  ),
  ModuleExportNameHasLoneSurrogate: _<{ surrogateCharCode: number }>(
    ({ surrogateCharCode }) =>
      `An export name cannot include a lone surrogate), found '\\u${surrogateCharCode.toString(
        16,
      )}'.`,
  ),
  ModuleExportUndefined: _<{ moduleExportName: string }>(
    ({ moduleExportName }) => `Export '${moduleExportName}' is not defined.`,
  ),
  MultipleDefaultsInSwitch: _("Multiple default clauses."),
  NewlineAfterThrow: _("Illegal newline after throw."),
  NoCatchOrFinally: _("Missing catch or finally clause."),
  NumberIdentifier: _("Identifier directly after number."),
  NumericSeparatorInEscapeSequence: _(
    "Numeric separators are not allowed inside unicode escape sequences or hex escape sequences.",
  ),
  ObsoleteAwaitStar: _(
    "'await*' has been removed from the async functions proposal. Use Promise.all() instead.",
  ),
  OptionalChainingNoNew: _(
    "Constructors in/after an Optional Chain are not allowed.",
  ),
  OptionalChainingNoTemplate: _(
    "Tagged Template Literals are not allowed in optionalChain.",
  ),
  OverrideOnConstructor: _(
    "'override' modifier cannot appear on a constructor declaration.",
  ),
  ParamDupe: _("Argument name clash."),
  PatternHasAccessor: _("Object pattern can't contain getter or setter."),
  PatternHasMethod: _("Object pattern can't contain methods."),
  // This error is only used by the smart-mix proposal
  PipeBodyIsTighter: _<{ expressionDescription: string }>(
    ({ expressionDescription }) =>
      `Unexpected ${expressionDescription} after pipeline body; any ${expressionDescription} expression acting as Hack-style pipe body must be parenthesized due to its loose operator precedence.`,
  ),
  PipeTopicRequiresHackPipes: _(
    'Topic reference is used), but the pipelineOperator plugin was not passed a "proposal": _("hack" or "smart" option.',
  ),
  PipeTopicUnbound: _(
    "Topic reference is unbound; it must be inside a pipe body.",
  ),
  PipeTopicUnconfiguredToken: _<{ token: string }>(
    ({ token }) =>
      `Invalid topic token ${token}. In order to use ${token} as a topic reference), the pipelineOperator plugin must be configured with { "proposal": _("hack"), "topicToken": _("${token}" }.`,
  ),
  PipeTopicUnused: _(
    "Hack-style pipe body does not contain a topic reference; Hack-style pipes must use topic at least once.",
  ),
  PipeUnparenthesizedBody: _<{ expressionDescription: string }>(
    ({ expressionDescription }) =>
      `Hack-style pipe body cannot be an unparenthesized ${expressionDescription} expression; please wrap it in parentheses.`,
  ),

  // Messages whose codes start with “Pipeline” or “PrimaryTopic”
  // are retained for backwards compatibility
  // with the deprecated smart-mix pipe operator proposal plugin.
  // They are subject to removal in a future major version.
  PipelineBodyNoArrow: _(
    'Unexpected arrow "=>" after pipeline body; arrow function in pipeline body must be parenthesized.',
  ),
  PipelineBodySequenceExpression: _(
    "Pipeline body may not be a comma-separated sequence expression.",
  ),
  PipelineHeadSequenceExpression: _(
    "Pipeline head should not be a comma-separated sequence expression.",
  ),
  PipelineTopicUnused: _(
    "Pipeline is in topic style but does not use topic reference.",
  ),
  PrimaryTopicNotAllowed: _(
    "Topic reference was used in a lexical context without topic binding.",
  ),
  PrimaryTopicRequiresSmartPipeline: _(
    'Topic reference is used), but the pipelineOperator plugin was not passed a "proposal": _("hack" or "smart" option.',
  ),

  PrivateInExpectedIn: _<{ name: string }>(
    ({ name }) =>
      `Private names are only allowed in property accesses (\`obj.#${name}\`) or in \`in\` expressions (\`#${name} in obj\`).`,
  ),
  PrivateNameRedeclaration: _<{ name: string }>(
    ({ name }) => `Duplicate private name #${name}.`,
  ),
  RecordExpressionBarIncorrectEndSyntaxType: _(
    "Record expressions ending with '|}' are only allowed when the 'syntaxType' option of the 'recordAndTuple' plugin is set to 'bar'.",
  ),
  RecordExpressionBarIncorrectStartSyntaxType: _(
    "Record expressions starting with '{|' are only allowed when the 'syntaxType' option of the 'recordAndTuple' plugin is set to 'bar'.",
  ),
  RecordExpressionHashIncorrectStartSyntaxType: _(
    "Record expressions starting with '#{' are only allowed when the 'syntaxType' option of the 'recordAndTuple' plugin is set to 'hash'.",
  ),
  RecordNoProto: _("'__proto__' is not allowed in Record expressions."),
  RestTrailingComma: _("Unexpected trailing comma after rest element."),
  SloppyFunction: _(
    "In non-strict mode code), functions can only be declared at top level), inside a block), or as the body of an if statement.",
  ),
  StaticPrototype: _("Classes may not have static property named prototype."),
  SuperNotAllowed: _(
    "`super()` is only valid inside a class constructor of a subclass. Maybe a typo in the method name ('constructor') or not extending another class?",
  ),
  SuperPrivateField: _("Private fields can't be accessed on super."),
  TrailingDecorator: _("Decorators must be attached to a class element."),
  TupleExpressionBarIncorrectEndSyntaxType: _(
    "Tuple expressions ending with '|]' are only allowed when the 'syntaxType' option of the 'recordAndTuple' plugin is set to 'bar'.",
  ),
  TupleExpressionBarIncorrectStartSyntaxType: _(
    "Tuple expressions starting with '[|' are only allowed when the 'syntaxType' option of the 'recordAndTuple' plugin is set to 'bar'.",
  ),
  TupleExpressionHashIncorrectStartSyntaxType: _(
    "Tuple expressions starting with '#[' are only allowed when the 'syntaxType' option of the 'recordAndTuple' plugin is set to 'hash'.",
  ),
  UnexpectedArgumentPlaceholder: _("Unexpected argument placeholder."),
  UnexpectedAwaitAfterPipelineBody: _(
    'Unexpected "await" after pipeline body; await must have parentheses in minimal proposal.',
  ),
  UnexpectedDigitAfterHash: _("Unexpected digit after hash token."),
  UnexpectedImportExport: _(
    "'import' and 'export' may only appear at the top level.",
  ),
  UnexpectedKeyword: _<{ keyword: string }>(
    ({ keyword }) => `Unexpected keyword '${keyword}'.`,
  ),
  UnexpectedLeadingDecorator: _(
    "Leading decorators must be attached to a class declaration.",
  ),
  UnexpectedLexicalDeclaration: _(
    "Lexical declaration cannot appear in a single-statement context.",
  ),
  UnexpectedNewTarget: _(
    "`new.target` can only be used in functions or class properties.",
  ),
  UnexpectedNumericSeparator: _(
    "A numeric separator is only allowed between two digits.",
  ),
  UnexpectedPrivateField: _("Unexpected private name."),
  UnexpectedReservedWord: _<{ reservedWord: string }>(
    ({ reservedWord }) => `Unexpected reserved word '${reservedWord}'.`,
  ),
  UnexpectedSuper: _("'super' is only allowed in object methods and classes."),
  UnexpectedToken: _<{
    loc: Position,
    expected?: string,
    /* eslint-disable no-confusing-arrow */
  }>(({ loc: { line, column }, expected }) =>
    expected
      ? `Unexpected token, expected "${expected} (${line}:${column})"`
      : "Unexpected token",
  ),
  UnexpectedTokenUnaryExponentiation: _(
    "Illegal expression. Wrap left hand side or entire exponentiation in parentheses.",
  ),
  UnsupportedBind: _("Binding should be performed on object property."),
  UnsupportedDecoratorExport: _(
    "A decorated export must export a class declaration.",
  ),
  UnsupportedDefaultExport: _(
    "Only expressions), functions or classes are allowed as the `default` export.",
  ),
  UnsupportedImport: _(
    "`import` can only be used in `import()` or `import.meta`.",
  ),
  UnsupportedMetaProperty: _<{ target: string, onlyValidProperty: string }>(
    ({ target, onlyValidProperty }) =>
      `The only valid meta property for ${target} is ${target}.${onlyValidProperty}.`,
  ),
  UnsupportedParameterDecorator: _(
    "Decorators cannot be used to decorate parameters.",
  ),
  UnsupportedPropertyDecorator: _(
    "Decorators cannot be used to decorate object literal properties.",
  ),
  UnsupportedSuper: _(
    "'super' can only be used with function calls (i.e. super()) or in property accesses (i.e. super.prop or super[prop]).",
  ),
  UnterminatedComment: _("Unterminated comment."),
  UnterminatedRegExp: _("Unterminated regular expression."),
  UnterminatedString: _("Unterminated string constant."),
  UnterminatedTemplate: _("Unterminated template."),
  VarRedeclaration: _<{ name: string }>(
    ({ name }) => `Identifier '${name}' has already been declared.`,
  ),
  YieldBindingIdentifier: _(
    "Can not use 'yield' as identifier inside a generator.",
  ),
  YieldInParameter: _("Yield expression is not allowed in formal parameters."),
  ZeroDigitNumericSeparator: _(
    "Numeric separator can not be used after leading 0.",
  ),
}));
