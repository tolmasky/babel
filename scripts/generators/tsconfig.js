import fs from "fs";

function importJSON(path) {
  return JSON.parse(fs.readFileSync(path));
}

const archivedSyntaxPkgs = importJSON(
  new URL("./archived-syntax-pkgs.json", import.meta.url)
);

const thirdPartyBabelPlugins = [
  "@babel/preset-modules/lib/plugins/transform-async-arrows-in-class",
  "@babel/preset-modules/lib/plugins/transform-edge-default-parameters",
  "@babel/preset-modules/lib/plugins/transform-edge-function-name",
  "@babel/preset-modules/lib/plugins/transform-tagged-template-caching",
  "@babel/preset-modules/lib/plugins/transform-safari-block-shadowing",
  "@babel/preset-modules/lib/plugins/transform-safari-for-shadowing",
  "babel-plugin-polyfill-corejs2",
  "babel-plugin-polyfill-corejs3",
  "babel-plugin-polyfill-regenerator",
  "regenerator-transform",
];

const root = new URL("../../", import.meta.url);

function getTsPkgs(subRoot) {
  return fs
    .readdirSync(new URL(subRoot, root))
    .filter(name => name.startsWith("babel-"))
    .map(name => {
      const relative = `./${subRoot}/${name}`;
      const packageJSON = importJSON(new URL(relative + "/package.json", root));
      // Babel 8 exports > Babel 7 exports > {}
      const exports =
        packageJSON.conditions?.BABEL_8_BREAKING?.[0]?.exports ??
        packageJSON.exports ??
        {};
      const subExports = Object.entries(exports).flatMap(
        ([_export, exportPath]) => {
          // The @babel/standalone has babel.js as exports, but we don't have src/babel.ts
          if (name === "babel-standalone") {
            return [["", "/src"]];
          }
          if (name === "babel-compat-data") {
            // map ./plugins to ./data/plugins.json
            const subExport = _export.slice(1);
            const subExportPath = exportPath
              .replace("./", "/data/")
              .replace(/\.js$/, ".json");
            return [[subExport, subExportPath]];
          }
          // [{esm, default}, "./lib/index.js"]
          if (Array.isArray(exportPath)) {
            exportPath = exportPath[1];
          }
          if (typeof exportPath === "object") {
            exportPath = exportPath.default;
          }
          if (exportPath.startsWith("./lib") && exportPath.endsWith(".js")) {
            // remove the leading `.` and trailing `.js`
            const subExport = _export.slice(1).replace(/\.js$/, "");
            const subExportPath = exportPath
              .replace("./lib", "/src")
              .replace(/\.js$/, ".ts")
              .replace(/\/index\.ts$/, "");
            return [[subExport, subExportPath]];
          }
          return [];
        }
      );
      return {
        name: name.replace(/^babel-/, "@babel/"),
        relative,
        subExports,
      };
    })
    .filter(({ name, relative }) => {
      const ret =
        // They are special-cased because them dose not have a index.ts
        name === "@babel/register" ||
        name === "@babel/cli" ||
        name === "@babel/node" ||
        // @babel/compat-data is used by preset-env
        name === "@babel/compat-data" ||
        fs.existsSync(new URL(relative + "/src/index.ts", root));
      if (!ret) {
        console.log(`Skipping ${name} for tsconfig.json`);
      }
      return ret;
    });
}

const tsPkgs = [
  ...getTsPkgs("packages"),
  ...getTsPkgs("eslint"),
  ...getTsPkgs("codemods"),
];

fs.writeFileSync(
  new URL("tsconfig.json", root),
  "/* This file is automatically generated by scripts/generators/tsconfig.js */\n" +
    JSON.stringify(
      {
        extends: "./tsconfig.base.json",
        include: tsPkgs.map(({ relative }) => `${relative}/src/**/*.ts`),
        compilerOptions: {
          paths: Object.fromEntries([
            ...tsPkgs.flatMap(({ name, relative, subExports }) => {
              return subExports.map(([subExport, subExportPath]) => {
                return [name + subExport, [relative + subExportPath]];
              });
            }),
            ...archivedSyntaxPkgs.map(name => [
              name,
              ["./lib/archived-libs.d.ts"],
            ]),
            ...thirdPartyBabelPlugins.map(name => [
              name,
              ["./lib/third-party-libs.d.ts"],
            ]),
            [
              "babel-plugin-dynamic-import-node/utils",
              ["./lib/babel-plugin-dynamic-import-node.d.ts"],
            ],
            ["globals", ["./node_modules/globals-BABEL_8_BREAKING-true"]],
            ["js-tokens", ["./node_modules/js-tokens-BABEL_8_BREAKING-true"]],
            ["regexpu-core", ["./lib/regexpu-core.d.ts"]],
            [
              "to-fast-properties",
              ["./node_modules/to-fast-properties-BABEL_8_BREAKING-true"],
            ],
            ["slash", ["./node_modules/slash-BABEL_8_BREAKING-true"]],
            ["fs-readdir-recursive", ["./lib/fs-readdir-recursive.d.ts"]],
            ["kexec", ["./lib/kexec.d.ts"]],
          ]),
        },
      },
      null,
      2
    )
);
