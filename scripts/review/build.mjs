import { bundlePreview } from './bundle.mjs';
import { execFileSync } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '../..');
const target = resolve(process.argv[2] || join(root, '.review-build'));
await mkdir(target, { recursive: true });
const escape = value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const data = async (path, type) => `data:${type};base64,${(await readFile(join(root, path))).toString('base64')}`;
const font = await data('frontend/assets/fonts/Lato-Regular.ttf', 'font/ttf');
const bold = await data('frontend/assets/fonts/Lato-Bold.ttf', 'font/ttf');
const italic = await data('frontend/assets/fonts/Lato-Italic.ttf', 'font/ttf');
const logo = await data('frontend/assets/icons/Logo.png', 'image/png');
const css = `
@font-face{font-family:Lato;src:url('${font}')}@font-face{font-family:LatoBold;src:url('${bold}')}
@font-face{font-family:LatoItalic;src:url('${italic}')}
*{box-sizing:border-box}body{margin:0;background:#f6f4f9;color:#231a31;font-family:Lato,Arial,sans-serif}
.page{width:1440px;padding:52px 66px 36px}.brand{display:flex;align-items:center;gap:12px;font-family:LatoBold;font-size:22px}
.brand img{width:36px;height:36px}.eyebrow{margin-left:auto;font-size:12px;letter-spacing:2px;color:#705c87}
h1{font:42px LatoBold;margin:24px 0 10px;letter-spacing:-1px}.intro{font-size:18px;line-height:1.6;color:#6a5d77;margin:0}
.devices{display:flex;gap:30px;margin-top:32px;justify-content:center}.device{width:390px}
.label{font:16px LatoBold;margin-bottom:12px;display:flex;align-items:center;gap:10px}.label small{font:12px Lato;color:#746981}
.frame{height:860px;width:390px;border:8px solid #26202f;border-radius:26px;overflow:hidden;background:#fff;box-shadow:0 12px 25px #30203d12;pointer-events:none}
.screen{display:flex;width:100%;height:100%;overflow:hidden}.note{font-size:14px;color:#6a5d77;line-height:1.6;margin-top:24px}
.pill{display:inline-block;background:#eae1f4;color:#69379a;border:1px solid #dac9e9;border-radius:24px;padding:8px 15px;font:14px LatoBold;margin-right:9px}
.console{background:#201a29;border:1px solid #3b2d4c;border-radius:14px;margin-top:24px;overflow:hidden;color:#f3ecfa}
.bar{padding:15px 24px;background:#2b2237;color:#bfb0d0;font:13px monospace;letter-spacing:.5px}.command{padding:24px 28px 0;color:#d6adfa;font:16px monospace}
pre{font:15px/1.75 ui-monospace,Menlo,monospace;white-space:pre-wrap;margin:20px 28px 28px}
.footer{display:flex;gap:24px;margin-top:22px}.card{flex:1;background:#fff;border:1px solid #e7e0ef;padding:19px 22px;border-radius:12px;font-size:15px;line-height:1.6;color:#675872}.card strong{display:block;color:#34263f;font-family:LatoBold}
`;
const brand = `<div class="brand"><img src="${logo}" alt="Mutual logo">mutual<span class="eyebrow">PORTFOLIO REVIEW</span></div>`;
const page = (title, body, script = '') => `<!doctype html><html><head><meta charset="utf-8"><title>${title}</title><style>${css}</style></head><body><main class="page">${brand}${body}</main>${script}</body></html>`;
const result = await bundlePreview(join(here, 'screens.jsx'));
const ui = `<h1>The original Mutual experience</h1><p class="intro">Preserved React Native components rendered in a browser for review.</p>
<div class="devices">${[['welcome','01 · Welcome','Original copy'],['search','02 · Find a friend','Fixed sample profiles'],['introductions','03 · Introductions','Fixed sample activity']].map(([id,title,detail]) => `<section class="device"><div class="label">${title}<small>${detail}</small></div><div class="frame"><div class="screen" id="${id}"></div></div></section>`).join('')}</div>
<p class="note">Read-only web previews, not native-device screenshots. Navigation is disabled; gradients, icons and the search control use browser adapters.<br>Original component layouts and copy are retained. Profile photos are the generated placeholders included in the repository.</p>`;
const fixtureData = {
  profiles: JSON.parse(await readFile(join(root, 'examples/profiles.json'), 'utf8')),
  matches: JSON.parse(execFileSync('python3', [join(root, 'examples/match_demo.py'), '--json'], { cwd: root, encoding: 'utf8' })).matches,
  avatars: await Promise.all(['beanie','blazer_woman','blue','confetti'].map(name => data(`frontend/assets/images/${name}.png`, 'image/png'))),
};
const script = `<script>window.__MUTUAL_REVIEW_DATA__=${JSON.stringify(fixtureData)};</script><script>${result.outputFiles[0].text.replaceAll('</script','<\\/script')}</script>`;
await writeFile(join(target,'screens.html'),page('Mutual — original component previews', ui, script));
const gallery = (title, intro, screens) => `<h1>${title}</h1><p class="intro">${intro}</p><div class="devices">${screens.map(([id,title,detail]) => `<section class="device"><div class="label">${title}<small>${detail}</small></div><div class="frame"><div class="screen" id="${id}"></div></div></section>`).join('')}</div><p class="note">Original components rendered through browser adapters with fictional profiles, placeholder images, and intercepted API responses.<br>Read-only previews, not a live native app. Matching scores come from the Python demo, rounded for the original UI. Scrollable views show their initial position.</p>`;
await writeFile(join(target, 'cards.html'), page('Mutual — cards and matching', gallery('Cards, profiles, and compatibility', 'The preserved browsing and matchmaking flow, populated with offline fixtures.', [['profile-card','01 · Profile card','Browse someone'],['recommendations','02 · Recommended matches','Score cards'],['comparison','03 · Match detail','Compare and introduce']]), script));
await writeFile(join(target, 'profiles.html'), page('Mutual — profile management', gallery('The profile and photo screens', 'Preserved settings and profile-editing layouts. Editing controls are disabled in this capture.', [['settings','01 · Profile settings','Fictional account'],['profile-editor','02 · Photos & responses','Original placeholder copy']]), script));
const output = execFileSync('python3', [join(root,'examples/match_demo.py')], { cwd:root, encoding:'utf8' });
const demo = `<h1>A matching example you can run</h1><p class="intro">Actual output from the maintained Python scorer, using four fictional profiles.</p>
<div style="margin-top:22px"><span class="pill">Python standard library</span><span class="pill">No cloud services</span><span class="pill">Explainable weighted rules</span></div>
<div class="console"><div class="bar">LOCAL DEMO OUTPUT</div><div class="command">$ python3 examples/match_demo.py</div><pre>${escape(output)}</pre></div>
<div class="footer"><div class="card"><strong>What the scores mean</strong>Similarity and complementarity are normalized rule scores. They are not predictions of relationship success.</div><div class="card"><strong>What is preserved</strong>The original mobile UI and Flask source sit alongside the maintained scorer, with clear status and contributor credits.</div></div>`;
await writeFile(join(target,'matching-demo.html'),page('Mutual — matching demo',demo));
console.log(`Review pages written to ${target}`);
