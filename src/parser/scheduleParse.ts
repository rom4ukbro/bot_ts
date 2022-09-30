/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-var */
import puppeteer from "puppeteer";
// const Nightmare = require('nightmare');
import { getData } from "./getData";
import moment from "moment";
import "moment-timezone";
moment.locale("uk");
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import { noLessonsText, noLessonsWeekText } from "../bot/text.js";

type schedule =
  | {
      date?: string;
      day?: string;
      items?: {
        number: string;
        timeBounds: string;
        info: string;
      }[];
      sDate?: string;
      eDate?: string;
      error?: boolean;
    }
  | {
      vx: string;
      sDate?: string;
      eDate?: string;
      error?: boolean;
    };

const scheduleURL =
  process.env.SCHEDULE_URL ||
  "https://education.ugi.edu.ua/cgi-bin/timetable.cgi?";

async function parse(obj: any) {
  const start: any = new Date(); // засекли время
  obj.weekShift *= 7;

  const day = moment
    .tz("Europe/Zaporozhye")
    .add(obj.weekShift, "days")
    .format("dddd");
  let sDate = "",
    eDate = "";

  switch (day) {
    case "понеділок": {
      sDate = moment
        .tz("Europe/Zaporozhye")
        .add(obj.weekShift, "days")
        .format("L");
      eDate = moment
        .tz("Europe/Zaporozhye")
        .add(obj.weekShift + 6, "days")
        .format("L");
      break;
    }
    case "вівторок": {
      sDate = moment
        .tz("Europe/Zaporozhye")
        .add(obj.weekShift - 1, "days")
        .format("L");
      eDate = moment
        .tz("Europe/Zaporozhye")
        .add(obj.weekShift + 5, "days")
        .format("L");
      break;
    }
    case "середа": {
      sDate = moment
        .tz("Europe/Zaporozhye")
        .add(obj.weekShift - 2, "days")
        .format("L");
      eDate = moment
        .tz("Europe/Zaporozhye")
        .add(obj.weekShift + 4, "days")
        .format("L");
      break;
    }
    case "четвер": {
      sDate = moment
        .tz("Europe/Zaporozhye")
        .add(obj.weekShift - 3, "days")
        .format("L");
      eDate = moment
        .tz("Europe/Zaporozhye")
        .add(obj.weekShift + 3, "days")
        .format("L");
      break;
    }
    case "п’ятниця": {
      sDate = moment
        .tz("Europe/Zaporozhye")
        .add(obj.weekShift - 4, "days")
        .format("L");
      eDate = moment
        .tz("Europe/Zaporozhye")
        .add(obj.weekShift + 2, "days")
        .format("L");
      break;
    }
    case "субота": {
      sDate = moment
        .tz("Europe/Zaporozhye")
        .add(obj.weekShift - 5, "days")
        .format("L");
      eDate = moment
        .tz("Europe/Zaporozhye")
        .add(obj.weekShift + 1, "days")
        .format("L");
      break;
    }
    case "неділя": {
      sDate = moment
        .tz("Europe/Zaporozhye")
        .add(obj.weekShift - 6, "days")
        .format("L");
      eDate = moment
        .tz("Europe/Zaporozhye")
        .add(obj.weekShift, "days")
        .format("L");
      break;
    }
  }
  let result: schedule | any = {};
  try {
    var browser = await puppeteer.launch({
      // headless: false,
      defaultViewport: null,
      args: [
        "--start-maximized",
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--single-process",
      ],
    });
    const page = await browser.newPage();
    await page.goto(scheduleURL);
    await page.waitForSelector(`#${obj.mode}`);
    await page.type('input[name="sdate"]', sDate);
    await page.type('input[name="edate"]', eDate);
    await page.type(`#${obj.mode}`, obj.value);
    await page.keyboard.press(`Enter`);
    await page.waitForSelector("h4.visible-xs.text-center");
    await page
      .evaluate(() => document.querySelector("body")?.innerHTML)
      .then((response) => {
        result = getData(String(response));
        result.sDate = sDate;
        result.eDate = eDate;
      });
  } catch (err) {
    console.log(err);
    result.error = true;
  } finally {
    // @ts-ignore
    const pages = await browser.pages();
    await Promise.all(pages.map((page) => page.close()));
    // @ts-ignore
    await browser.close();
  }

  const end: any = new Date(); // конец измерения

  console.log("Цикл занял " + (end - start) / 1000 + " s");

  return result;
}

function toMessage(obj: any, day: string, value: string) {
  const obj1 = obj[day];
  let message;
  if (obj1 === undefined) {
    let date;
    switch (day) {
      case "Понеділок": {
        date = moment(obj.sDate, "DD.MM.YYYY").add(0, "days").format("L");
        break;
      }
      case "Вівторок": {
        date = moment(obj.sDate, "DD.MM.YYYY").add(1, "days").format("L");
        break;
      }
      case "Середа": {
        date = moment(obj.sDate, "DD.MM.YYYY").add(2, "days").format("L");
        break;
      }
      case "Четвер": {
        date = moment(obj.sDate, "DD.MM.YYYY").add(3, "days").format("L");
        break;
      }
      case "П'ятниця": {
        date = moment(obj.sDate, "DD.MM.YYYY").add(4, "days").format("L");
        break;
      }
      case "Субота": {
        date = moment(obj.sDate, "DD.MM.YYYY").add(5, "days").format("L");
        break;
      }
      case "Неділя": {
        date = moment(obj.sDate, "DD.MM.YYYY").add(6, "days").format("L");
        break;
      }
    }
    return (message = `*${value}\n${day} ${date}*\n\n${noLessonsText}`);
  }
  message = `*${value}\n${obj1.day} ${obj1.date}*\n\n`;
  for (let i = 0; i < obj1.items.length; i++) {
    const el = obj1.items[i];
    el.info = el.info.replace(/`/g, "'");
    el.info = el.info.replace(/\n\  /g, "\n");
    message += `_${el.number}) ${el.timeBounds}_\n${el.info}\n\n`;
  }
  return message;
}

function toWeekMessage(obj: any, value: string) {
  let message;
  if (obj.vx) {
    return (message = `*${value}\nТиждень ${obj.sDate} - ${obj.eDate}*\n\n${noLessonsWeekText}`);
  }
  message = `*${value}\nТиждень ${obj.sDate} - ${obj.eDate}*\n\n`;
  for (const key in obj) {
    if (key != "vx" && key != "sDate" && key != "eDate") {
      const el = obj[key];
      message += `*${el.day} ${el.date}*\n`;
      for (let i = 0; i < el.items.length; i++) {
        const el2 = el.items[i];
        el2.info = el2.info.replace(/`/g, "'");
        el2.info = el2.info.replace(/\n\  /g, "\n");
        message += `_${el2.number}) ${el2.timeBounds}_\n${el2.info}\n\n`;
      }
      message += "\n";
    }
  }
  return message;
}

export { parse, toMessage, toWeekMessage };
