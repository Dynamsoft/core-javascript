import fs from "fs";
import path from "path";
import typescript from "@rollup/plugin-typescript";
import replace from "@rollup/plugin-replace";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import { dts } from "rollup-plugin-dts";

export default async (commandLineArgs) => {
  fs.rmSync("dist", { recursive: true, force: true });
  fs.cpSync("public", "dist", { recursive: true });

  const version = fs.readFileSync("version.txt", "utf8").replace(/\s+/g, "");
  const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
  const pkgVersion = packageJson.version;
  const bDev = process.env.BUILD === "development";

  const banner = `/*!
 * Dynamsoft JavaScript Library
 * @product Dynamsoft Core JS Edition
 * @website https://www.dynamsoft.com
 * @copyright Copyright ${new Date().getUTCFullYear()}, Dynamsoft Corporation
 * @author Dynamsoft
 * @version ${version}
 * @fileoverview Dynamsoft JavaScript Library for Core
 * More info on Dynamsoft Core JS: https://www.dynamsoft.com/capture-vision/docs/web/programming/javascript/api-reference/core/core-module.html
 */`;

  const terser_format = {
    comments: function (node, comment) {
      const text = comment.value;
      const type = comment.type;
      if (type == "comment2") {
        // multiline comment
        return /@author\sDynamsoft/i.test(text);
      }
    },
  };

  const plugin_terser_es6 = terser({ ecma: 6, format: terser_format });
  const plugin_terser_es5 = terser({ ecma: 5, format: terser_format });
  const replace_values = {
    "process.env.npm_package_version": JSON.stringify(pkgVersion),
    "ENV.version": JSON.stringify(version)
  };

  return [
    {
      input: "src/index.ts",
      plugins: [
        nodeResolve({ browser: true }),
        replace({
          preventAssignment: true,
          values: {
            ...replace_values,
            bDev: bDev,
          },
        }),
        typescript({ tsconfig: "./tsconfig.json" }),
      ],
      output: [
        {
          file: "dist/core.js",
          format: "umd",
          name: "Dynamsoft.Core",
          exports: "named",
          banner: banner,
          plugins: [plugin_terser_es5],
        },
        {
          file: "dist/core.mjs",
          format: "es",
          exports: "named",
          banner: banner,
          plugins: [
            plugin_terser_es6,
            {
              // https://rollupjs.org/guide/en/#writebundle
              writeBundle(options, bundle){
                fs.cpSync('dist/core.mjs','dist/core.esm.js');
              }
            },
          ],
        },
      ],
    },
    // browser.worker.js
    {
      input: "src/worker.ts",
      plugins: [
        typescript({
          tsconfig: "./tsconfig.json",
          declaration: false,
        }),
        replace({
          preventAssignment: true,
          values: {
            bDev: bDev,
            ...replace_values,
            // global: "undefined",
          },
        }),
        nodeResolve({
          exportConditions: ["browser", "default", "module", "import"],
        }),
      ],
      output: [
        {
          file: `dist/core.worker.js`,
          format: "iife",
          banner,
          plugins: [plugin_terser_es6],
        },
      ],
    },
    {
      input: 'dist/types/index.d.ts',
      plugins: [
        dts(),
        {
          // https://rollupjs.org/guide/en/#writebundle
          writeBundle(options, bundle){
            fs.rmSync('dist/types', {recursive:true, force:true});
            // change `export { type A }` to `export { A }`,
            // so project use old typescript still works.
            let txt = fs.readFileSync('dist/core.d.ts', {encoding:'utf8'}).replace(/([{,]) type /g,'$1 ');
            fs.writeFileSync('dist/core.d.ts', txt);
          }
        },
      ],
      output: [{
        file: 'dist/core.d.ts',
        format: 'es',
      }],
    },
  ];
};
