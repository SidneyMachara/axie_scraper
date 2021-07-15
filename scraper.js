
// 1) install -->  npm i puppeteer
// 2) include this line at the top of you file  --> const puppeteer = require('puppeteer');
// 3) copy the fetchPlayerStats function
const puppeteer = require('puppeteer');


(async () => {

   /// This is all you need
   const fetchPlayerStats = async (roninAddress) => {
    let url = 'https://axie.zone/profile?ron_addr=0x'+roninAddress;

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
 
    const html = await page.evaluate(() => document.querySelector('*').outerHTML);
   
    await browser.close();

    return html;
   }

   let ron_addr = '8bcde990ad56d7a26fd6199821ad9e9ebb47e86f';
   const res = await fetchPlayerStats(ron_addr);

   console.log(res);
  
})();

