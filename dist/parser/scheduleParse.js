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
moment_1.default.locale('uk');
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: './.env' });
const text_js_1 = require("../bot/text.js");
const scheduleURL = process.env.SCHEDULE_URL || 'https://education.ugi.edu.ua/cgi-bin/timetable.cgi?';
async function parse(obj) {
    var start = new Date();
    obj.weekShift *= 7;
    const day = moment_1.default.tz("Europe/Zaporozhye").add(obj.weekShift, 'days').format('dddd');
    let sDate = "", eDate = "";
    switch (day) {
        case 'понеділок': {
            sDate = moment_1.default.tz("Europe/Zaporozhye").add(obj.weekShift, 'days').format('L');
            eDate = moment_1.default.tz("Europe/Zaporozhye")
                .add(obj.weekShift + 6, 'days')
                .format('L');
            break;
        }
        case 'вівторок': {
            sDate = moment_1.default.tz("Europe/Zaporozhye")
                .add(obj.weekShift - 1, 'days')
                .format('L');
            eDate = moment_1.default.tz("Europe/Zaporozhye")
                .add(obj.weekShift + 5, 'days')
                .format('L');
            break;
        }
        case 'середа': {
            sDate = moment_1.default.tz("Europe/Zaporozhye")
                .add(obj.weekShift - 2, 'days')
                .format('L');
            eDate = moment_1.default.tz("Europe/Zaporozhye")
                .add(obj.weekShift + 4, 'days')
                .format('L');
            break;
        }
        case 'четвер': {
            sDate = moment_1.default.tz("Europe/Zaporozhye")
                .add(obj.weekShift - 3, 'days')
                .format('L');
            eDate = moment_1.default.tz("Europe/Zaporozhye")
                .add(obj.weekShift + 3, 'days')
                .format('L');
            break;
        }
        case 'п’ятниця': {
            sDate = moment_1.default.tz("Europe/Zaporozhye")
                .add(obj.weekShift - 4, 'days')
                .format('L');
            eDate = moment_1.default.tz("Europe/Zaporozhye")
                .add(obj.weekShift + 2, 'days')
                .format('L');
            break;
        }
        case 'субота': {
            sDate = moment_1.default.tz("Europe/Zaporozhye")
                .add(obj.weekShift - 5, 'days')
                .format('L');
            eDate = moment_1.default.tz("Europe/Zaporozhye")
                .add(obj.weekShift + 1, 'days')
                .format('L');
            break;
        }
        case 'неділя': {
            sDate = moment_1.default.tz("Europe/Zaporozhye")
                .add(obj.weekShift - 6, 'days')
                .format('L');
            eDate = moment_1.default.tz("Europe/Zaporozhye").add(obj.weekShift, 'days').format('L');
            break;
        }
    }
    let result = {};
    try {
        var browser = await puppeteer_1.default.launch({
            defaultViewport: null,
            args: ['--start-maximized', '--no-sandbox', '--disable-setuid-sandbox', '--single-process'],
        });
        const page = await browser.newPage();
        await page.goto(scheduleURL);
        await page.waitForSelector(`#${obj.mode}`);
        await page.type('input[name="sdate"]', sDate);
        await page.type('input[name="edate"]', eDate);
        await page.type(`#${obj.mode}`, obj.value);
        await page.keyboard.press(`Enter`);
        await page.waitForSelector('h4.visible-xs.text-center');
        await page
            .evaluate(() => { var _a; return (_a = document.querySelector('body')) === null || _a === void 0 ? void 0 : _a.innerHTML; })
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
    var end = new Date();
    return result;
}
exports.parse = parse;
function toMessage(obj, day, value, space) {
    let obj1 = obj[day];
    var message;
    if (obj1 === undefined) {
        let date;
        switch (day) {
            case 'Понеділок': {
                date = (0, moment_1.default)(obj.sDate, 'DD.MM.YYYY').add(0, 'days').format('L');
                break;
            }
            case 'Вівторок': {
                date = (0, moment_1.default)(obj.sDate, 'DD.MM.YYYY').add(1, 'days').format('L');
                break;
            }
            case 'Середа': {
                date = (0, moment_1.default)(obj.sDate, 'DD.MM.YYYY').add(2, 'days').format('L');
                break;
            }
            case 'Четвер': {
                date = (0, moment_1.default)(obj.sDate, 'DD.MM.YYYY').add(3, 'days').format('L');
                break;
            }
            case "П'ятниця": {
                date = (0, moment_1.default)(obj.sDate, 'DD.MM.YYYY').add(4, 'days').format('L');
                break;
            }
            case 'Субота': {
                date = (0, moment_1.default)(obj.sDate, 'DD.MM.YYYY').add(5, 'days').format('L');
                break;
            }
            case 'Неділя': {
                date = (0, moment_1.default)(obj.sDate, 'DD.MM.YYYY').add(6, 'days').format('L');
                break;
            }
        }
        return (message = `*${value}\n${day} ${date}*\n\n${text_js_1.noLessonsText}`);
    }
    message = `*${value}\n${obj1.day} ${obj1.date}*\n\n`;
    for (let i = 0; i < obj1.items.length; i++) {
        const el = obj1.items[i];
        el.info = el.info.replace(/`/g, "'");
        el.info = el.info.replace(/\n\  /g, '\n');
        space != undefined
            ? (message += `_${el.number}) ${el.timeBounds}_\n${el.info}\n${space}\n`)
            : (message += `_${el.number}) ${el.timeBounds}_\n${el.info}\n\n`);
    }
    space == ' ' ? (message += space) : 0;
    return message;
}
exports.toMessage = toMessage;
function toWeekMessage(obj, day, value) {
    var message;
    if (obj.vx) {
        return (message = `*${value}\nТиждень ${obj.sDate} - ${obj.eDate}*\n\n${text_js_1.noLessonsWeekText}`);
    }
    message = `*${value}\nТиждень ${obj.sDate} - ${obj.eDate}*\n\n`;
    for (let key in obj) {
        if (key != 'vx' && key != 'sDate' && key != 'eDate') {
            const el = obj[key];
            message += `*${el.day} ${el.date}*\n`;
            for (let i = 0; i < el.items.length; i++) {
                const el2 = el.items[i];
                el2.info = el2.info.replace(/`/g, "'");
                el2.info = el2.info.replace(/\n\  /g, '\n');
                message += `_${el2.number}) ${el2.timeBounds}_\n${el2.info}\n\n`;
            }
            message += '\n';
        }
    }
    return message;
}
exports.toWeekMessage = toWeekMessage;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NoZWR1bGVQYXJzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9wYXJzZXIvc2NoZWR1bGVQYXJzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSwwREFBa0M7QUFFbEMsdUNBQW9DO0FBQ3BDLG9EQUE0QjtBQUM1QiwyQkFBeUI7QUFDekIsZ0JBQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDcEIsb0RBQTRCO0FBQzVCLGdCQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUM7QUFFbEMsNENBQWtFO0FBb0JsRSxNQUFNLFdBQVcsR0FDZixPQUFPLENBQUMsR0FBRyxDQUFDLFlBQVksSUFBSSxxREFBcUQsQ0FBQztBQUVwRixLQUFLLFVBQVUsS0FBSyxDQUFDLEdBQVE7SUFDM0IsSUFBSSxLQUFLLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQztJQUN2QixHQUFHLENBQUMsU0FBUyxJQUFJLENBQUMsQ0FBQztJQUVuQixNQUFNLEdBQUcsR0FBRyxnQkFBTSxDQUFDLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNyRixJQUFJLEtBQUssR0FBVyxFQUFFLEVBQUUsS0FBSyxHQUFXLEVBQUUsQ0FBQztJQUUzQyxRQUFRLEdBQUcsRUFBRTtRQUNYLEtBQUssV0FBVyxDQUFDLENBQUM7WUFDaEIsS0FBSyxHQUFHLGdCQUFNLENBQUMsRUFBRSxDQUFDLG1CQUFtQixDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzlFLEtBQUssR0FBRyxnQkFBTSxDQUFDLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQztpQkFDbkMsR0FBRyxDQUFD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WSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ2xFLE1BQU07YUFDUDtZQUNELEtBQUssVUFBVSxDQUFDLENBQUM7Z0JBQ2YsSUFBSSxHQUFHLElBQUEsZ0JBQU0sRUFBQyxHQUFHLENBQUMsS0FBSyxFQUFFLFlBQVksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNsRSxNQUFNO2FBQ1A7WUFDRCxLQUFLLFFBQVEsQ0FBQyxDQUFDO2dCQUNiLElBQUksR0FBRyxJQUFBLGdCQUFNLEVBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxZQUFZLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDbEUsTUFBTTthQUNQO1lBQ0QsS0FBSyxRQUFRLENBQUMsQ0FBQztnQkFDYixJQUFJLEdBQUcsSUFBQSxnQkFBTSxFQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsWUFBWSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ2xFLE1BQU07YUFDUDtZQUNELEtBQUssVUFBVSxDQUFDLENBQUM7Z0JBQ2YsSUFBSSxHQUFHLElBQUEsZ0JBQU0sRUFBQyxHQUFHLENBQUMsS0FBSyxFQUFFLFlBQVksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNsRSxNQUFNO2FBQ1A7WUFDRCxLQUFLLFFBQVEsQ0FBQyxDQUFDO2dCQUNiLElBQUksR0FBRyxJQUFBLGdCQUFNLEVBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxZQUFZLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FB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