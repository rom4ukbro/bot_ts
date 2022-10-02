"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toWeekMessage = exports.toMessage = exports.parse = void 0;
const puppeteer_1 = __importDefault(require("puppeteer"));
const getData_1 = require("./getData");
const moment_1 = __importDefault(require("moment"));
require("moment-timezone");
moment_1.default.locale("uk");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: "./.env" });
const text_js_1 = require("../bot/text.js");
const scheduleURL = process.env.SCHEDULE_URL ||
    "https://education.ugi.edu.ua/cgi-bin/timetable.cgi?";
async function parse(obj) {
    const start = new Date();
    obj.weekShift *= 7;
    const day = moment_1.default
        .tz("Europe/Zaporozhye")
        .add(obj.weekShift, "days")
        .format("dddd");
    let sDate = "", eDate = "";
    switch (day) {
        case "понеділок": {
            sDate = moment_1.default
                .tz("Europe/Zaporozhye")
                .add(obj.weekShift, "days")
                .format("L");
            eDate = moment_1.default
                .tz("Europe/Zaporozhye")
                .add(obj.weekShift + 6, "days")
                .format("L");
            break;
        }
        case "вівторок": {
            sDate = moment_1.default
                .tz("Europe/Zaporozhye")
                .add(obj.weekShift - 1, "days")
                .format("L");
            eDate = moment_1.default
                .tz("Europe/Zaporozhye")
                .add(obj.weekShift + 5, "days")
                .format("L");
            break;
        }
        case "середа": {
            sDate = moment_1.default
                .tz("Europe/Zaporozhye")
                .add(obj.weekShift - 2, "days")
                .format("L");
            eDate = moment_1.default
                .tz("Europe/Zaporozhye")
                .add(obj.weekShift + 4, "days")
                .format("L");
            break;
        }
        case "четвер": {
            sDate = moment_1.default
                .tz("Europe/Zaporozhye")
                .add(obj.weekShift - 3, "days")
                .format("L");
            eDate = moment_1.default
                .tz("Europe/Zaporozhye")
                .add(obj.weekShift + 3, "days")
                .format("L");
            break;
        }
        case "п’ятниця": {
            sDate = moment_1.default
                .tz("Europe/Zaporozhye")
                .add(obj.weekShift - 4, "days")
                .format("L");
            eDate = moment_1.default
                .tz("Europe/Zaporozhye")
                .add(obj.weekShift + 2, "days")
                .format("L");
            break;
        }
        case "субота": {
            sDate = moment_1.default
                .tz("Europe/Zaporozhye")
                .add(obj.weekShift - 5, "days")
                .format("L");
            eDate = moment_1.default
                .tz("Europe/Zaporozhye")
                .add(obj.weekShift + 1, "days")
                .format("L");
            break;
        }
        case "неділя": {
            sDate = moment_1.default
                .tz("Europe/Zaporozhye")
                .add(obj.weekShift - 6, "days")
                .format("L");
            eDate = moment_1.default
                .tz("Europe/Zaporozhye")
                .add(obj.weekShift, "days")
                .format("L");
            break;
        }
    }
    let result = {};
    try {
        var browser = await puppeteer_1.default.launch({
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
            .evaluate(() => { var _a; return (_a = document.querySelector("body")) === null || _a === void 0 ? void 0 : _a.innerHTML; })
            .then((response) => {
            result = (0, getData_1.getData)(String(response));
            result.sDate = sDate;
            result.eDate = eDate;
        });
    }
    catch (err) {
        console.log(err);
        result.error = true;
    }
    finally {
        const pages = await browser.pages();
        await Promise.all(pages.map((page) => page.close()));
        await browser.close();
    }
    const end = new Date();
    console.log("Цикл зайняв: " + (end - start) / 1000 + " s");
    return result;
}
exports.parse = parse;
function toMessage(obj, day, value) {
    const obj1 = obj[day];
    let message;
    if (obj1 === undefined) {
        let date;
        switch (day) {
            case "Понеділок": {
                date = (0, moment_1.default)(obj.sDate, "DD.MM.YYYY").add(0, "days").format("L");
                break;
            }
            case "Вівторок": {
                date = (0, moment_1.default)(obj.sDate, "DD.MM.YYYY").add(1, "days").format("L");
                break;
            }
            case "Середа": {
                date = (0, moment_1.default)(obj.sDate, "DD.MM.YYYY").add(2, "days").format("L");
                break;
            }
            case "Четвер": {
                date = (0, moment_1.default)(obj.sDate, "DD.MM.YYYY").add(3, "days").format("L");
                break;
            }
            case "П'ятниця": {
                date = (0, moment_1.default)(obj.sDate, "DD.MM.YYYY").add(4, "days").format("L");
                break;
            }
            case "Субота": {
                date = (0, moment_1.default)(obj.sDate, "DD.MM.YYYY").add(5, "days").format("L");
                break;
            }
            case "Неділя": {
                date = (0, moment_1.default)(obj.sDate, "DD.MM.YYYY").add(6, "days").format("L");
                break;
            }
        }
        return (message = `*${value}\n${day} ${date}*\n\n${text_js_1.noLessonsText}`);
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
exports.toMessage = toMessage;
function toWeekMessage(obj, value) {
    let message;
    if (obj.vx) {
        return (message = `*${value}\nТиждень ${obj.sDate} - ${obj.eDate}*\n\n${text_js_1.noLessonsWeekText}`);
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
exports.toWeekMessage = toWeekMessage;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NoZWR1bGVQYXJzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9wYXJzZXIvc2NoZWR1bGVQYXJzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFFQSwwREFBa0M7QUFFbEMsdUNBQW9DO0FBQ3BDLG9EQUE0QjtBQUM1QiwyQkFBeUI7QUFDekIsZ0JBQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDcEIsb0RBQTRCO0FBQzVCLGdCQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUM7QUFFbEMsNENBQWtFO0FBc0JsRSxNQUFNLFdBQVcsR0FDZixPQUFPLENBQUMsR0FBRyxDQUFDLFlBQVk7SUFDeEIscURBQXFELENBQUM7QUFFeEQsS0FBSyxVQUFVLEtBQUssQ0FBQyxHQUFRO0lBQzNCLE1BQU0sS0FBSyxHQUFRLElBQUksSUFBSSxFQUFFLENBQUM7SUFDOUIsR0FBRyxDQUFDLFNBQVMsSUFBSSxDQUFDLENBQUM7SUFFbkIsTUFBTSxHQUFHLEdBQUcsZ0JBQU07U0FDZixFQUFFLENBQUMsbUJBQW1CLENBQUM7U0FDdkIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDO1NBQzFCLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNsQixJQUFJLEtBQUssR0FBRyxFQUFFLEVBQ1osS0FBSyxHQUFHLEVBQUUsQ0FBQztJQUViLFFBQVEsR0FBRyxFQUFFO1FBQ1gsS0FBSyxXQUFXLENBQUMsQ0FBQztZQUNoQixLQUFLLEdBQUcsZ0JBQU07aUJBQ1gsRUFBRSxDQUFDLG1CQUFtQixDQUFDO2lCQUN2QixHQUFHLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUM7aUJBQzFCLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNmLEtBQUssR0FBRyxnQkFBTTtpQkFDWCxFQUFFLENBQUMsbUJBQW1CLENBQUM7aUJBQ3ZCLEdB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