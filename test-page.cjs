const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.type(), msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));

  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });
  
  // Click all the bottom nav tabs by getting all buttons in standard nav
  const tabs = await page.$$('nav button');
  for (let i = 0; i < tabs.length; i++) {
     try {
       await tabs[i].click();
       await new Promise(r => setTimeout(r, 600));
     } catch(e) {}
  }
  
  await browser.close();
})();
