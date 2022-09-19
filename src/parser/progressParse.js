const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const moment = require('moment');
moment.locale('uk');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

const scheduleURL = 'https://education.ugi.edu.ua/cgi-bin/classman.cgi?n=2';

async function progressParse(obj) {
  var start = new Date(); // засекли время

  let result = {},
    name = '';

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized'],
  });
  const page = (await browser.pages())[0];
  try {
    // перехід на сайт
    await page.goto(scheduleURL);
    await page.waitForSelector(
      `#wrap > div > div > form > div:nth-child(10) > div.col-md-9.col-xs-12 > a`,
    );
    await page.click('#wrap > div > div > form > div:nth-child(10) > div.col-md-9.col-xs-12 > a');

    // написання логіну в гугл
    await page.waitForSelector('#identifierId');
    await page.type(`#identifierId`, obj.login);
    await page.click('#identifierNext > div > button');

    //  перевірка на правильність логіну
    try {
      await page.waitForSelector(
        '#view_container > div > div > div.pwWryf.bxPAYd > div > div.WEQkZc > div > form > span > section > div > div > div.d2CFce.cDSmF.cxMOTc > div > div.LXRPh > div.dEOOab.RxsGPe > div',
        { timeout: 1000 },
      );
    } catch (e) { }
    try {
      if (
        await page.$(
          '#view_container > div > div > div.pwWryf.bxPAYd > div > div.WEQkZc > div > form > span > section > div > div > div.d2CFce.cDSmF.cxMOTc > div > div.LXRPh > div.dEOOab.RxsGPe > div',
        )
      ) {
        return { errorLogin: true };
      }
    } catch (e) { }

    // написання логіну в майкрософт
    await page.waitForSelector('#i0116');
    await page.type(`#i0116`, obj.login);
    await page.click('#idSIButton9');

    // написання паролю
    await page.waitForSelector('#i0118');
    await page.type('#i0118', obj.password);

    await page.waitForSelector(
      '#lightbox > div:nth-child(3) > div > div.pagination-view.animate.has-identity-banner.slide-in-next > div > div.position-buttons > div.win-button-pin-bottom > div > div > div > div',
    );
    await page.click('#idSIButton9');

    //  перевірка на правильність паролю
    try {
      await page.waitForSelector('#passwordError', { timeout: 1000 });
    } catch (e) { }

    if (await page.$('#passwordError')) {
      return { errorPass: true };
    }

    await page.waitForSelector('#idBtn_Back', { timeout: 7000 });
    await page.click('#idBtn_Back');

    // перехід до оцінок
    await page.waitForSelector(
      '#wrap > div > div.navbar.navbar-inverse.navbar-fixed-top > div > div.navbar-header > a.active.navbar-brand.visible-xs',
      { timeout: 1000000 },
    );
    await page.click(
      '#wrap > div > div.navbar.navbar-inverse.navbar-fixed-top > div > div.navbar-collapse.collapse > ul:nth-child(1) > li.dropdown > a',
    );
    await page.click(
      '#wrap > div > div.navbar.navbar-inverse.navbar-fixed-top > div > div.navbar-collapse.collapse > ul:nth-child(1) > li.dropdown.open > ul > li:nth-child(2)',
    );
    await page.waitForSelector('#wrap > div > div.container > div > div > div:nth-child(1) > h2');
    await page
      .evaluate(() => document.querySelector('body').innerHTML)
      .then((response) => {
        result = getData(response, name);
      });
  } catch (err) {
    console.log(err);
    result.error = true;
  } finally {
    await browser.close();
  }

  var end = new Date(); // конец измерения

  // console.log("Цикл занял " + (end - start) / 1000 + " s");

  return result;
}

function getData(html) {
  const $ = cheerio.load(html);
  const name = $(
    '#wrap > div > div.navbar.navbar-inverse.navbar-fixed-top > div > div.navbar-header > a.active.navbar-brand.hidden-xs',
  ).text();

  let data = [],
    debts = [];
  $('table').each(async (i, elem) => {
    let trArr = $(elem).find('tr');
    var z = 0;
    for (var ii = 0; ii < trArr.length; ii++) {
      try {
        nameLess = trArr[ii].childNodes[0].childNodes[0].data;
        points = parseInt(trArr[ii].childNodes[2].childNodes[0].childNodes[0]?.data);

        if (points) {
          if (points == 1 || points == 2) {
            debts.push({
              nameLess,
              points: 2,
            });
          } else {
            data.push({
              nameLess,
              points,
            });
          }
        }
      } catch (err) { }
    }
    data.sort((a, b) => (a.points < b.points ? 1 : -1));
    avarageData = [...data, ...debts];
    avarage =
      Math.round((avarageData.reduce((a, b) => a + b.points, 0) / avarageData.length) * 10) / 10;
  });
  return { data, debts, avarage, name };
}

function toMessage(arr) {
  let message = '';
  for (let i = 0; i < arr.length; i++) {
    const el = arr[i];
    message += el.nameLess + ' - ' + el.points + '\n';
  }

  return message;
}

module.exports = { progressParse, toMessage };
