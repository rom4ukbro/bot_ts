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
                    ctx.editMessageText(text_1.welcomeText + ':', (0, welcome_keyboard_1.choiceKeyboard)());
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
            ctx.scene.enter('statementScene');
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
                ctx.scene.enter('scheduleScene');
            }
            else if (!ctx.session.default_value || !ctx.session.default_role) {
                await user_schema_1.Users.findOne({ _id: (_c = ctx.from) === null || _c === void 0 ? void 0 : _c.id })
                    .then(async (user) => {
                    if (!(user === null || user === void 0 ? void 0 : user.default_value) || !(user === null || user === void 0 ? void 0 : user.default_role)) {
                        return ctx.scene.enter('defaultValueScene');
                    }
                    ctx.session.default_value = user.default_value;
                    ctx.session.default_role = user.default_role;
                    ctx.session.weekShift = 0;
                })
                    .catch((err) => { });
                if (ctx.session.default_value && ctx.session.default_role) {
                    ctx.session.default_mode = true;
                    return ctx.scene.enter('scheduleScene');
                }
                return ctx.scene.enter('defaultValueScene');
            }
            else if (ctx.session.default_value && ctx.session.default_role) {
                ctx.session.default_mode = true;
                ctx.scene.enter('scheduleScene');
            }
            else {
                ctx.scene.enter('chooseScene');
            }
        }
        catch (e) {
            console.log(e);
        }
    }
    async progress(ctx) {
        var _a, _b;
        try {
            return ctx.answerCbQuery('Це поки що не доступно :< Я працюю над цим ');
            ctx.session.oneMessageId = Number((_b = (_a = ctx.callbackQuery) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.message_id);
            ctx.scene.enter('progressScene');
        }
        catch (e) {
            console.log(e);
        }
    }
}
exports.default = new WelcomeService();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2VsY29tZS5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2JvdC9zY2VuZXMvd2VsY29tZS93ZWxjb21lLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwyQ0FBOEM7QUFDOUMscUNBQXlDO0FBQ3pDLHlEQUFnRDtBQUVoRCx5REFBb0Q7QUFHcEQsTUFBTSxjQUFjO0lBQ2xCLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBa0I7O1FBQzVCLElBQUk7WUFDRixJQUFJLE1BQUEsTUFBQSxHQUFHLGFBQUgsR0FBRyx1QkFBSCxHQUFHLENBQUUsYUFBYSwwQ0FBRSxPQUFPLDBDQUFFLFVBQVUsRUFBRTtnQkFDM0MsR0FBRyxDQUFDLGVBQWUsQ0FBQyxrQkFBVyxFQUFFLElBQUEsaUNBQWMsR0FBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUU7b0JBQy9ELEdBQUcsQ0FBQyxlQUFlLENBQUMsa0JBQVcsR0FBRyxHQUFHLEVBQUUsSUFBQSxpQ0FBYyxHQUFFLENBQUMsQ0FBQztnQkFDM0QsQ0FBQyxDQUFDLENBQUM7YUFDSjtpQkFDSTtnQkFDSCxHQUFHLENBQUMsS0FBSyxDQUFDLGtCQUFXLEVBQUUsSUFBQSxpQ0FBYyxHQUFFLENBQUMsQ0FBQztnQkFDekMsSUFBQSx1QkFBYSxFQUFDLEdBQUcsRUFBRSxNQUFNLENBQUMsTUFBQSxHQUFHLENBQUMsT0FBTywwQ0FBRSxVQUFVLENBQUMsRUFBRSxHQUFHLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFBO2FBQzlFO1NBQ0Y7UUFBQyxPQUFPLENBQUMsRUFBRSxHQUFHO0lBQ2pCLENBQUM7SUFFRCxLQUFLLENBQUMsU0FBUyxDQUFDLEdBQWtCOztRQUNoQyxJQUFJO1lBQ0YsR0FBRyxDQUFDLE9BQU8sQ0FBQyxZQUFZLEdBQUcsTUFBTSxDQUFDLE1BQUEsTUFBQSxHQUFHLENBQUMsYUFBYSwwQ0FBRSxPQUFPLDBD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