"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cbScene = void 0;
const telegraf_1 = require("telegraf");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: "./.env" });
const cbScene = new telegraf_1.Scenes.BaseScene("cbScene");
exports.cbScene = cbScene;
cbScene.enter((ctx) => {
    var _a, _b;
    try {
        ctx.session.cbId = Number((_b = (_a = ctx.callbackQuery) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.message_id);
        ctx.editMessageText("Напиши те, що хочеш, але тільки одним повідомленням", {
            reply_markup: {
                inline_keyboard: [[{ text: "Відмінити", callback_data: "del" }]],
            },
        });
    }
    catch (e) {
        console.log(e);
    }
});
cbScene.on("text", (ctx) => {
    try {
        ctx.deleteMessage(ctx.message.message_id).catch(() => { });
        ctx.deleteMessage(ctx.session.cbId).catch(() => { });
        ctx.scene.leave();
        ctx.telegram.sendMessage("-1001378618059", `Від [${ctx.from.username || ctx.from.first_name}](tg://user?id=${ctx.chat.id})` +
            "\n\n" +
            ctx.message.text, { parse_mode: "Markdown" });
    }
    catch (e) {
        console.log(e);
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2Iuc2NlbmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYm90L3NjZW5lcy9jYi5zY2VuZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFDQSx1Q0FBa0M7QUFDbEMsb0RBQTRCO0FBRzVCLGdCQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUM7QUFFbEMsTUFBTSxPQUFPLEdBQUcsSUFBSSxpQkFBTSxDQUFDLFNBQVMsQ0FBZ0IsU0FBUyxDQUFDLENBQUM7QUFrQ3RELDBCQUFPO0FBaENoQixPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUU7O0lBQ3BCLElBQUk7UUFDRixHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksR0FBRyxNQUFNLENBQUMsTUFBQSxNQUFBLEdBQUcsQ0FBQyxhQUFhLDBDQUFFLE9BQU8sMENBQUUsVUFBVSxDQUFDLENBQUM7UUFDbEUsR0FBRyxDQUFDLGVBQWUsQ0FBQyxxREFBcUQsRUFBRTtZQUN6RSxZQUFZLEVBQUU7Z0JBQ1osZUFBZSxFQUFFLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsYUFBYSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7YUFDakU7U0FDRixDQUFDLENBQUM7S0FDSjtJQUFDLE9BQU8sQ0FBQyxFQUFFO1FBQ1YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUNoQjtBQUNILENBQUMsQ0FBQyxDQUFDO0FBRUgsT0FBTyxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRTtJQUN6QixJQUFJO1FBQ0YsR0FBRyxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsR0FBRSxDQUFDLENBQUMsQ0FBQztRQUMxRCxHQUFHLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxHQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3BELEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDbEIsR0FBRyxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQ3RCLGdCQUFnQixFQUNoQixRQUFRLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBVSxrQkFDOUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUNYLEdBQUc7WUFDRCxNQUFNO1lBQ04sR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQ2xCLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxDQUMzQixDQUFDO0tBQ0g7SUFBQyxPQUFPLENBQUMsRUFBRTtRQUNWLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDaEI7QUFDSCxDQUFDLENBQUMsQ0FBQyJ9