"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const text_1 = require("../../text");
const getGroupAndTeacher_1 = require("../../../parser/getGroupAndTeacher");
const search_1 = require("../../../parser/search");
const helpers_1 = require("../../helpers");
const telegraf_1 = require("telegraf");
class SelectService {
    async enterStudent(ctx) {
        try {
            ctx.session.weekShift = 0;
            ctx.session.searchArr = await (0, getGroupAndTeacher_1.getArrGroup)();
            ctx.editMessageText(text_1.studentWelcome);
        }
        catch (e) {
            console.log(e);
        }
    }
    async enterTeacher(ctx) {
        try {
            ctx.session.weekShift = 0;
            ctx.session.searchArr = await (0, getGroupAndTeacher_1.getArrTeacher)();
            ctx.editMessageText(text_1.teacherWelcome);
        }
        catch (e) {
            console.log(e);
        }
    }
    async startCommand(ctx) {
        var _a;
        try {
            ctx.session.weekShift = 0;
            await ctx.scene.enter("welcomeScene");
            (0, helpers_1.deleteMessage)(ctx, Number((_a = ctx.message) === null || _a === void 0 ? void 0 : _a.message_id));
        }
        catch (e) {
            console.log(e);
        }
    }
    async textStudent(ctx) {
        new SelectService().searchFnc("group", ctx);
    }
    async textTeacher(ctx) {
        new SelectService().searchFnc("group", ctx);
    }
    searchFnc(mode, ctx) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        try {
            ctx.session.mode = mode;
            ctx.session.id = Number((_a = ctx.message) === null || _a === void 0 ? void 0 : _a.message_id);
            for (let i = ctx.session.id - 100; i < ctx.session.id; i++) {
                if (i != ctx.session.oneMessageId)
                    ctx.deleteMessage(i).catch(() => { });
            }
            if (ctx.session.searchArr[0] === "error") {
                ctx.deleteMessage((_b = ctx.message) === null || _b === void 0 ? void 0 : _b.message_id).catch(() => { });
                return ctx.telegram.editMessageText((_c = ctx.from) === null || _c === void 0 ? void 0 : _c.id, ctx.session.oneMessageId, "", "Сталася помилка з сайтом, спробуй пізніше.\nНатисни /start");
            }
            if (mode === "group") {
                ctx.session.resultArr = (0, search_1.findGroup)(ctx.session.searchArr, (_d = ctx.message) === null || _d === void 0 ? void 0 : _d.text);
            }
            if (mode === "teacher") {
                ctx.session.resultArr = (0, search_1.findTeacher)(ctx.session.searchArr, (_e = ctx.message) === null || _e === void 0 ? void 0 : _e.text);
            }
            if (ctx.session.resultArr.length === 0) {
                ctx.session.id = Number((_f = ctx.message) === null || _f === void 0 ? void 0 : _f.message_id);
                for (let i = ctx.session.id; i >= ctx.session.id - 100; i--) {
                    if (i != ctx.session.oneMessageId)
                        ctx.deleteMessage(i).catch(() => { });
                }
                return ctx.telegram
                    .editMessageText((_g = ctx.from) === null || _g === void 0 ? void 0 : _g.id, ctx.session.oneMessageId, "", text_1.cantFindQuery)
                    .catch(() => { });
            }
            if (ctx.session.resultArr.length === 1) {
                ctx.session.value = ctx.session.resultArr[0];
                ctx.session.id = Number((_h = ctx.message) === null || _h === void 0 ? void 0 : _h.message_id);
                for (let i = ctx.session.id; i >= ctx.session.id - 100; i--) {
                    if (i != ctx.session.oneMessageId)
                        ctx.deleteMessage(i).catch(() => { });
                }
                return ctx.scene.enter("scheduleScene");
            }
            if (ctx.session.resultArr.length <= 100 &&
                ctx.session.resultArr.length !== 1) {
                return ctx.reply(text_1.findQuery, telegraf_1.Markup.keyboard(ctx.session.resultArr, { columns: 2 }).oneTime(true));
            }
            if (ctx.session.resultArr.length > 100) {
                ctx.session.resultArr = ctx.session.resultArr.slice(0, 100);
                return ctx.reply(text_1.toManyQueryFind, telegraf_1.Markup.keyboard(ctx.session.resultArr, { columns: 2 }).oneTime(true));
            }
        }
        catch (e) {
            console.log(e);
        }
    }
}
exports.default = new SelectService();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0LnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvYm90L3NjZW5lcy9zZWxlY3Qvc2VsZWN0LnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFHQSxxQ0FNb0I7QUFDcEIsMkVBQWdGO0FBQ2hGLG1EQUFnRTtBQUNoRSwyQ0FBOEM7QUFDOUMsdUNBQWtDO0FBRWxDLE1BQU0sYUFBYTtJQUNqQixLQUFLLENBQUMsWUFBWSxDQUFDLEdBQWtCO1FBQ25DLElBQUk7WUFDRixHQUFHLENBQUMsT0FBTyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUM7WUFDMUIsR0FBRyxDQUFDLE9BQU8sQ0FBQyxTQUFTLEdBQUcsTUFBTSxJQUFBLGdDQUFXLEdBQUUsQ0FBQztZQUU1QyxHQUFHLENBQUMsZUFBZSxDQUFDLHFCQUFjLENBQUMsQ0FBQztTQUNyQztRQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ1YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNoQjtJQUVILENBQUM7SUFFRCxLQUFLLENBQUMsWUFBWSxDQUFDLEdBQWtCO1FBQ25DLElBQUk7WUFDRixHQUFHLENBQUMsT0FBTyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUM7WUFDMUIsR0FBRyxDQUFDLE9BQU8sQ0FBQyxTQUFTLEdBQUcsTUFBTSxJQUFBLGtDQUFhLEdBQUUsQ0FBQztZQUM5QyxHQUFHLENBQUMsZUFBZSxDQUFDLHFCQUFjLENBQUMsQ0FBQztTQUNyQztRQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ1YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNoQjtJQUNILENBQUM7SUFFRCxLQUFLLENBQUMsWUFBWSxDQUFDLEdBQWtCOztRQUNuQyxJQUFJO1lBQ0YsR0FBRyxDQUFDLE9BQU8sQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDO1lBQzFCLE1BQU0sR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLENB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