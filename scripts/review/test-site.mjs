import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import { dirname, resolve, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const output = join(root, '.site-build');
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.ttf': 'font/ttf' };
// Serve beneath /mutual/ to exercise GitHub project-site paths, not only a domain root.
const server = createServer(async (request, response) => {
  const pathname = new URL(request.url, 'http://localhost').pathname;
  if (!pathname.startsWith('/mutual/')) { response.writeHead(404).end(); return; }
  const path = resolve(output, '.' + pathname.slice('/mutual'.length), pathname.endsWith('/') ? 'index.html' : '');
  if (!path.startsWith(output + '/')) { response.writeHead(404).end(); return; }
  try {
    const bytes = await readFile(path);
    response.writeHead(200, { 'Content-Type': types[extname(path)] || 'application/octet-stream' }).end(bytes);
  } catch { response.writeHead(404).end(); }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const url = process.env.MUTUAL_SITE_URL || `http://127.0.0.1:${server.address().port}/mutual/`;
const origin = new URL(url).origin;
const browser = await chromium.launch({ headless: true, ...(process.env.MUTUAL_BROWSER_CHANNEL ? { channel: process.env.MUTUAL_BROWSER_CHANNEL } : {}) });
const errors = [];
const requests = [];
const context = await browser.newContext({ viewport: { width: 1440, height: 1100 }, reducedMotion: 'reduce' });
const page = await context.newPage();
page.on('pageerror', error => errors.push(error.message));
page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
page.on('request', request => {
  if (request.url().startsWith('http') && new URL(request.url()).origin !== origin) requests.push(request.url());
  if (request.method() !== 'GET') requests.push(`${request.method()} ${request.url()}`);
});
page.on('response', response => { if (response.status() >= 400) errors.push(`HTTP ${response.status()}: ${response.url()}`); });
const screens = [
  ['browse', 'Jordan Example'], ['matches', "Alex's best matches"], ['compare', 'Jordan, 22'],
  ['icebreaker', 'Select a question for'], ['introductions', "Friends you've arranged"],
  ['profile', 'Settings'], ['responses', 'Responses'],
];

async function checkScreen(id, expected) {
  await page.waitForFunction(id => document.getElementById('app-screen').contentDocument?.documentElement?.dataset.screen === id, id);
  const frame = page.frameLocator('#app-screen');
  await frame.getByText(expected, { exact: true }).waitFor({ state: 'visible' });
  const failure = await page.locator('#app-screen').evaluate(element => element.contentDocument.documentElement.dataset.reviewFailed);
  assert.equal(failure, undefined, `${id} had a runtime failure`);
}

try {
  assert.equal((await page.goto(url)).status(), 200);
  await checkScreen(...screens[0]);
  assert.equal(await page.locator('#previous').isDisabled(), true);
  for (let index = 1; index < screens.length; index++) {
    await page.locator('#next').click();
    await checkScreen(...screens[index]);
    assert.ok(page.url().endsWith(`#tour/${screens[index][0]}`));
  }
  await page.locator('#next').click();
  await checkScreen(...screens[0]);
  await page.locator('[data-step="compare"]').click();
  await checkScreen(...screens[2]);
  await page.reload();
  await checkScreen(...screens[2]);
  await page.locator('#previous').click();
  await checkScreen(...screens[1]);
  await page.goBack();
  await checkScreen(...screens[2]);
  await page.locator('[data-step="icebreaker"]').focus();
  await page.keyboard.press('ArrowRight');
  await checkScreen(...screens[4]);
  for (const [index, name, similarity, complementarity] of [[0, 'Jordan', '89.5%', '100.0%'], [1, 'Riley', '56.1%', '36.7%'], [2, 'Casey', '19.7%', '15.8%']]) {
    await page.locator(`[data-candidate="${index}"]`).click();
    assert.equal(await page.locator('#candidate-name').textContent(), name);
    assert.equal(await page.locator('#similarity-value').textContent(), similarity);
    assert.equal(await page.locator('#complementarity-value').textContent(), complementarity);
  }
  await page.locator('[data-step="browse"]').click();
  await checkScreen(...screens[0]);
  await page.locator('[data-candidate="0"]').click();
  await page.evaluate(() => window.scrollTo(0, 0));
  const captureDirectory = process.env.MUTUAL_CAPTURE_DIR;
  if (captureDirectory) {
    await mkdir(captureDirectory, { recursive: true });
    await page.screenshot({ path: join(captureDirectory, 'walkthrough-desktop.png'), fullPage: true });
  }
  for (const width of [390, 320, 768]) {
    await page.setViewportSize({ width, height: 844 });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Horizontal page overflow at ${width}px`);
    await page.locator('[data-step="icebreaker"]').click();
    await checkScreen(...screens[3]);
    await page.locator('#next').click();
    await checkScreen(...screens[4]);
    if (width === 390 && captureDirectory) {
      await page.locator('[data-step="browse"]').click();
      await checkScreen(...screens[0]);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.screenshot({ path: join(captureDirectory, 'walkthrough-mobile.png'), fullPage: true });
    }
  }
  assert.deepEqual(requests, [], 'The walkthrough must not call external services or perform writes');
  assert.deepEqual(errors, [], 'The walkthrough must render without browser errors');
  console.log('Walkthrough checks passed: 7 screens, next/previous/restart, deep links, browser history, keyboard navigation, 3 score comparisons, and responsive widths 320/390/768/1440.');
} finally {
  await browser.close();
  await new Promise(resolve => server.close(resolve));
}
