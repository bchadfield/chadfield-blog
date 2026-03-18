const fs = require('fs');
const path = require('path');
const {spawn} = require('child_process');
const {buildAssets} = require('./build-assets');

const rootDir = path.resolve(__dirname, '..');
const watchTargets = [
  path.join(rootDir, 'src/assets/css'),
  path.join(rootDir, 'src/assets/css-utils'),
  path.join(rootDir, 'src/assets/design-tokens'),
  path.join(rootDir, 'src/assets/scripts'),
  path.join(rootDir, 'tailwind.config.js')
];

let buildScheduled = false;
let buildRunning = false;

async function runBuild() {
  if (buildRunning) {
    buildScheduled = true;
    return;
  }

  buildRunning = true;

  try {
    await buildAssets();
  } catch (error) {
    console.error(error);
  } finally {
    buildRunning = false;
    if (buildScheduled) {
      buildScheduled = false;
      setTimeout(runBuild, 50);
    }
  }
}

function watch(target) {
  const stats = fs.statSync(target);
  return fs.watch(target, {recursive: stats.isDirectory()}, () => {
    runBuild();
  });
}

async function start() {
  await buildAssets();

  const eleventyBin = path.join(
    rootDir,
    'node_modules',
    '.bin',
    process.platform === 'win32' ? 'eleventy.cmd' : 'eleventy'
  );
  const eleventyProcess =
    process.platform === 'win32'
      ? spawn('cmd.exe', ['/c', eleventyBin, '--serve', '--watch'], {
          cwd: rootDir,
          stdio: 'inherit'
        })
      : spawn(eleventyBin, ['--serve', '--watch'], {
          cwd: rootDir,
          stdio: 'inherit'
        });

  const watchers = watchTargets.map(watch);

  const cleanup = () => {
    watchers.forEach(watcher => watcher.close());
    eleventyProcess.kill();
  };

  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);
  eleventyProcess.on('exit', code => {
    watchers.forEach(watcher => watcher.close());
    process.exit(code ?? 0);
  });
}

start().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
