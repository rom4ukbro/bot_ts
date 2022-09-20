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
                ctx.editMessageText(text_1.welcomeText, (0, welcome_keyboard_1.choiceKeyboard)()).catch((err) => {
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
            ctx.answerCbQuery();
        }
        catch (e) {
            console.log(e);
        }
    }
    async schedule(ctx) {
        var _a, _b, _c;
        try {
            ctx.answerCbQuery();
            ctx.session.oneMessageId = Number((_b = (_a = ctx.callbackQuery) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.message_id);
            if (!!ctx.session.value && !!ctx.session.mode) {
                ctx.scene.enter("scheduleScene");
            }
            else if (!ctx.session.default_value || !ctx.session.default_role) {
                await user_schema_1.Users.findOne({ _id: (_c = ctx.from) === null || _c === void 0 ? void 0 : _c.id })
                    .then(async (user) => {
                    if (!(user === null || user === void 0 ? void 0 : user.default_value) || !(user === null || user === void 0 ? void 0 : user.default_role)) {
                        return ctx.scene.enter("defaultValueScene");
                    }
                    ctx.session.default_value = user.default_value;
                    ctx.session.default_role = user.default_role;
                    ctx.session.weekShift = 0;
                })
                    .catch((err) => { });
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
            return ctx.answerCbQuery("Це поки що не доступно :< Я працюю над цим ");
            ctx.session.oneMessageId = Number((_b = (_a = ctx.callbackQuery) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.message_id);
            ctx.scene.enter("progressScene");
        }
        catch (e) {
            console.log(e);
        }
    }
}
exports.default = new WelcomeService();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2VsY29tZS5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2JvdC9zY2VuZXMvd2VsY29tZS93ZWxjb21lLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwyQ0FBOEM7QUFDOUMscUNBQXlDO0FBQ3pDLHlEQUFnRDtBQUVoRCx5REFBb0Q7QUFFcEQsTUFBTSxjQUFjO0lBQ2xCLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBa0I7O1FBQzVCLElBQUk7WUFDRixJQUFJLE1BQUEsTUFBQSxHQUFHLGFBQUgsR0FBRyx1QkFBSCxHQUFHLENBQUUsYUFBYSwwQ0FBRSxPQUFPLDBDQUFFLFVBQVUsRUFBRTtnQkFDM0MsR0FBRyxDQUFDLGVBQWUsQ0FBQyxrQkFBVyxFQUFFLElBQUEsaUNBQWMsR0FBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUU7b0JBQy9ELEdBQUcsQ0FBQyxlQUFlLENBQUMsa0JBQVcsR0FBRyxHQUFHLEVBQUUsSUFBQSxpQ0FBYyxHQUFFLENBQUMsQ0FBQztnQkFDM0QsQ0FBQyxDQUFDLENBQUM7YUFDSjtpQkFBTTtnQkFDTCxHQUFHLENBQUMsS0FBSyxDQUFDLGtCQUFXLEVBQUUsSUFBQSxpQ0FBYyxHQUFFLENBQUMsQ0FBQztnQkFDekMsSUFBQSx1QkFBYSxFQUNYLEdBQUcsRUFDSCxNQUFNLENBQUMsTUFBQSxHQUFHLENBQUMsT0FBTywwQ0FBRSxVQUFVLENBQUMsRUFDL0IsR0FBRyxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQ3pCLENBQUM7YUFDSDtTQUNGO1FBQUMsT0FBTyxDQUFDLEVBQUUsR0FBRTtJQUNoQixDQUFDO0lBRUQsS0FBSyxDQUFDLFNBQVMsQ0FBQyxHQUFrQjs7UUFDaEMsSUFBSTtZQUNGLEdBQUcsQ0FBQyxPQUFPLENBQUMsWUFBWSxHQUFHLE1BQU0sQ0FBQyxNQUFBLE1BQUEsR0FBRyxDQUFDLGFBQWEsMENBQUUsT0FBTyww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