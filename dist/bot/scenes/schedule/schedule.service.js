"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
const node_emoji_1 = __importDefault(require("node-emoji"));
const text_1 = require("../../text");
const scheduleParse_js_1 = require("../../../parser/scheduleParse.js");
const redis_js_1 = require("../../../db/redis.js");
const schedule_keyboard_1 = require("./schedule.keyboard");
const telegraf_1 = require("telegraf");
const choose_keyboard_1 = require("../choose/choose.keyboard");
const ttl = Number(process.env.TIME_TO_LIVE) || 3600 * 2;
const checkBtn = node_emoji_1.default.get(":pushpin:");
class ScheduleService {
    async enter(ctx) {
        var _a, _b, _c, _d;
        try {
            if (!!ctx.session.default_mode) {
                ctx.session.value = String(ctx.session.default_value);
                ctx.session.mode = String(ctx.session.default_role);
                ctx.session.space = " ";
            }
            delete ctx.session.default_mode;
            if (!ctx.session.day) {
                if ((0, moment_1.default)().format("LT") > "18:00") {
                    const day = (0, moment_1.default)().add(1, "day").format("dd");
                    ctx.session.day = day.charAt(0).toUpperCase() + day.charAt(1);
                    if (ctx.session.day == "Пн")
                        ctx.session.weekShift += 1;
                }
                else {
                    const day = (0, moment_1.default)().format("dd");
                    ctx.session.day = day.charAt(0).toUpperCase() + day.charAt(1);
                }
            }
            if (!(await (0, redis_js_1.redisGetData)(ctx.session.value + "_" + ctx.session.weekShift))) {
                ctx.telegram
                    .editMessageText((_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id, ctx.session.oneMessageId, "", text_1.loadSchedule)
                    .catch((e) => {
                    console.log(e);
                });
                console.log({
                    mode: ctx.session.mode,
                    value: ctx.session.value,
                    weekShift: ctx.session.weekShift,
                });
                await (0, redis_js_1.redisWriteData)(ctx.session.value + "_" + ctx.session.weekShift, await (0, scheduleParse_js_1.parse)({
                    mode: ctx.session.mode,
                    value: ctx.session.value,
                    weekShift: ctx.session.weekShift,
                }), ttl);
            }
            if (((_b = (await (0, redis_js_1.redisGetData)(ctx.session.value + "_" + ctx.session.weekShift))) === null || _b === void 0 ? void 0 : _b.error) == true) {
                await (0, redis_js_1.redisDelData)(ctx.session.value + "_" + ctx.session.weekShift);
                return ctx.telegram.editMessageText((_c = ctx.from) === null || _c === void 0 ? void 0 : _c.id, ctx.session.oneMessageId, "", text_1.errorLoadText, telegraf_1.Markup.inlineKeyboard([
                    [{ text: "Спробувати ще раз", callback_data: "again" }],
                ]));
            }
            if (!ctx.session.weekMode) {
                ctx.session.scheduleKeyboard = JSON.parse(JSON.stringify(schedule_keyboard_1.scheduleKeyboard));
                ctx.session.weekDaysBtn = [...text_1.weekDaysBtn];
                ctx.session.weekDaysBtn[ctx.session.weekDaysBtn.findIndex((el) => el.text == ctx.session.day)] = {
                    text: checkBtn,
                    callback_data: checkBtn,
                };
                ctx.session.scheduleKeyboard[0] = ctx.session.weekDaysBtn;
                ctx.session.fulDay = text_1.fullDays[ctx.session.day];
                ctx.session.scheduleKeyboard[2][1] = {
                    text: text_1.allWeekBtnText,
                    callback_data: text_1.allWeekBtnText,
                };
                ctx.telegram
                    .editMessageText((_d = ctx.from) === null || _d === void 0 ? void 0 : _d.id, ctx.session.oneMessageId, "", (0, scheduleParse_js_1.toMessage)(await (0, redis_js_1.redisGetData)(ctx.session.value + "_" + ctx.session.weekShift), ctx.session.fulDay, ctx.session.value), {
                    parse_mode: "Markdown",
                    disable_web_page_preview: true,
                    reply_markup: { inline_keyboard: ctx.session.scheduleKeyboard },
                })
                    .catch((err) => {
                    console.log(err);
                });
                delete ctx.session.space;
            }
            else {
                new ScheduleService().allWeek(ctx);
            }
        }
        catch (e) {
            console.log(e);
        }
    }
    async statement(ctx) {
        var _a, _b;
        try {
            ctx.session.oneMessageId = Number((_b = (_a = ctx.callbackQuery) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.message_id);
            ctx.scene.enter("statementScene");
            ctx.answerCbQuery().catch(() => { });
        }
        catch (e) {
            console.log(e);
        }
    }
    async day(ctx) {
        var _a;
        ctx.session.weekMode = false;
        new ScheduleService().daySchedule(String((_a = ctx.callbackQuery) === null || _a === void 0 ? void 0 : _a.data), ctx);
    }
    async previousWeek(ctx) {
        try {
            ctx.session.weekShift -= 1;
            await ctx.scene.enter("scheduleScene");
            ctx.answerCbQuery().catch(() => { });
        }
        catch (e) {
            ctx.answerCbQuery("Ой, сталася помилка. Спробуй ще раз").catch(() => { });
            console.log(e);
        }
    }
    async nextWeek(ctx) {
        try {
            ctx.session.weekShift += 1;
            await ctx.scene.enter("scheduleScene");
            ctx.answerCbQuery().catch(() => { });
        }
        catch (e) {
            ctx.answerCbQuery("Ой, сталася помилка. Спробуй ще раз").catch(() => { });
            console.log(e);
        }
    }
    async today(ctx) {
        try {
            ctx.session.weekMode = false;
            ctx.session.day =
                (0, moment_1.default)().format("dd").charAt(0).toUpperCase() +
                    (0, moment_1.default)().format("dd").charAt(1);
            ctx.session.weekShift = 0;
            await ctx.scene.enter("scheduleScene");
            ctx.answerCbQuery().catch(() => { });
        }
        catch (e) {
            ctx.answerCbQuery("Ой, сталася помилка. Спробуй ще раз").catch(() => { });
            console.log(e);
        }
    }
    async mainMenu(ctx) {
        try {
            await ctx.scene.enter("welcomeScene");
            ctx.answerCbQuery().catch(() => { });
        }
        catch (e) {
            ctx.answerCbQuery("Ой, сталася помилка. Спробуй ще раз").catch(() => { });
            console.log(e);
        }
    }
    async changeQuery(ctx) {
        try {
            await ctx.editMessageText(text_1.changeQueryText, (0, choose_keyboard_1.choiceKeyboard)());
            ctx.answerCbQuery().catch(() => { });
        }
        catch (e) {
            ctx.answerCbQuery("Ой, сталася помилка. Спробуй ще раз").catch(() => { });
            console.log(e);
        }
    }
    async choiceStudent(ctx) {
        var _a, _b;
        try {
            ctx.session.oneMessageId = Number((_b = (_a = ctx.callbackQuery) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.message_id);
            await ctx.scene.enter("studentScene");
            ctx.answerCbQuery().catch(() => { });
        }
        catch (e) {
            ctx.answerCbQuery("Ой, сталася помилка. Спробуй ще раз").catch(() => { });
            console.log(e);
        }
    }
    async choiceTeacher(ctx) {
        var _a, _b;
        try {
            ctx.session.oneMessageId = Number((_b = (_a = ctx.callbackQuery) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.message_id);
            await ctx.scene.enter("teacherScene");
            ctx.answerCbQuery().catch(() => { });
        }
        catch (e) {
            ctx.answerCbQuery("Ой, сталася помилка. Спробуй ще раз").catch(() => { });
            console.log(e);
        }
    }
    async manualDate(ctx) {
        try {
            ctx.scene.enter("writeDateScene");
            ctx.answerCbQuery().catch(() => { });
        }
        catch (e) {
            ctx.answerCbQuery("Ой, сталася помилка. Спробуй ще раз").catch(() => { });
            console.log(e);
        }
    }
    async about(ctx) {
        try {
            await ctx.editMessageText(text_1.aboutText, telegraf_1.Markup.inlineKeyboard([[{ text: "Назад", callback_data: "back" }]]));
            ctx.answerCbQuery().catch(() => { });
        }
        catch (e) {
            ctx.answerCbQuery("Ой, сталася помилка. Спробуй ще раз").catch(() => { });
            console.log(e);
        }
    }
    async allWeek(ctx) {
        var _a;
        try {
            ctx.session.weekMode = true;
            ctx.session.scheduleKeyboard = JSON.parse(JSON.stringify(schedule_keyboard_1.scheduleKeyboard));
            ctx.session.weekDaysBtn = [...text_1.weekDaysBtn];
            ctx.session.scheduleKeyboard[0] = ctx.session.weekDaysBtn;
            ctx.session.scheduleKeyboard[2][1] = {
                text: text_1.allWeekBtnText + node_emoji_1.default.get(":pushpin:"),
                callback_data: text_1.allWeekBtnText + node_emoji_1.default.get(":pushpin:"),
            };
            await ctx.telegram.editMessageText((_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id, ctx.session.oneMessageId, "", (0, scheduleParse_js_1.toWeekMessage)(await (0, redis_js_1.redisGetData)(ctx.session.value + "_" + ctx.session.weekShift), ctx.session.value), {
                parse_mode: "Markdown",
                disable_web_page_preview: true,
                reply_markup: { inline_keyboard: ctx.session.scheduleKeyboard },
            });
            ctx.answerCbQuery().catch(() => { });
        }
        catch (e) {
            ctx.answerCbQuery("Ой, сталася помилка. Спробуй ще раз").catch(() => { });
            console.log(e);
        }
    }
    async again(ctx) {
        try {
            await (0, redis_js_1.redisDelData)(ctx.session.value + "_" + ctx.session.weekShift);
            ctx.scene.enter("scheduleScene");
        }
        catch (e) { }
    }
    async daySchedule(day, ctx) {
        try {
            ctx.session.time = ctx.session.time || 0;
            setTimeout(() => {
                ctx.session.time = 0;
            }, 500);
            if (ctx.session.time !== 0)
                return ctx
                    .answerCbQuery(text_1.floodText, { show_alert: true })
                    .catch(() => { });
            ctx.session.time = 1;
            ctx.session.scheduleKeyboard = JSON.parse(JSON.stringify(schedule_keyboard_1.scheduleKeyboard));
            ctx.session.weekDaysBtn = [...text_1.weekDaysBtn];
            ctx.session.day = day;
            ctx.session.weekDaysBtn[ctx.session.weekDaysBtn.findIndex((el) => el.text == ctx.session.day)] = {
                text: checkBtn,
                callback_data: checkBtn,
            };
            ctx.session.scheduleKeyboard[0] = ctx.session.weekDaysBtn;
            ctx.session.scheduleKeyboard[2][1] = {
                text: text_1.allWeekBtnText,
                callback_data: text_1.allWeekBtnText,
            };
            ctx.session.fulDay = text_1.fullDays[ctx.session.day];
            if (!(await (0, redis_js_1.redisGetData)(ctx.session.value + "_" + ctx.session.weekShift)))
                return ctx.scene.enter("scheduleScene");
            await ctx.editMessageText((0, scheduleParse_js_1.toMessage)(await (0, redis_js_1.redisGetData)(ctx.session.value + "_" + ctx.session.weekShift), ctx.session.fulDay, ctx.session.value), {
                parse_mode: "Markdown",
                disable_web_page_preview: true,
                reply_markup: { inline_keyboard: ctx.session.scheduleKeyboard },
            });
            ctx.answerCbQuery().catch(() => { });
        }
        catch (e) {
            ctx.answerCbQuery("Ой, сталася помилка. Спробуй ще раз").catch(() => { });
            console.log(e);
        }
    }
}
exports.default = new ScheduleService();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NoZWR1bGUuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9ib3Qvc2NlbmVzL3NjaGVkdWxlL3NjaGVkdWxlLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFFQSxvREFBNEI7QUFDNUIsNERBQStCO0FBRS9CLHFDQVNvQjtBQUNwQix1RUFJMEM7QUFDMUMsbURBSThCO0FBQzlCLDJEQUF1RDtBQUN2RCx1Q0FBa0M7QUFDbEMsK0RBQTJEO0FBRTNELE1BQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxJQUFJLElBQUksR0FBRyxDQUFDLENBQUM7QUFFekQsTUFBTSxRQUFRLEdBQUcsb0JBQUssQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUM7QUFFeEMsTUFBTSxlQUFlO0lBQ25CLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBa0I7O1FBQzVCLElBQUk7WUFDRixJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRTtnQkFDOUIsR0FBRyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7Z0JBQ3RELEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO2dCQUNwRCxHQUFHLENBQUMsT0FBTyxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUM7YUFDekI7WUFFRCxPQUFPLEdBQUcsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDO1lBRWhDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRTtnQkFDcEIsSUFBSSxJQUFBLGdCQUFNLEdBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsT0FBTyxFQUFFO29CQUNuQyxNQUFNLEdBQUcs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