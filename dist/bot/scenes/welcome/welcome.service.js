"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("../../helpers");
const text_1 = require("../../text");
const user_schema_1 = require("../../../db/user.schema");
const welcome_keyboard_1 = require("./welcome.keyboard");
class WelcomeService {
    async enter(ctx) {
        var _a, _b, _c, _d, _e;
        try {
            if ((_b = (_a = ctx === null || ctx === void 0 ? void 0 : ctx.callbackQuery) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.message_id)
                ctx.editMessageText(text_1.welcomeText, (0, welcome_keyboard_1.choiceKeyboard)()).catch((err) => {
                    ctx.editMessageText(text_1.welcomeText + ':', (0, welcome_keyboard_1.choiceKeyboard)());
                });
            else
                ctx.reply(text_1.welcomeText, (0, welcome_keyboard_1.choiceKeyboard)());
            (0, helpers_1.deleteMessage)(ctx, Number(((_d = (_c = ctx === null || ctx === void 0 ? void 0 : ctx.callbackQuery) === null || _c === void 0 ? void 0 : _c.message) === null || _d === void 0 ? void 0 : _d.message_id) || ((_e = ctx.message) === null || _e === void 0 ? void 0 : _e.message_id)), ctx.session.oneMessageId);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2VsY29tZS5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2JvdC9zY2VuZXMvd2VsY29tZS93ZWxjb21lLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwyQ0FBOEM7QUFDOUMscUNBQXlDO0FBQ3pDLHlEQUFnRDtBQUVoRCx5REFBb0Q7QUFHcEQsTUFBTSxjQUFjO0lBQ2xCLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBa0I7O1FBQzVCLElBQUk7WUFDRixJQUFJLE1BQUEsTUFBQSxHQUFHLGFBQUgsR0FBRyx1QkFBSCxHQUFHLENBQUUsYUFBYSwwQ0FBRSxPQUFPLDBDQUFFLFVBQVU7Z0JBQ3pDLEdBQUcsQ0FBQyxlQUFlLENBQUMsa0JBQVcsRUFBRSxJQUFBLGlDQUFjLEdBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFO29CQUMvRCxHQUFHLENBQUMsZUFBZSxDQUFDLGtCQUFXLEdBQUcsR0FBRyxFQUFFLElBQUEsaUNBQWMsR0FBRSxDQUFDLENBQUM7Z0JBQzNELENBQUMsQ0FBQyxDQUFDOztnQkFDQSxHQUFHLENBQUMsS0FBSyxDQUFDLGtCQUFXLEVBQUUsSUFBQSxpQ0FBYyxHQUFFLENBQUMsQ0FBQztZQUU5QyxJQUFBLHVCQUFhLEVBQUMsR0FBRyxFQUFFLE1BQU0sQ0FBQyxDQUFBLE1BQUEsTUFBQSxHQUFHLGFBQUgsR0FBRyx1QkFBSCxHQUFHLENBQUUsYUFBYSwwQ0FBRSxPQUFPLDBDQUFFLFVBQVUsTUFBSSxNQUFBLEdBQUcsQ0FBQyxPQUFPLDBDQUFFLFVBQVUsQ0FBQSxDQUFDLEVBQUUsR0FBRyxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQTtTQUN6SDtRQUFDLE9BQU8sQ0FBQyxFQUFFLEdBQUc7SUFDakIsQ0FBQztJQUVELEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBa0I7O1FBQ2hDLElBQUk7WUFDRixHQUFHLENBQUMsT0FBTyxD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