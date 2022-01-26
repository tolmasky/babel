import { dirname } from "path";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";

import runFixtureTests from "@babel/run-fixture-tests";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);



runFixtureTests(__dirname);
/*
import { parse } from "@babel/parser";

const input = readFileSync(`${__dirname}/input.js`, "utf-8");

console.log(input);

console.log(parse(input));
*/