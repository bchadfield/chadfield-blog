// The stylesheet pipeline (was scripts/build-assets.js): Tailwind with the design tokens,
// glob imports, autoprefixer and cssnano.
import { readFile } from "node:fs/promises";
import postcss from "postcss";
import postcssImport from "postcss-import";
import postcssImportExtGlob from "postcss-import-ext-glob";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";

export async function buildCss(file: string): Promise<string> {
  const result = await postcss([postcssImportExtGlob, postcssImport, tailwindcss, autoprefixer, cssnano]).process(await readFile(file, "utf8"), {
    from: file,
    to: file
  });
  return result.css;
}
