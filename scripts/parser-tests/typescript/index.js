import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import TestRunner from "../utils/parser-test-runner.js";
import ErrorCodes from "./error-codes.js";

import { spawnSync } from "child_process";
const getEncoding = path =>
  spawnSync("file", ["--brief", "--mime-encoding", path])
    .stdout.toString()
    .slice(0, -1);
const toNodeEncoding = fileEncoding =>
  ({
    "us-ascii": "utf-8",
    "utf-8": "utf-8",
    "utf-16le": "utf-16le",
    "utf-16be": "utf-16be",
    "iso-8859-1": "latin1",
  }[fileEncoding] || false);

const ErrorCodeRegExp = new RegExp(ErrorCodes.join("|"));

const dirname = path.dirname(fileURLToPath(import.meta.url));

function* loadTests(dir) {
  const names = fs.readdirSync(dir).map(name => [name, path.join(dir, name)]);
  //.filter(([name]) => allowed.has(name));

  for (const [name, filename] of names) {
    const encoding = getEncoding(filename);
    if (encoding === "utf-16be" || encoding === "binary") continue;
    yield {
      name,
      contents: fs.readFileSync(filename, toNodeEncoding(encoding)),
    };
  }
}

const plugins = ["typescript", "decorators-legacy", "importAssertions"];
const pluginsWithJSX = [...plugins, "jsx"];

const TSTestsPath = path.join(dirname, "../../../build/typescript/tests");

// Check if the baseline errors contain the codes that should also be thrown from babel-parser
function baselineContainsParserErrorCodes(testName) {
  try {
    if (testName.includes("aliasErrors")) {
      console.log(
        "WILL TEST " +
          path.join(
            TSTestsPath,
            "baselines/reference",
            testName.replace(/\.tsx?$/, ".errors.txt")
          )
      );
      console.log(
        "WILL TEST " +
          fs.readFileSync(
            path.join(
              TSTestsPath,
              "baselines/reference",
              testName.replace(/\.tsx?$/, ".errors.txt")
            ),
            "utf8"
          )
      );
    }
    return ErrorCodeRegExp.test(
      fs.readFileSync(
        path.join(
          TSTestsPath,
          "baselines/reference",
          testName.replace(/\.tsx?$/, ".errors.txt")
        ),
        "utf8"
      )
    );
  } catch (e) {
    if (e.code !== "ENOENT") {
      throw e;
    }
    return false;
  }
}

const IgnoreRegExp = /@noTypesAndSymbols|ts-ignore|\n#!/;

const runner = new TestRunner({
  testDir: path.join(TSTestsPath, "./cases/compiler"),
  allowlist: path.join(dirname, "allowlist.txt"),
  logInterval: 50,
  shouldUpdate: process.argv.includes("--update-allowlist"),

  *getTests() {
    for (const test of loadTests(this.testDir)) {
      if (IgnoreRegExp.test(test.contents)) {
        continue;
      }

      yield {
        contents: splitTwoslashCodeInfoFiles(
          test.contents,
          "default",
          `${test.name}/`
        )
          .map(([filename, lines]) => [
            filename.replace(/\/default$/, ""),
            lines.join("\n"),
          ])
          .filter(([sourceFilename]) => !sourceFilename.endsWith(".json"))
          .map(([sourceFilename, contents]) => ({
            contents,
            sourceFilename,
            sourceType: "module",
            plugins: sourceFilename.endsWith(".tsx") ? pluginsWithJSX : plugins,
          })),
        expectedError: baselineContainsParserErrorCodes(test.name),
        sourceFilename: test.name,
        id: test.name,
      };
    }
  },
});

const BracketedFileRegExp = /\/\/\/\/\s*\[([^\]]+)\][^\n]*(\n|$)/;
const AtFileRegExp = /(?:^|\n)\/\/\s*@filename:\s*([^\s]*)\s*(?:\n|$)/i;

// Modified from: https://github.com/microsoft/TypeScript-Website/blob/v2/packages/ts-twoslasher/src/index.ts
function splitTwoslashCodeInfoFiles(code, defaultFileName, root = "") {
  const lines = code.split(/\r\n?|\n/g);

  let nameForFile = code.includes(`@filename: ${defaultFileName}`)
    ? "global.ts"
    : defaultFileName;
  let currentFileContent = [];
  const fileMap = [];

  for (const line of lines) {
    const newFileName = BracketedFileRegExp.test(line)
      ? line.match(BracketedFileRegExp)[1]
      : AtFileRegExp.test(line)
      ? line.match(AtFileRegExp)[1]
      : false;
    if (newFileName) {
      fileMap.push([root + nameForFile, currentFileContent]);
      nameForFile = newFileName;
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
}

runner.run().catch(err => {
  console.error(err);
  process.exitCode = 1;
});
