import { chromium } from '@playwright/test';
import path from 'path';

const DEMO_DIR = path.join(process.cwd(), 'docs/demo');

const pages = [
  { url: '/', name: 'onboarding' },
  { url: '/dashboard', name: 'dashboard' },
  { url: '/demo', name: 'demo-index' },
  { url: '/demo/light', name: 'demo-light' },
  { url: '/demo/dark', name: 'demo-dark' },
  { url: '/demo/character', name: 'demo-character' },
];

async function takeScreenshots() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();

  for (const { url, name } of pages) {
    try {
      console.log(`Capturing ${url}...`);
      const response = await page.goto(`http://localhost:3000${url}`, {
        waitUntil: 'load',
        timeout: 30000
      });

      if (!response || response.status() >= 400) {
        console.log(`  Skipped ${url} (status: ${response?.status()})`);
        continue;
      }

      // Wait for content to render
      await page.waitForTimeout(2000);

      await page.screenshot({
        path: path.join(DEMO_DIR, `${name}.png`),
        fullPage: false
      });
      console.log(`  Saved: ${name}.png`);
    } catch (err: any) {
      console.log(`  Error on ${url}: ${err.message}`);
    }
  }

  await browser.close();
  console.log('Done!');
}

takeScreenshots();
