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
                    ctx.session.day =
                        (0, moment_1.default)().add(1, "day").format("dd").charAt(0).toUpperCase() +
                            (0, moment_1.default)().add(1, "day").format("dd").charAt(1);
                    if (ctx.session.day == "Пн")
                        ctx.session.weekShift += 1;
                }
                else
                    ctx.session.day =
                        (0, moment_1.default)().format("dd").charAt(0).toUpperCase() +
                            (0, moment_1.default)().format("dd").charAt(1);
            }
            if (!(await (0, redis_js_1.redisGetData)(ctx.session.value + "_" + ctx.session.weekShift))) {
                ctx.telegram
                    .editMessageText((_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id, ctx.session.oneMessageId, "", text_1.loadSchedule)
                    .catch(() => { });
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
                    .editMessageText((_d = ctx.from) === null || _d === void 0 ? void 0 : _d.id, ctx.session.oneMessageId, "", (0, scheduleParse_js_1.toMessage)(await (0, redis_js_1.redisGetData)(ctx.session.value + "_" + ctx.session.weekShift), ctx.session.fulDay, ctx.session.value, String(ctx.session.space)), {
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
            await ctx.telegram.editMessageText((_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id, ctx.session.oneMessageId, "", (0, scheduleParse_js_1.toWeekMessage)(await (0, redis_js_1.redisGetData)(ctx.session.value + "_" + ctx.session.weekShift), ctx.session.fulDay, ctx.session.value), {
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
            await ctx.editMessageText((0, scheduleParse_js_1.toMessage)(await (0, redis_js_1.redisGetData)(ctx.session.value + "_" + ctx.session.weekShift), ctx.session.fulDay, ctx.session.value, ""), {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NoZWR1bGUuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9ib3Qvc2NlbmVzL3NjaGVkdWxlL3NjaGVkdWxlLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFFQSxvREFBNEI7QUFDNUIsNERBQStCO0FBRS9CLHFDQVNvQjtBQUNwQix1RUFJMEM7QUFDMUMsbURBSThCO0FBQzlCLDJEQUF1RDtBQUN2RCx1Q0FBa0M7QUFDbEMsK0RBQTJEO0FBRTNELE1BQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxJQUFJLElBQUksR0FBRyxDQUFDLENBQUM7QUFFekQsTUFBTSxRQUFRLEdBQUcsb0JBQUssQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUM7QUFFeEMsTUFBTSxlQUFlO0lBQ25CLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBa0I7O1FBQzVCLElBQUk7WUFDRixJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRTtnQkFDOUIsR0FBRyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7Z0JBQ3RELEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO2dCQUNwRCxHQUFHLENBQUMsT0FBTyxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUM7YUFDekI7WUFFRCxPQUFPLEdBQUcsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDO1lBRWhDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRTtnQkFDcEIsSUFBSSxJQUFBLGdCQUFNLEdBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsT0FBTyxFQUFFO29CQUNuQyxHQUFHLENBQUMs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