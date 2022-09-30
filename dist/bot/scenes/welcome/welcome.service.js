"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("../../helpers");
const text_1 = require("../../text");
const user_schema_1 = require("../../../db/user.schema");
const welcome_keyboard_1 = require("./welcome.keyboard");
class WelcomeService {
    async enter(ctx) {
        var _a, _b, _c;
        try {
            if ((_b = (_a = ctx === null || ctx === void 0 ? void 0 : ctx.callbackQuery) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.message_id) {
                ctx.editMessageText(text_1.welcomeText, (0, welcome_keyboard_1.choiceKeyboard)()).catch(() => {
                    ctx.editMessageText(text_1.welcomeText + ":", (0, welcome_keyboard_1.choiceKeyboard)());
                });
            }
            else {
                ctx.reply(text_1.welcomeText, (0, welcome_keyboard_1.choiceKeyboard)());
                (0, helpers_1.deleteMessage)(ctx, Number((_c = ctx.message) === null || _c === void 0 ? void 0 : _c.message_id), ctx.session.oneMessageId);
            }
        }
        catch (e) { }
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
    async schedule(ctx) {
        var _a, _b, _c;
        try {
            ctx.answerCbQuery().catch(() => { });
            ctx.session.oneMessageId = Number((_b = (_a = ctx.callbackQuery) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.message_id);
            if (!!ctx.session.value && !!ctx.session.mode) {
                ctx.scene.enter("scheduleScene");
            }
            else if (!ctx.session.default_value || !ctx.session.default_role) {
                await user_schema_1.UsersModel.findOne({ _id: (_c = ctx.from) === null || _c === void 0 ? void 0 : _c.id })
                    .then(async (user) => {
                    if (!(user === null || user === void 0 ? void 0 : user.default_value) || !(user === null || user === void 0 ? void 0 : user.default_role)) {
                        return ctx.scene.enter("defaultValueScene");
                    }
                    ctx.session.default_value = user.default_value;
                    ctx.session.default_role = user.default_role;
                    ctx.session.weekShift = 0;
                })
                    .catch(() => { });
                if (ctx.session.default_value && ctx.session.default_role) {
                    ctx.session.default_mode = true;
                    return ctx.scene.enter("scheduleScene");
                }
                return ctx.scene.enter("defaultValueScene");
            }
            else if (ctx.session.default_value && ctx.session.default_role) {
                ctx.session.default_mode = true;
                ctx.scene.enter("scheduleScene");
            }
            else {
                ctx.scene.enter("chooseScene");
            }
        }
        catch (e) {
            console.log(e);
        }
    }
    async progress(ctx) {
        var _a, _b;
        try {
            return ctx
                .answerCbQuery("Це поки що не доступно :< Я працюю над цим ")
                .catch(() => { });
            ctx.session.oneMessageId = Number((_b = (_a = ctx.callbackQuery) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.message_id);
            ctx.scene.enter("progressScene");
        }
        catch (e) {
            console.log(e);
        }
    }
}
exports.default = new WelcomeService();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2VsY29tZS5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2JvdC9zY2VuZXMvd2VsY29tZS93ZWxjb21lLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSwyQ0FBOEM7QUFDOUMscUNBQXlDO0FBQ3pDLHlEQUFxRDtBQUVyRCx5REFBb0Q7QUFFcEQsTUFBTSxjQUFjO0lBQ2xCLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBa0I7O1FBQzVCLElBQUk7WUFDRixJQUFJLE1BQUEsTUFBQSxHQUFHLGFBQUgsR0FBRyx1QkFBSCxHQUFHLENBQUUsYUFBYSwwQ0FBRSxPQUFPLDBDQUFFLFVBQVUsRUFBRTtnQkFDM0MsR0FBRyxDQUFDLGVBQWUsQ0FBQyxrQkFBVyxFQUFFLElBQUEsaUNBQWMsR0FBRSxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRTtvQkFDNUQsR0FBRyxDQUFDLGVBQWUsQ0FBQyxrQkFBVyxHQUFHLEdBQUcsRUFBRSxJQUFBLGlDQUFjLEdBQUUsQ0FBQyxDQUFDO2dCQUMzRCxDQUFDLENBQUMsQ0FBQzthQUNKO2lCQUFNO2dCQUNMLEdBQUcsQ0FBQyxLQUFLLENBQUMsa0JBQVcsRUFBRSxJQUFBLGlDQUFjLEdBQUUsQ0FBQyxDQUFDO2dCQUN6QyxJQUFBLHVCQUFhLEVBQ1gsR0FBRyxFQUNILE1BQU0sQ0FBQyxNQUFBLEdBQUcsQ0FBQyxPQUFPLDBDQUFFLFVBQVUsQ0FBQyxFQUMvQixHQUFHLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FDekIsQ0FBQzthQUNIO1NBQ0Y7UUFBQyxPQUFPLENBQUMsRUFBRSxHQUFFO0lBQ2hCLENBQUM7SUFFRCxLQUFLLENBQUMsU0FBUyxDQUFDLEdBQWtCOztRQUNoQyxJQUFJO1lBQ0YsR0FBRyxDQUFDLE9BQU8sQ0FBQyxZQUFZLEdBQUcsTUFBTSxDQUFDLE1BQUEsTUFBQSxHQUFHLENBQUMsYUFBYSwwQ0FBRSxPQUFPLDBDQUFFLFVBQVUs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