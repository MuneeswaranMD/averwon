const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => {
    console.log(`[Browser Console] ${msg.type().toUpperCase()}: ${msg.text()}`);
  });

  page.on('pageerror', err => {
    console.log(`[Browser Error]: ${err.toString()}`);
  });

  try {
    await page.goto('http://localhost:3000/admin', { waitUntil: 'networkidle2' });
  } catch (err) {
    console.error('Goto error:', err);
  }

  await browser.close();
})();
