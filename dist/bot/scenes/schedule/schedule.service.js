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
                    .catch((err) => { });
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
        catch (e) {
            console.log(e);
        }
    }
    async statement(ctx) {
        var _a, _b;
        try {
            ctx.session.oneMessageId = Number((_b = (_a = ctx.callbackQuery) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.message_id);
            ctx.scene.enter("statementScene");
            ctx.answerCbQuery();
        }
        catch (e) {
            console.log(e);
        }
    }
    async day(ctx) {
        var _a;
        new ScheduleService().daySchedule(String((_a = ctx.callbackQuery) === null || _a === void 0 ? void 0 : _a.data), ctx);
    }
    async previousWeek(ctx) {
        try {
            ctx.session.weekShift -= 1;
            await ctx.scene.enter("scheduleScene");
            ctx.answerCbQuery();
        }
        catch (e) {
            ctx.answerCbQuery("Ой, сталася помилка. Спробуй ще раз");
            console.log(e);
        }
    }
    async nextWeek(ctx) {
        try {
            ctx.session.weekShift += 1;
            await ctx.scene.enter("scheduleScene");
            ctx.answerCbQuery();
        }
        catch (e) {
            ctx.answerCbQuery("Ой, сталася помилка. Спробуй ще раз");
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
            ctx.answerCbQuery();
        }
        catch (e) {
            ctx.answerCbQuery("Ой, сталася помилка. Спробуй ще раз");
            console.log(e);
        }
    }
    async mainMenu(ctx) {
        try {
            await ctx.scene.enter("welcomeScene");
            ctx.answerCbQuery();
        }
        catch (e) {
            ctx.answerCbQuery("Ой, сталася помилка. Спробуй ще раз");
            console.log(e);
        }
    }
    async changeQuery(ctx) {
        try {
            await ctx.editMessageText(text_1.changeQueryText, (0, choose_keyboard_1.choiceKeyboard)());
            ctx.answerCbQuery();
        }
        catch (e) {
            ctx.answerCbQuery("Ой, сталася помилка. Спробуй ще раз");
            console.log(e);
        }
    }
    async choiceStudent(ctx) {
        var _a, _b;
        try {
            ctx.session.oneMessageId = Number((_b = (_a = ctx.callbackQuery) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.message_id);
            await ctx.scene.enter("studentScene");
            ctx.answerCbQuery();
        }
        catch (e) {
            ctx.answerCbQuery("Ой, сталася помилка. Спробуй ще раз");
            console.log(e);
        }
    }
    async choiceTeacher(ctx) {
        var _a, _b;
        try {
            ctx.session.oneMessageId = Number((_b = (_a = ctx.callbackQuery) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.message_id);
            await ctx.scene.enter("teacherScene");
            ctx.answerCbQuery();
        }
        catch (e) {
            ctx.answerCbQuery("Ой, сталася помилка. Спробуй ще раз");
            console.log(e);
        }
    }
    async manualDate(ctx) {
        try {
            ctx.scene.enter("writeDateScene");
            ctx.answerCbQuery();
        }
        catch (e) {
            ctx.answerCbQuery("Ой, сталася помилка. Спробуй ще раз");
            console.log(e);
        }
    }
    async about(ctx) {
        try {
            await ctx.editMessageText(text_1.aboutText, telegraf_1.Markup.inlineKeyboard([[{ text: "Назад", callback_data: "back" }]]));
            ctx.answerCbQuery();
        }
        catch (e) {
            ctx.answerCbQuery("Ой, сталася помилка. Спробуй ще раз");
            console.log(e);
        }
    }
    async allWeek(ctx) {
        try {
            ctx.session.scheduleKeyboard = JSON.parse(JSON.stringify(schedule_keyboard_1.scheduleKeyboard));
            ctx.session.weekDaysBtn = [...text_1.weekDaysBtn];
            ctx.session.scheduleKeyboard[0] = ctx.session.weekDaysBtn;
            ctx.session.scheduleKeyboard[2][1] = {
                text: text_1.allWeekBtnText + node_emoji_1.default.get(":pushpin:"),
                callback_data: text_1.allWeekBtnText + node_emoji_1.default.get(":pushpin:"),
            };
            await ctx.editMessageText((0, scheduleParse_js_1.toWeekMessage)(await (0, redis_js_1.redisGetData)(ctx.session.value + "_" + ctx.session.weekShift), ctx.session.fulDay, ctx.session.value), {
                parse_mode: "Markdown",
                disable_web_page_preview: true,
                reply_markup: { inline_keyboard: ctx.session.scheduleKeyboard },
            });
            ctx.answerCbQuery();
        }
        catch (e) {
            ctx.answerCbQuery("Ой, сталася помилка. Спробуй ще раз");
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
                return ctx.answerCbQuery(text_1.floodText, { show_alert: true });
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
            ctx.answerCbQuery();
        }
        catch (e) {
            ctx.answerCbQuery("Ой, сталася помилка. Спробуй ще раз");
            console.log(e);
        }
    }
}
exports.default = new ScheduleService();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NoZWR1bGUuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9ib3Qvc2NlbmVzL3NjaGVkdWxlL3NjaGVkdWxlLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxvREFBNEI7QUFDNUIsNERBQStCO0FBRS9CLHFDQVNvQjtBQUNwQix1RUFJMEM7QUFDMUMsbURBSThCO0FBQzlCLDJEQUF1RDtBQUN2RCx1Q0FBa0M7QUFDbEMsK0RBQTJEO0FBRTNELE1BQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxJQUFJLElBQUksR0FBRyxDQUFDLENBQUM7QUFFekQsTUFBTSxRQUFRLEdBQUcsb0JBQUssQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUM7QUFFeEMsTUFBTSxlQUFlO0lBQ25CLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBa0I7O1FBQzVCLElBQUk7WUFDRixJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRTtnQkFDOUIsR0FBRyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7Z0JBQ3RELEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO2dCQUNwRCxHQUFHLENBQUMsT0FBTyxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUM7YUFDekI7WUFFRCxPQUFPLEdBQUcsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDO1lBRWhDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRTtnQkFDcEIsSUFBSSxJQUFBLGdCQUFNLEdBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsT0FBTyxFQUFFO29CQUNuQyxHQUFHLENBQUMs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