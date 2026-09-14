import puppeteer from 'puppeteer-core';
import { mkdir, writeFile } from 'node:fs/promises';

const base = process.env.QA_BASE_URL || 'http://127.0.0.1:4173/';
const chrome = process.env.CHROME_BIN || '/usr/bin/google-chrome';
await mkdir('qa/screenshots', { recursive: true });

const report = { checks: [], consoleErrors: [], pageErrors: [], requestFailures: [] };
const browser = await puppeteer.launch({ executablePath: chrome, headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });

const searchFixture = {
  numFound: 42,
  start: 0,
  docs: [
    { key: '/works/OL27448W', title: 'The Architecture of Form', author_name: ['Ada North'], author_key: ['OL1A'], first_publish_year: 2018, edition_count: 4, language: ['eng'], ratings_average: 4.2, ratings_count: 91 },
    { key: '/works/OL82563W', title: 'Design Systems in Practice', author_name: ['Noah Vale'], author_key: ['OL2A'], first_publish_year: 2021, edition_count: 2, language: ['eng'], ratings_average: 4.5, ratings_count: 48 }
  ]
};
const workFixture = {
  key: '/works/OL27448W',
  title: 'The Architecture of Form',
  description: 'A study of structure, rhythm, material and the visual systems that make spaces legible.',
  subjects: ['Architecture', 'Design', 'Visual systems'],
  authors: [{ author: { key: '/authors/OL1A' } }]
};
const authorFixture = { name: 'Ada North', birth_date: '1978' };

async function mockOpenLibrary(page) {
  await page.setRequestInterception(true);
  page.on('request', request => {
    const url = new URL(request.url());
    if (url.hostname !== 'openlibrary.org') return request.continue();
    const headers = { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' };
    if (url.pathname === '/search.json') return request.respond({ status: 200, headers, body: JSON.stringify(searchFixture) });
    if (url.pathname === '/works/OL27448W.json') return request.respond({ status: 200, headers, body: JSON.stringify(workFixture) });
    if (url.pathname === '/authors/OL1A.json') return request.respond({ status: 200, headers, body: JSON.stringify(authorFixture) });
    return request.respond({ status: 404, headers, body: '{}' });
  });
}

function wire(page, label) {
  page.on('console', msg => {
    if (msg.type() === 'error') report.consoleErrors.push({ page: label, text: msg.text() });
  });
  page.on('pageerror', error => report.pageErrors.push({ page: label, text: String(error) }));
  page.on('requestfailed', request => {
    if (!['document', 'fetch', 'xhr'].includes(request.resourceType())) return;
    report.requestFailures.push({ page: label, url: request.url(), error: request.failure()?.errorText || 'failed' });
  });
}

async function check(name, fn) {
  const value = await fn();
  report.checks.push({ name, pass: Boolean(value) });
  if (!value) throw new Error(`Check failed: ${name}`);
}

async function waitForResults(page) {
  await page.waitForSelector('.book-grid .book-card:not(.skeleton-card)', { timeout: 10000 });
}

let fatalError;
try {
  const page = await browser.newPage();
  await mockOpenLibrary(page);
  wire(page, 'desktop');
  await page.setViewport({ width: 1440, height: 1050, deviceScaleFactor: 1 });
  await page.goto(base, { waitUntil: 'networkidle2', timeout: 20000 });
  await waitForResults(page);

  await check('API contract renders book cards', async () => page.$$eval('.book-grid .book-card:not(.skeleton-card)', els => els.length === 2));
  await check('desktop has no global overflow', async () => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1));
  await page.screenshot({ path: 'qa/screenshots/01-discover-desktop.png', fullPage: true });

  await page.$eval('.search-field input', el => { el.value = 'architecture'; el.dispatchEvent(new Event('input', { bubbles: true })); });
  await page.click('.search-row button[type=submit]');
  await page.waitForFunction(() => new URL(location.href).searchParams.get('q') === 'architecture', { timeout: 5000 });
  await waitForResults(page);
  await check('search state is written to URL', async () => page.evaluate(() => new URL(location.href).searchParams.get('q') === 'architecture'));

  await page.select('.filter-row select', 'eng');
  await page.waitForFunction(() => new URL(location.href).searchParams.get('lang') === 'eng', { timeout: 5000 });
  await waitForResults(page);
  await check('language filter is written to URL', async () => page.evaluate(() => new URL(location.href).searchParams.get('lang') === 'eng'));

  const firstSave = await page.$('.book-card .card-foot button');
  if (!firstSave) throw new Error('Save button not found');
  await firstSave.click();
  await check('save persists to localStorage', async () => page.evaluate(() => JSON.parse(localStorage.getItem('index-saved-books') || '[]').length === 1));

  await page.click('a[href="/saved"]');
  await page.waitForFunction(() => location.pathname === '/saved', { timeout: 5000 });
  await check('saved page renders collection', async () => page.$$eval('.book-card', els => els.length === 1));
  await page.screenshot({ path: 'qa/screenshots/02-saved-desktop.png', fullPage: true });

  await page.click('a[href="/"]');
  await page.waitForFunction(() => location.pathname === '/', { timeout: 5000 });
  await waitForResults(page);
  await page.click('.book-title');
  await page.waitForFunction(() => location.pathname.startsWith('/book/'), { timeout: 5000 });
  await page.waitForSelector('.book-detail', { timeout: 10000 });
  await check('work detail loads from API contract', async () => (await page.$eval('.book-detail h1', el => el.textContent?.trim())) === 'The Architecture of Form');
  await check('author request is rendered', async () => (await page.$eval('.author-block strong', el => el.textContent?.trim())) === 'Ada North');
  await page.screenshot({ path: 'qa/screenshots/03-book-detail-desktop.png', fullPage: true });

  const mobile = await browser.newPage();
  await mockOpenLibrary(mobile);
  wire(mobile, 'mobile');
  await mobile.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
  await mobile.goto(base, { waitUntil: 'networkidle2', timeout: 20000 });
  await waitForResults(mobile);
  await check('mobile has no global overflow', async () => mobile.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1));
  await check('mobile renders results', async () => mobile.$$eval('.book-card:not(.skeleton-card)', els => els.length === 2));
  await mobile.screenshot({ path: 'qa/screenshots/04-discover-mobile.png', fullPage: true });
  await mobile.close();
} catch (error) {
  fatalError = error;
  report.fatalError = String(error);
} finally {
  await writeFile('qa/browser-report.json', JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  await browser.close();
}

const failures = [
  ...report.checks.filter(item => !item.pass),
  ...report.consoleErrors,
  ...report.pageErrors,
  ...report.requestFailures
];
if (fatalError || failures.length) process.exit(1);
