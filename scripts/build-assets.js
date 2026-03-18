const fs = require('fs/promises');
const path = require('path');
const esbuild = require('esbuild');
const postcss = require('postcss');
const postcssImport = require('postcss-import');
const postcssImportExtGlob = require('postcss-import-ext-glob');
const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

const rootDir = path.resolve(__dirname, '..');
const cssEntry = path.join(rootDir, 'src/assets/css/global.css');
const jsEntry = path.join(rootDir, 'src/assets/scripts/app.js');
const cssOutput = path.join(rootDir, '.cache/assets/css/global.css');
const jsOutput = path.join(rootDir, '.cache/assets/scripts/app.js');

async function buildCss() {
  const content = await fs.readFile(cssEntry, 'utf8');
  const result = await postcss([
    postcssImportExtGlob,
    postcssImport,
    tailwindcss,
    autoprefixer,
    cssnano
  ]).process(content, {
    from: cssEntry,
    to: cssOutput
  });

  await fs.mkdir(path.dirname(cssOutput), {recursive: true});
  await fs.writeFile(cssOutput, result.css);
}

async function buildJs() {
  await fs.mkdir(path.dirname(jsOutput), {recursive: true});
  await esbuild.build({
    entryPoints: [jsEntry],
    bundle: true,
    minify: true,
    outfile: jsOutput,
    target: 'es2020'
  });
}

async function buildAssets() {
  await Promise.all([buildCss(), buildJs()]);
}

if (require.main === module) {
  buildAssets().catch(error => {
    console.error(error);
    process.exitCode = 1;
  });
}

module.exports = {
  buildAssets
};
