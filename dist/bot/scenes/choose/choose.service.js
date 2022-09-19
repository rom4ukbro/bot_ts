"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("../../helpers");
const text_1 = require("../../text");
const choose_keyboard_1 = require("./choose.keyboard");
class ChooseService {
    async enter(ctx) {
        var _a, _b, _c, _d, _e;
        try {
            if ((_b = (_a = ctx === null || ctx === void 0 ? void 0 : ctx.callbackQuery) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.message_id)
                ctx.editMessageText(text_1.chooseWelcomeText, (0, choose_keyboard_1.choiceKeyboard)());
            else
                ctx.reply(text_1.chooseWelcomeText, (0, choose_keyboard_1.choiceKeyboard)());
            (0, helpers_1.deleteMessage)(ctx, Number(((_d = (_c = ctx === null || ctx === void 0 ? void 0 : ctx.callbackQuery) === null || _c === void 0 ? void 0 : _c.message) === null || _d === void 0 ? void 0 : _d.message_id) || ((_e = ctx.message) === null || _e === void 0 ? void 0 : _e.message_id)));
        }
        catch (e) {
            console.log(e);
        }
    }
    async student(ctx) {
        var _a, _b;
        try {
            ctx.session.oneMessageId = Number((_b = (_a = ctx.callbackQuery) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.message_id);
            ctx.scene.enter('studentScene');
        }
        catch (e) {
            console.log(e);
        }
    }
    async teacher(ctx) {
        var _a, _b;
        try {
            ctx.session.oneMessageId = Number((_b = (_a = ctx.callbackQuery) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.message_id);
            ctx.scene.enter('teacherScene');
        }
        catch (e) {
            console.log(e);
        }
    }
    async back(ctx) {
        try {
            await ctx.scene.enter('welcomeScene');
            ctx.answerCbQuery();
        }
        catch (e) { }
    }
}
exports.default = new ChooseService();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hvb3NlLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvYm90L3NjZW5lcy9jaG9vc2UvY2hvb3NlLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwyQ0FBOEM7QUFDOUMscUNBQStDO0FBRS9DLHVEQUFtRDtBQUduRCxNQUFNLGFBQWE7SUFDakIsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFrQjs7UUFDNUIsSUFBSTtZQUNGLElBQUksTUFBQSxNQUFBLEdBQUcsYUFBSCxHQUFHLHVCQUFILEdBQUcsQ0FBRSxhQUFhLDBDQUFFLE9BQU8sMENBQUUsVUFBVTtnQkFDekMsR0FBRyxDQUFDLGVBQWUsQ0FBQyx3QkFBaUIsRUFBRSxJQUFBLGdDQUFjLEdBQUUsQ0FBQyxDQUFDOztnQkFDdEQsR0FBRyxDQUFDLEtBQUssQ0FBQyx3QkFBaUIsRUFBRSxJQUFBLGdDQUFjLEdBQUUsQ0FBQyxDQUFDO1lBQ3BELElBQUEsdUJBQWEsRUFBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLENBQUEsTUFBQSxNQUFBLEdBQUcsYUFBSCxHQUFHLHVCQUFILEdBQUcsQ0FBRSxhQUFhLDBDQUFFLE9BQU8sMENBQUUsVUFBVSxNQUFJLE1BQUEsR0FBRyxDQUFDLE9BQU8sMENBQUUsVUFBVSxDQUFBLENBQUMsQ0FBQyxDQUFBO1NBQy9GO1FBQUMsT0FBTyxDQUFDLEVBQUU7WUFDVixPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ2hCO0lBQ0gsQ0FBQztJQUVELEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBa0I7O1FBQzlCLElBQUk7WUFDRixHQUFHLENBQUMsT0FBTyxDQUFDLFlBQVksR0FBRyxNQUFNLENBQUMsTUFBQSxNQUFBLEdBQUcsQ0FBQyxhQUFhLDBDQUFFLE9BQU8sMENBQUUsVUFBVSxDQUFDLENBQUM7WUFDMUUsR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLENBQUM7U0FDakM7UUFBQyxPQUFPLENBQUMsRUFBRTtZQUNWLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDaEI7SUFDSCxDQUFDO0lBRUQsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFrQjs7UUFDOUIsSUFBSTtZQUNGLEdBQUcsQ0FBQyxPQUFPLENBQUMsWUFBWSxHQUFHLE1BQU0sQ0FBQyxNQUFBLE1BQUEsR0FBRyxDQUFDLGFBQWEsMENBQUUsT0FBTywwQ0FBRSxVQUFVLENBQUMsQ0FBQztZQUMxRSxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsQ0FBQztTQUNqQztRQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ1YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNoQjtJQUNILENBQUM7SUFFRCxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQWtCO1FBQzNCLElBQUk7WUFDRixNQUFNLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBQ3RDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsQ0FBQztTQUNyQjtRQUFDLE9BQU8sQ0FBQyxFQUFFLEdBQUc7SUFDakIsQ0FBQztDQUNGO0FBRUQsa0JBQWUsSUFBSSxhQUFhLEVBQUUsQ0FBQyJ9