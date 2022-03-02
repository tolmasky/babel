// @flow

import { ParseErrorCodes, toParseErrorCredentials } from "../parse-error";

export default (_: typeof toParseErrorCredentials) => ({
  ImportMetaOutsideModule: _<"ImportMetaOutsideModule">(
    `import.meta may appear only with 'sourceType: "module"'`,
    { code: ParseErrorCodes.SourceTypeModuleError },
  ),
  ImportOutsideModule: _<"ImportOutsideModule">(
    `'import' and 'export' may appear only with 'sourceType: "module"'`,
    { code: ParseErrorCodes.SourceTypeModuleError },
  ),
});
