const http = require('http');
// const puppeteer = require('puppeteer');

// var data;

// (async () => {
//   const obj = {
//     mode: 'group',
//     value: 'А-35',
//     sDate: '01.09.2021',
//     eDate: '01.12.2021',
//   };

//   var responseP, responseN;

//   res = [];

//   for (let index = 0; index < 0; index++) {
//     const startP = Date.now();

//     const browser = await puppeteer.launch({
//       headless: false,
//       defaultViewport: null,
//       args: ['--start-maximized', '--no-sandbox', '--disable-setuid-sandbox'],
//     });
//     const page = await browser.newPage();
//     await page.goto('http://asu.pnu.edu.ua/cgi-bin/timetable.cgi?', { waitUntil: 'load' });

//     await page.waitForSelector(`#${obj.mode}`);
//     await page.type('input[name="sdate"]', obj.sDate);
//     await page.type('input[name="edate"]', obj.eDate);
//     await page.type(`#${obj.mode}`, obj.value);
//     await page.keyboard.press(`Enter`);
//     await page.waitForSelector('h4.visible-xs.text-center');
//     await page
//       .evaluate(() => document.querySelector('body').innerHTML)
//       .then((response) => {
//         responseP = response;
//       });
//     const pages = await browser.pages();
//     await Promise.all(pages.map((page) => page.close()));
//     await browser.close();

//     const endP = Date.now();

//     const startN = Date.now();

//     const Nightmare = require('nightmare');
//     const nightmare = Nightmare({ show: true });

//     await nightmare
//       .goto('http://asu.pnu.edu.ua/cgi-bin/timetable.cgi?')
//       .click(`#${obj.mode}`)
//       .insert('input[name="sdate"]', obj.sDate)
//       .insert('input[name="edate"]', obj.eDate)
//       .insert(`#${obj.mode}`, obj.value)
//       .click(
//         '#wrap > div > div > div > div.page-header > form > div:nth-child(3) > div.col-md-6.col-xs-12 > button',
//       )
//       .wait('h4.visible-xs.text-center')
//       .evaluate(() => document.querySelector('body').innerHTML)
//       .end()
//       .then((response) => (responseN = response))
//       .catch((error) => {
//         console.error('Search failed:', error);
//       });

//     const endN = Date.now();
//     res.push(startP - endP - (startN - endN));
//   }
//   let e = 0;
//   for (let i = 0; i < res.length; i++) {
//     e += res[i];
//   }
//   e = e / res.length;
//   console.log(res);
//   console.log(e);
// })();

// http
//   .createServer(function (request, response) {
//     response.setHeader('UserId', 1);
//     response.setHeader('Content-Type', 'text/html; charset=utf-8;');
//     response.write(`${data}`);
//     response.end();
//   })
//   .listen(process.env.PORT || 5000);

module.exports = { http };
