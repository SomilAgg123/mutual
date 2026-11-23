import { execFileSync } from 'node:child_process';
import { mkdir, readFile, writeFile, copyFile, rm } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { bundlePreview } from './bundle.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const output = join(root, '.site-build');
await rm(output, { recursive: true, force: true });
await mkdir(join(output, 'assets'), { recursive: true });
for (const name of ['index.html', 'style.css', 'walkthrough.js', 'preview.html', 'preview.css']) {
  await copyFile(join(root, 'site', name), join(output, name));
}
for (const name of ['Lato-Regular.ttf', 'Lato-Bold.ttf', 'Lato-Italic.ttf', 'OFL.txt']) {
  await copyFile(join(root, 'frontend/assets/fonts', name), join(output, 'assets', name));
}
await copyFile(join(root, 'frontend/assets/icons/Logo.png'), join(output, 'assets/logo.png'));
await copyFile(join(root, 'docs/screenshots/cards-and-matching.png'), join(output, 'assets/cards-and-matching.png'));
const profiles = JSON.parse(await readFile(join(root, 'examples/profiles.json'), 'utf8'));
const demo = JSON.parse(execFileSync('python3', [join(root, 'examples/match_demo.py'), '--json'], { cwd: root, encoding: 'utf8' }));
const avatars = await Promise.all(['beanie', 'blazer_woman', 'blue', 'confetti'].map(async name =>
  `data:image/png;base64,${(await readFile(join(root, 'frontend/assets/images', `${name}.png`))).toString('base64')}`));
await writeFile(join(output, 'assets/fixtures.js'), `window.__MUTUAL_REVIEW_DATA__=${JSON.stringify({ profiles, matches: demo.matches, avatars })};\n`);
await writeFile(join(output, 'assets/scores.js'), `window.mutualScores=${JSON.stringify(demo.matches)};\n`);
const bundle = await bundlePreview(join(root, 'site/preview.jsx'), { minify: true, legalComments: 'eof' });
await writeFile(join(output, 'assets/preview.js'), bundle.outputFiles[0].text);
await writeFile(join(output, '.nojekyll'), '');
console.log(`GitHub Pages site built in ${output}`);
