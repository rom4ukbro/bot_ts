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
const defaultValueScene = new telegraf_1.Scenes.BaseScene('defaultValueScene');
exports.defaultValueScene = defaultValueScene;
defaultValueScene.enter(async (ctx) => {
    var _a, _b, _c;
    try {
        if ((_b = (_a = ctx.callbackQuery) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.message_id)
            await ctx.editMessageText(text_2.defaultValueText, default_value_keyboard_1.choiceKeyboard);
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
        ctx.session.mode = 'group';
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
        ctx.session.mode = 'teacher';
        ctx.editMessageText(text_1.teacherWelcome);
    }
    catch (e) {
        console.log(e);
    }
});
defaultValueScene.action('back', async (ctx) => {
    try {
        await ctx.scene.enter('welcomeScene');
        ctx.answerCbQuery();
    }
    catch (e) { }
});
defaultValueScene.command('start', async (ctx) => {
    try {
        ctx.session.weekShift = 0;
        await ctx.scene.enter('chooseScene');
        (0, helpers_1.deleteMessage)(ctx, ctx.message.message_id);
    }
    catch (e) {
        console.log(e);
    }
});
defaultValueScene.on('text', (ctx) => {
    try {
        if (!ctx.session.mode) {
            ctx.deleteMessage(ctx.message.message_id).catch((e) => { });
        }
        else if (ctx.session.mode == 'group') {
            searchFnc('group', ctx);
        }
        else if (ctx.session.mode == 'teacher') {
            searchFnc('teacher', ctx);
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
                ctx.deleteMessage(i).catch((err) => { });
        }
        if (ctx.session.searchArr[0] === 'error') {
            ctx.deleteMessage((_b = ctx.message) === null || _b === void 0 ? void 0 : _b.message_id).catch((e) => { });
            return ctx.telegram.editMessageText((_c = ctx.from) === null || _c === void 0 ? void 0 : _c.id, ctx.session.oneMessageId, '', 'Сталася помилка з сайтом, спробуй пізніше.\nНатисни /start');
        }
        if (mode === 'group') {
            ctx.session.resultArr = (0, search_1.findGroup)(ctx.session.searchArr, ctx.message.text);
        }
        if (mode === 'teacher') {
            ctx.session.resultArr = (0, search_1.findTeacher)(ctx.session.searchArr, ctx.message.text);
        }
        if (ctx.session.resultArr.length === 0) {
            (0, helpers_1.deleteMessage)(ctx, Number((_d = ctx.message) === null || _d === void 0 ? void 0 : _d.message_id), ctx.session.oneMessageId);
            return ctx.telegram
                .editMessageText((_e = ctx.from) === null || _e === void 0 ? void 0 : _e.id, ctx.session.oneMessageId, '', text_1.cantFindQuery)
                .catch((err) => { });
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
            }, (error, result) => {
                if (error)
                    return console.log(error);
            });
            ctx.session.default_mode = true;
            ctx.session.default_value = ctx.session.resultArr[0];
            ctx.session.default_role = mode;
            ctx.session.id = Number((_g = ctx.message) === null || _g === void 0 ? void 0 : _g.message_id);
            for (let i = ctx.session.id; i >= ctx.session.id - 100; i--) {
                if (i != ctx.session.oneMessageId)
                    ctx.deleteMessage(i).catch((err) => { });
            }
            return ctx.scene.enter('scheduleScene');
        }
        if (ctx.session.resultArr.length <= 100 && ctx.session.resultArr.length !== 1) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdC12YWx1ZS5zY2VuZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9ib3Qvc2NlbmVzL2RlZmF1bHQtdmFsdWUvZGVmYXVsdC12YWx1ZS5zY2VuZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSx1Q0FBMEM7QUFDMUMscUNBQXVHO0FBQ3ZHLDJFQUFnRjtBQUNoRixtREFBZ0U7QUFDaEUscUNBQW9GO0FBQ3BGLHlEQUFnRDtBQUNoRCwyQ0FBOEM7QUFFOUMscUVBQTBEO0FBSTFELE1BQU0saUJBQWlCLEdBQUcsSUFBSSxpQkFBTSxDQUFDLFNBQVMsQ0FBZ0IsbUJBQW1CLENBQUMsQ0FBQztBQXVKMUUsOENBQWlCO0FBckoxQixpQkFBaUIsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxFQUFFOztJQUNwQyxJQUFJO1FBQ0YsSUFBSSxNQUFBLE1BQUEsR0FBRyxDQUFDLGFBQWEsMENBQUUsT0FBTywwQ0FBRSxVQUFVO1lBQ3hDLE1BQU0sR0FBRyxDQUFDLGVBQWUsQ0FBQyx1QkFBZ0IsRUFBRSx1Q0FBYyxDQUFDLENBQUM7YUFDekQ7WUFDSCxNQUFNLEdBQUcsQ0FBQyxLQUFLLENBQUMsdUJBQWdCLEVBQUUsdUNBQWMsQ0FBQyxDQUFDO1lBQ2xELElBQUEsdUJBQWEsRUFBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLE1BQUEsR0FBRyxDQUFDLE9BQU8sMENBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQTtTQUNwRDtLQUNGO0lBQUMsT0FBTyxDQUFDLEVBQUU7UUFDVixPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ2hCO0FBQ0gsQ0FBQyxDQUFDLENBQUM7QUFFSCxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsd0JBQWlCLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxFQUFFOztJQUN4RCxJQUFJO1FBQ0YsR0FBRyxDQUFDLE9BQU8sQ0FBQyxZQUFZLEdBQUcsTUFBTSxDQUFD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