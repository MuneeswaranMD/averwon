import puppeteer from 'puppeteer';

(async () => {
    try {
        const browser = await puppeteer.launch({ headless: 'new' });
        const page = await browser.newPage();
        await page.goto('http://localhost:3000/admin', { waitUntil: 'networkidle0' });
        await page.screenshot({ path: 'admin-login.png' });
        
        await browser.close();
    } catch(e) {
        console.error(e);
    }
})();
