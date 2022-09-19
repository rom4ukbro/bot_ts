// const puppeteer = require('puppeteer');
// const cheerio = require('cheerio');
// const moment = require('moment');
// moment.locale('uk');
// const dotenv = require('dotenv');
// dotenv.config({ path: './.env' });

// const scheduleURL = 'https://education.ugi.edu.ua/cgi-bin/classman.cgi?n=2';

// async function progressParse(obj) {
//   var start = new Date(); // засекли время

//   let result = {},
//     name = '';

//   const browser = await puppeteer.launch({
//     // headless: false,
//     defaultViewport: null,
//     args: ['--start-maximized'],
//   });
//   const page = await browser.newPage();
//   try {
//     await page.goto(scheduleURL);
//     await page.waitForSelector(`#user_name`);
//     await page.type(`#user_name`, obj.login);
//     await page.type('#user_pwd', obj.password);
//     await page.click('button[type="submit"]');
//     await page.waitForTimeout(1000);
//     const url = await page.url();
//     const regex = /\?n=1/;
//     if (regex.test(url)) {
//       return { errorPass: true };
//     }
//     await page
//       .evaluate(
//         () =>
//           document.querySelector(
//             '#wrap > div > div.navbar.navbar-inverse.navbar-fixed-top > div > div.navbar-header > a.active.navbar-brand.hidden-xs',
//           ).innerHTML,
//       )
//       .then((response) => {
//         name = response;
//       });
//     await page.waitForSelector(
//       '#wrap > div > div.navbar.navbar-inverse.navbar-fixed-top > div > div.navbar-header > a.active.navbar-brand.visible-xs',
//     );
//     await page.click(
//       '#wrap > div > div.navbar.navbar-inverse.navbar-fixed-top > div > div.navbar-collapse.collapse > ul:nth-child(1) > li.dropdown > a',
//     );
//     await page.click(
//       '#wrap > div > div.navbar.navbar-inverse.navbar-fixed-top > div > div.navbar-collapse.collapse > ul:nth-child(1) > li.dropdown.open > ul > li:nth-child(2)',
//     );
//     await page.waitForSelector('#wrap > div > div.container > div > div > div:nth-child(1) > h2');
//     await page
//       .evaluate(() => document.querySelector('body').innerHTML)
//       .then((response) => {
//         result = getData(response, name);
//       });
//   } catch (err) {
//     console.log(err);
//     result.error = true;
//   } finally {
//     await browser.close();
//   }

//   var end = new Date(); // конец измерения

//   // console.log("Цикл занял " + (end - start) / 1000 + " s");

//   return result;
// }

// function getData(html, name) {
//   const $ = cheerio.load(html);
//   let lesson, numLess;
//   let data = [],
//     debts = [];
//   $('table').each(async (i, elem) => {
//     let trArr = $(elem).find('tr');
//     var z = 0;
//     for (var ii = 0; ii < trArr.length; ii++) {
//       try {
//         nameLess = trArr[ii].childNodes[0].childNodes[0].data;
//         points = parseInt(trArr[ii].childNodes[2].childNodes[0].childNodes[0]?.data);

//         if (points) {
//           if (points == 1 || points == 2) {
//             debts.push({
//               nameLess,
//               points: 2,
//             });
//           } else {
//             data.push({
//               nameLess,
//               points,
//             });
//           }
//         }
//       } catch (err) {}
//     }
//     data.sort((a, b) => (a.points < b.points ? 1 : -1));
//     avarageData = [...data, ...debts];
//     avarage =
//       Math.round((avarageData.reduce((a, b) => a + b.points, 0) / avarageData.length) * 10) / 10;
//   });
//   return { data, debts, avarage, name };
// }

// function toMessage(arr) {
//   let message = '';
//   for (let let i = 0; i < arr.length; i++) {
//     const el = arr[i];
//     message += el.nameLess + ' - ' + el.points + '\n';
//   }

//   return message;
// }

// module.exports = { progressParse, toMessage };
