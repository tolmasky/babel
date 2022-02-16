import path from "path";
import fs from "fs/promises";
import { fileURLToPath } from "url";
import ts from "../../../build/typescript/lib/typescript.js";
import TestRunner from "../utils/parser-test-runner.js";
import parsingErrorCodes from "./error-codes.js";

const dirname = path.dirname(fileURLToPath(import.meta.url));

async function* loadTests(dir) {
  const names = await fs.readdir(dir);

  for (const name of names) {
    const contents = await fs.readFile(path.join(dir, name), "utf8");
    yield { name, contents };
  }
}

const plugins = ["typescript", "decorators-legacy", "importAssertions"];

const TSTestsPath = path.join(dirname, "../../../build/typescript/tests");

// Check if the baseline errors contain the codes that should also be thrown from babel-parser
async function baselineContainsParserErrorCodes(testName) {
  try {
    const baselineErrors = await fs.readFile(
      path.join(
        TSTestsPath,
        "baselines/reference",
        testName.replace(/\.tsx?$/, ".errors.txt")
      ),
      "utf8"
    );
    return parsingErrorCodes.some(code => baselineErrors.includes(code));
  } catch (e) {
    if (e.code !== "ENOENT") {
      throw e;
    }
    return false;
  }
}

const runner = new TestRunner({
  testDir: path.join(TSTestsPath, "./cases/compiler"),
  allowlist: path.join(dirname, "allowlist.txt"),
  logInterval: 50,
  shouldUpdate: process.argv.includes("--update-allowlist"),

  async *getTests() {
    for await (const test of loadTests(this.testDir)) {
      const isTSX = test.name.slice(-4) === ".tsx";

      const ast = ts.createSourceFile(
        test.name,
        test.contents,
        ts.ScriptTarget.Latest,
        false,
        isTSX ? ts.ScriptKind.TSX : ts.ScriptKind.TS
      );

      const files = splitTwoslashCodeInfoFiles(
        test.contents,
        "default",
        `${test.name}/`
      ).map(([filename, lines]) => [
        filename.replace(/\/default$/, ""),
        lines.join("\n"),
      ]);
      console.log("WILL USE", files.length === 1 ? test.contents : files);
      yield {
        contents: files.length === 1 ? test.contents : files,
        fileName: test.name,
        id: test.name,
        expectedError:
          ast.parseDiagnostics.length > 0 ||
          (await baselineContainsParserErrorCodes(test.name)),
        sourceType: "module",
        plugins: isTSX ? plugins.concat("jsx") : plugins,
      };
    }
  },
});

runner.run().catch(err => {
  console.error(err);
  process.exitCode = 1;
});

// From: https://github.com/microsoft/TypeScript-Website/blob/v2/packages/ts-twoslasher/src/index.ts
const splitTwoslashCodeInfoFiles = (code, defaultFileName, root = "") => {
  const lines = code.split(/\r\n?|\n/g);

  let nameForFile = code.includes(`@filename: ${defaultFileName}`)
    ? "global.ts"
    : defaultFileName;
  let currentFileContent = [];
  const fileMap = [];

  for (const line of lines) {
    if (line.includes("// @filename: ")) {
      fileMap.push([root + nameForFile, currentFileContent]);
      nameForFile = line.split("// @filename: ")[1].trim();
      currentFileContent = [];
    } else {
      currentFileContent.push(line);
    }
  }
  fileMap.push([root + nameForFile, currentFileContent]);

  // Basically, strip these:
  // ["index.ts", []]
  // ["index.ts", [""]]
  const nameContent = fileMap.filter(
    n => n[1].length > 0 && (n[1].length > 1 || n[1][0] !== "")
  );
  return nameContent;
};
