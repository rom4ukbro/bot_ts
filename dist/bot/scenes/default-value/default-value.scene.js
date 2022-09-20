"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultValueScene = void 0;
const telegraf_1 = require("telegraf");
const text_1 = require("../../text");
const getGroupAndTeacher_1 = require("../../../parser/getGroupAndTeacher");
const search_1 = require("../../../parser/search");
const text_2 = require("../../text");
const user_schema_1 = require("../../../db/user.schema");
const helpers_1 = require("../../helpers");
const default_value_keyboard_1 = require("./default-value.keyboard");
const defaultValueScene = new telegraf_1.Scenes.BaseScene("defaultValueScene");
exports.defaultValueScene = defaultValueScene;
defaultValueScene.enter(async (ctx) => {
    var _a, _b, _c;
    try {
        if ((_b = (_a = ctx.callbackQuery) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.message_id)
            await ctx.editMessageText(text_2.defaultValueText, default_value_keyboard_1.choiceKeyboard).catch(() => {
            });
        else {
            await ctx.reply(text_2.defaultValueText, default_value_keyboard_1.choiceKeyboard);
            (0, helpers_1.deleteMessage)(ctx, Number((_c = ctx.message) === null || _c === void 0 ? void 0 : _c.message_id));
        }
    }
    catch (e) {
        console.log(e);
    }
});
defaultValueScene.action(text_2.choiceStudentText, async (ctx) => {
    var _a, _b;
    try {
        ctx.session.oneMessageId = Number((_b = (_a = ctx.callbackQuery) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.message_id);
        ctx.session.weekShift = 0;
        ctx.session.searchArr = await (0, getGroupAndTeacher_1.getArrGroup)();
        ctx.session.mode = "group";
        ctx.editMessageText(text_1.studentWelcome);
    }
    catch (e) {
        console.log(e);
    }
});
defaultValueScene.action(text_2.choiceTeacherText, async (ctx) => {
    var _a, _b;
    try {
        ctx.session.oneMessageId = Number((_b = (_a = ctx.callbackQuery) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.message_id);
        ctx.session.weekShift = 0;
        ctx.session.searchArr = await (0, getGroupAndTeacher_1.getArrTeacher)();
        ctx.session.mode = "teacher";
        ctx.editMessageText(text_1.teacherWelcome);
    }
    catch (e) {
        console.log(e);
    }
});
defaultValueScene.action("back", async (ctx) => {
    try {
        await ctx.scene.enter("welcomeScene");
        ctx.answerCbQuery().catch(() => { });
    }
    catch (e) { }
});
defaultValueScene.command("start", async (ctx) => {
    try {
        ctx.session.weekShift = 0;
        await ctx.scene.enter("chooseScene");
        (0, helpers_1.deleteMessage)(ctx, ctx.message.message_id);
    }
    catch (e) {
        console.log(e);
    }
});
defaultValueScene.on("text", (ctx) => {
    try {
        if (!ctx.session.mode) {
            ctx.deleteMessage(ctx.message.message_id).catch(() => { });
        }
        else if (ctx.session.mode == "group") {
            searchFnc("group", ctx);
        }
        else if (ctx.session.mode == "teacher") {
            searchFnc("teacher", ctx);
        }
    }
    catch (e) { }
});
function searchFnc(mode, ctx) {
    var _a, _b, _c, _d, _e, _f, _g;
    try {
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
            ctx.session.resultArr = (0, search_1.findGroup)(ctx.session.searchArr, ctx.message.text);
        }
        if (mode === "teacher") {
            ctx.session.resultArr = (0, search_1.findTeacher)(ctx.session.searchArr, ctx.message.text);
        }
        if (ctx.session.resultArr.length === 0) {
            (0, helpers_1.deleteMessage)(ctx, Number((_d = ctx.message) === null || _d === void 0 ? void 0 : _d.message_id), ctx.session.oneMessageId);
            return ctx.telegram
                .editMessageText((_e = ctx.from) === null || _e === void 0 ? void 0 : _e.id, ctx.session.oneMessageId, "", text_1.cantFindQuery)
                .catch(() => { });
        }
        if (ctx.session.resultArr.length === 1) {
            ctx.session.value = ctx.session.resultArr[0];
            user_schema_1.Users.findOneAndUpdate({ _id: (_f = ctx.from) === null || _f === void 0 ? void 0 : _f.id }, {
                default_value: ctx.session.resultArr[0],
                default_role: mode,
            }, {
                upsert: true,
                new: true,
                setDefaultsOnInsert: true,
            }, (error) => {
                if (error)
                    return console.log(error);
            });
            ctx.session.default_mode = true;
            ctx.session.default_value = ctx.session.resultArr[0];
            ctx.session.default_role = mode;
            ctx.session.id = Number((_g = ctx.message) === null || _g === void 0 ? void 0 : _g.message_id);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdC12YWx1ZS5zY2VuZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9ib3Qvc2NlbmVzL2RlZmF1bHQtdmFsdWUvZGVmYXVsdC12YWx1ZS5zY2VuZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFQSx1Q0FBMEM7QUFDMUMscUNBTW9CO0FBQ3BCLDJFQUFnRjtBQUNoRixtREFBZ0U7QUFDaEUscUNBSW9CO0FBQ3BCLHlEQUFnRDtBQUNoRCwyQ0FBOEM7QUFFOUMscUVBQTBEO0FBSTFELE1BQU0saUJBQWlCLEdBQUcsSUFBSSxpQkFBTSxDQUFDLFNBQVMsQ0FDNUMsbUJBQW1CLENBQ3BCLENBQUM7QUEyS08sOENBQWlCO0FBeksxQixpQkFBaUIsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxFQUFFOztJQUNwQyxJQUFJO1FBQ0YsSUFBSSxNQUFBLE1BQUEsR0FBRyxDQUFDLGFBQWEsMENBQUUsT0FBTywwQ0FBRSxVQUFVO1lBQ3hDLE1BQU0sR0FBRyxDQUFDLGVBQWUsQ0FBQyx1QkFBZ0IsRUFBRSx1Q0FBYyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRTtZQUV2RSxDQUFDLENBQUMsQ0FBQzthQUNBO1lBQ0gsTUFBTSxHQUFHLENBQUMsS0FBSyxDQUFDLHVCQUFnQixFQUFFLHVDQUFjLENBQUMsQ0FBQztZQUNsRCxJQUFBLHVCQUFhLEVBQUMsR0FBRyxFQUFFLE1BQU0sQ0FBQyxNQUFBLEdBQUcsQ0FBQyxPQUFPLDBDQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUM7U0FDckQ7S0FDRjtJQUFDLE9BQU8sQ0FBQyxFQUFFO1FBQ1YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUNoQjtBQUNILENBQUMsQ0FBQyxDQUFDO0FBRUgsaUJBQWlCLENBQUMsTUFBTSxDQUFDLHdCQUFpQixFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsRUFBRTs7SUFDeEQsSUFBSTtRQUNG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