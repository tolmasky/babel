import { readFileSync } from "fs";

const sourceURL = new URL("./fixture-source.mjs", import.meta.url);
const source = readFileSync(sourceURL, "utf-8");

const FixtureRegExp = new RegExp(`/babel-parser/test/fixtures/.*\\/input\\.[jt]sx?$`);
const isFixture = specifier =>
    specifier.endsWith(".fixture/input.js") ||
    FixtureRegExp.test(specifier);

export async function resolve(specifier, context, next) {
  //console.log("resolving for: " + specifier);
  if (specifier === "@babel/run-fixture-tests") {
  //    console.log("HERE!!!");
  //    console.log(new URL("./run-fixture-tests-2.js", import.meta.url).href + "");
    return { url: new URL("./run-fixture-tests-2.js", import.meta.url).href };
  }
  /*if (isFixture(specifier)) {
    const parentURL = context.parentURL.replace(/^file:/, "fixture:");

    return { url: new URL(specifier, parentURL).href };
  }*/
  


  return next(specifier, context);
}
/*
export async function getSource(...args)
{
    console.log("IN HERE", ...args);
    return { source: template };
}

export async function getFormat(...args)
{
    return { format: "module" };
}
*/
export async function load(resolvedURL, context, next)
{//console.log("here for " + resolvedURL);

    if (isFixture(resolvedURL)) {//console.log("here...");
        return { format: "module", source };
    }
    
    return next(resolvedURL, context);
}

// console.log("done...");
