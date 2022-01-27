import { multiple as getFixtures } from "@babel/helper-fixtures";
import { existsSync, readFileSync, unlinkSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import Difference from "./difference.js";
import FixtureError from "./fixture-error.js";
import toFuzzedOptions from "./to-fuzzed-options.js";
import { serialize, deserialize } from "./serialization.js";
import toContextualSyntaxError from "./to-contextual-syntax-error.js";
import { parse } from "@babel/parser";

const { BABEL_8_BREAKING, CI, OVERWRITE, BABEL } = process.env;
const { stringify, parse: JSONParse } = JSON;


export default function runFixtureTests(
  inputPath,
  parseFunction,
  onlyCompareErrors = false,
) {
    // console.log("IN HERE WITH: " + fixturePath);
    const fixturePath = dirname(inputPath);

    const options = [dirname(dirname(fixturePath)), dirname(fixturePath), fixturePath]
      .map(path => readJSON(join(path, "options.json")))
      .reduce((lhs, rhs) => ({ ...lhs, ...rhs }), { });

    const disabled =
      //taskName[0] === "." ||
      (BABEL_8_BREAKING
        ? options.BABEL_8_BREAKING === false
        : options.BABEL_8_BREAKING === true);
if (inputPath.indexOf("valid-trailing-comma-for-rest") > -1) {
console.log("OPTIONS for " + inputPath, options);
}
    const input = readFileSync(inputPath, "utf-8").trimRight();
    const expectedPath = toExpectedPath(fixturePath);
    const expectedContents = expectedPath && readFileSync(expectedPath, "utf-8");
    const expected = deserialize(expectedPath, options, expectedContents);

    if (expected.threw && expected.ast) {
      throw Error(
        "File output.json exists although options specify throws. Remove expected.json.",
      );
    }

    const testFn = disabled ? it.skip : it;
    const toStartPosition = ({ startLine = 1, startColumn = 0 }) =>
    `(${startLine}, ${startColumn})`;

    const test = { input, inputPath, expected, onlyCompareErrors };
    const fuzzedOptions = toFuzzedOptions(options);

    for (const [adjust, options] of fuzzedOptions) {
      testFn(`start = ${toStartPosition(options)}`,
        () => runParseTest(parse, test, adjust, options));
    }
}

function toExpectedPath(fixturePath)
{
  const normalPath = join(fixturePath, "output.json");
  const extendedPath = join(fixturePath, "output.extended.json");

  return existsSync(normalPath)
    ? normalPath
    : existsSync(extendedPath)
    ? extendedPath
    : false;
}

const toJustErrors = result => ({
  threw: result.threw,
  ast: result.ast && { errors: result.ast.errors },
});

function runParseTest(parse, test, adjust, options) {
  const { input, inputPath, expected, onlyCompareErrors } = test;

  const actual = parseWithRecovery(parse, input, inputPath, options);
  const difference = new Difference(
    adjust,
    onlyCompareErrors ? toJustErrors(expected) : expected,
    onlyCompareErrors ? toJustErrors(actual) : actual,
  );

  // No differences means we passed and there's nothing left to do.
  if (difference === Difference.None) return;

  const error = FixtureError.fromDifference(difference, actual);

  // If we're not overwriting the current values with whatever we get this time
  // around, then we have a legitimate error that we need to report.
  if (!OVERWRITE) throw error;

  // We only write the output of the original test, not all it's auto-generated
  // variations.
  if (!test.original) return;

  const testLocation = test.taskDir;

  // FIXME: We're just maintaining the legacy behavior of storing *just* the
  // error `message` here, which differs from the error's `toString()` that we
  // store for each error in the `errors` array. In both cases, we should
  // serialize the full error to be able to property test locations,
  // reasonCodes, etc.
  const throws = !!actual.threw && actual.threw.message;
  const optionsLocation = join(testLocation, "options.json");

  // We want to throw away the contents of `throws` here.
  // eslint-disable-next-line no-unused-vars
  const { throws: _, ...oldOptions } = readJSON(optionsLocation);
  const newOptions = { ...oldOptions, ...(throws && { throws }) };

  // Store (or overwrite) the options file if there's anything to record,
  // otherwise remove it.
  if (Object.keys(newOptions).length > 0) {
    writeFileSync(optionsLocation, stringify(newOptions, null, 2), "utf-8");
  } else if (existsSync(optionsLocation)) {
    unlinkSync(optionsLocation);
  }

  // When only comparing errors, we don't want to overwrite the AST JSON because
  // it belongs to a different test.
  if (onlyCompareErrors) return;

  const normalLocation = join(testLocation, "output.json");
  const extendedLocation = join(testLocation, "output.extended.json");

  const [extended, serialized] = actual.ast ? serialize(actual.ast) : [];
  const outputLocation =
    serialized && (extended ? extendedLocation : normalLocation);

  if (outputLocation) {
    writeFileSync(outputLocation, serialized, "utf-8");
  }

  // Remove any previous output files that are no longer valid, either because
  // extension changed, or because we aren't writing it out at all anymore.
  for (const location of [normalLocation, extendedLocation]) {
    if (location !== outputLocation && existsSync(location)) {
      unlinkSync(location);
    }
  }
}

function readJSON(filename) {
  try {
    return JSONParse(readFileSync(filename, "utf-8"));
  } catch (error) {
    return {};
  }
}

function parseWithRecovery(parse, source, filename, options) {
  try {
    const ast = parse(source, { errorRecovery: true, ...options });

    // Normalize the AST
    //
    // TODO: We should consider doing something more involved here as
    // we may miss bugs where we put unexpected falsey objects in these
    // properties.
    if (ast.comments && !ast.comments.length) delete ast.comments;
    if (ast.errors && !ast.errors.length) delete ast.errors;
    else {
      ast.errors = ast.errors.map(error =>
        toContextualSyntaxError(error, source, filename, options),
      );
    }

    return { threw: false, ast };
  } catch (error) {
    return {
      threw: toContextualSyntaxError(error, source, filename, options),
      ast: false,
    };
  }
}
