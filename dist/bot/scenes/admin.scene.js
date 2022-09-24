"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mailingUpdateScene = exports.mailingCbScene = exports.mailingSimpleScene = exports.adminPanelScene = exports.logInAdminScene = void 0;
const telegraf_1 = require("telegraf");
const moment_1 = __importDefault(require("moment"));
require("moment-timezone");
moment_1.default.locale("uk");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: "./.env" });
const text_1 = require("../text");
const user_schema_1 = require("../../db/user.schema");
const admins = String(process.env.ADMINS_ID).split(",");
const botStart = moment_1.default.tz("Europe/Zaporozhye").format("LLLL");
let sendMessages = 0;
const adminsFncBtn = [
    [{ text: "Інформація", callback_data: "info" }],
    [{ text: "Розсилка", callback_data: "mailing" }],
    [{ text: "Вийти", callback_data: "close" }],
];
const mailingKeyboard = telegraf_1.Markup.inlineKeyboard([
    [{ text: "Звичайна", callback_data: "simple" }],
    [{ text: "Зворотній відгук", callback_data: "cbMailing" }],
    [{ text: "Сповістити про оновлення", callback_data: "update" }],
    [{ text: "Назад", callback_data: "back" }],
]);
const logInAdminScene = new telegraf_1.Scenes.BaseScene("logInAdminScene");
exports.logInAdminScene = logInAdminScene;
logInAdminScene.enter((ctx) => {
    var _a, _b, _c;
    try {
        if (((_a = ctx.chat) === null || _a === void 0 ? void 0 : _a.id) == 548746493)
            return ctx.scene.enter("adminPanelScene");
        for (let i = 0; i < admins.length; i++) {
            const el = admins[i];
            if (String((_b = ctx.from) === null || _b === void 0 ? void 0 : _b.id) == el || ((_c = ctx.from) === null || _c === void 0 ? void 0 : _c.username) == el)
                return ctx.scene.enter("adminPanelScene");
        }
        ctx.scene.enter("welcomeScene");
        return ctx
            .answerCbQuery("Ти не маєш доступу!", { show_alert: true })
            .catch(() => { });
    }
    catch (e) {
        console.log(e);
    }
});
const adminPanelScene = new telegraf_1.Scenes.BaseScene("adminPanelScene");
exports.adminPanelScene = adminPanelScene;
adminPanelScene.enter(async (ctx) => {
    var _a, _b;
    try {
        if ((_b = (_a = ctx.callbackQuery) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.message_id) {
            ctx.editMessageText(text_1.adminWelcome, telegraf_1.Markup.inlineKeyboard(adminsFncBtn));
        }
        else {
            ctx.reply(text_1.adminWelcome, telegraf_1.Markup.inlineKeyboard(adminsFncBtn));
        }
        const ids = (await user_schema_1.Users.find().select("_id")).map((item) => item._id);
        ctx.session.users = ids;
        ctx.session.usersCount = await user_schema_1.Users.countDocuments();
        ctx.session.activeUsersCount = await user_schema_1.Users.countDocuments({
            last_activity: { $gte: (0, moment_1.default)().add(-1, "weeks").format() },
        });
    }
    catch (e) {
        console.log(e);
    }
});
adminPanelScene.action("back", (ctx) => {
    try {
        ctx.scene.enter("adminPanelScene");
        ctx.answerCbQuery().catch(() => { });
    }
    catch (e) {
        console.log(e);
    }
});
adminPanelScene.action("close", (ctx) => {
    try {
        ctx.scene.enter("welcomeScene");
        ctx.answerCbQuery().catch(() => { });
    }
    catch (e) {
        console.log(e);
    }
});
adminPanelScene.action("info", (ctx) => {
    try {
        ctx.editMessageText(`Бот запущено: ${moment_1.default
            .tz(botStart, "LLLL", "Europe/Zaporozhye")
            .fromNow()}\n` +
            `Дата запуску: ${moment_1.default
                .tz(botStart, "LLLL", "Europe/Zaporozhye")
                .format("LLL")}\n` +
            `Всього користувачів: ${ctx.session.usersCount}\n` +
            `Користувачів за останні 7 днів: ${ctx.session.activeUsersCount}\n`, telegraf_1.Markup.inlineKeyboard([[{ text: "Назад", callback_data: "back" }]]));
        ctx.answerCbQuery().catch(() => { });
    }
    catch (e) {
        console.log(e);
    }
});
adminPanelScene.action("mailing", (ctx) => {
    try {
        ctx.editMessageText(text_1.mailingText, mailingKeyboard);
        ctx.answerCbQuery().catch(() => { });
    }
    catch (e) {
        console.log(e);
    }
});
adminPanelScene.action("simple", (ctx) => {
    try {
        ctx.scene.enter("mailingSimpleScene");
        ctx.answerCbQuery().catch(() => { });
    }
    catch (e) {
        console.log(e);
    }
});
adminPanelScene.action("cbMailing", (ctx) => {
    try {
        ctx.scene.enter("mailingCbScene");
        ctx.answerCbQuery().catch(() => { });
    }
    catch (e) {
        console.log(e);
    }
});
adminPanelScene.action("update", (ctx) => {
    try {
        ctx.scene.enter("mailingUpdateScene");
        ctx.answerCbQuery().catch(() => { });
    }
    catch (e) {
        console.log(e);
    }
});
const mailingSimpleScene = new telegraf_1.Scenes.BaseScene("mailingSimpleScene");
exports.mailingSimpleScene = mailingSimpleScene;
mailingSimpleScene.enter((ctx) => {
    var _a, _b;
    try {
        ctx.session.adId = Number((_b = (_a = ctx.callbackQuery) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.message_id);
        ctx.editMessageText(text_1.simpleMail, {
            parse_mode: "Markdown",
            disable_web_page_preview: true,
            reply_markup: {
                inline_keyboard: [[{ text: "Назад", callback_data: "back" }]],
            },
        });
    }
    catch (e) {
        console.log(e);
    }
});
mailingSimpleScene.action("send", async (ctx) => {
    sendMessages = ctx.session.users.length;
    try {
        ctx.deleteMessage(ctx.session.delMess).catch(() => { });
        await ctx.answerCbQuery("Можеш продовжувати користуватися ботом. Я дам знати, коли розсилка завершиться", { show_alert: true });
        await ctx.scene.enter("adminPanelScene");
        for (const userId of ctx.session.users) {
            try {
                await ctx.telegram.sendMessage(userId, ctx.session.text, {
                    parse_mode: "Markdown",
                    disable_web_page_preview: true,
                    reply_markup: {
                        inline_keyboard: [[{ text: "Прочитано", callback_data: "del" }]],
                    },
                });
            }
            catch (error) {
                sendMessages -= 1;
            }
        }
        await ctx.reply(`Повідомлення отримали ${sendMessages} користувачів`, {
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: [[{ text: "Прочитано", callback_data: "del" }]],
            },
        });
    }
    catch (e) { }
});
mailingSimpleScene.on("text", async (ctx) => {
    try {
        await ctx.deleteMessage(ctx.session.delMess).catch(() => { });
        ctx.session.text = ctx.message.text;
        ctx.session.delMess = ctx.message.message_id;
        await ctx.telegram
            .editMessageText(ctx.chat.id, ctx.session.adId, "", "Цей текст буде відправлено:\n\n" +
            ctx.message.text +
            "\n\nЩоб змінити просто напиши новий текст", {
            parse_mode: "Markdown",
            disable_web_page_preview: true,
            reply_markup: {
                inline_keyboard: [
                    [{ text: "Надіслати", callback_data: "send" }],
                    [{ text: "Назад", callback_data: "back" }],
                ],
            },
        })
            .catch((e) => console.log(e));
    }
    catch (e) {
        console.log(e);
    }
});
mailingSimpleScene.action("back", (ctx) => {
    try {
        ctx.scene.enter("adminPanelScene");
        ctx.answerCbQuery().catch(() => { });
    }
    catch (e) {
        console.log(e);
    }
});
const mailingCbScene = new telegraf_1.Scenes.BaseScene("mailingCbScene");
exports.mailingCbScene = mailingCbScene;
mailingCbScene.enter((ctx) => {
    var _a, _b;
    try {
        ctx.session.adId = Number((_b = (_a = ctx === null || ctx === void 0 ? void 0 : ctx.callbackQuery) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.message_id);
        ctx.editMessageText(text_1.cbMail, {
            parse_mode: "Markdown",
            disable_web_page_preview: true,
            reply_markup: {
                inline_keyboard: [
                    [{ text: "Зворотній зв'язок", callback_data: "cb" }],
                    [{ text: "Назад", callback_data: "back" }],
                ],
            },
        });
    }
    catch (e) {
        console.log(e);
    }
});
mailingCbScene.action("send", async (ctx) => {
    sendMessages = ctx.session.users.length;
    try {
        ctx.deleteMessage(ctx.session.delMess).catch(() => { });
        await ctx.answerCbQuery("Можеш продовжувати користуватися ботом. Я дам знати, коли розсилка завершиться", { show_alert: true });
        await ctx.scene.enter("adminPanelScene");
        for (const userId of ctx.session.users) {
            try {
                await ctx.telegram.sendMessage(userId, ctx.session.text, {
                    parse_mode: "Markdown",
                    disable_web_page_preview: true,
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: "Зворотній зв'язок", callback_data: "cbWrite" }],
                            [{ text: "Прочитано", callback_data: "del" }],
                        ],
                    },
                });
            }
            catch (e) {
                sendMessages -= 1;
            }
        }
        await ctx.reply(`Повідомлення отримали ${sendMessages} користувачів`, {
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: [[{ text: "Прочитано", callback_data: "del" }]],
            },
        });
    }
    catch (e) {
        console.log(e);
    }
});
mailingCbScene.on("text", (ctx) => {
    try {
        ctx.session.text = ctx.message.text;
        ctx.session.delMess = ctx.message.message_id;
        ctx.telegram.editMessageText(ctx.chat.id, ctx.session.adId, "", "Цей текст буде відправлено:\n\n" +
            ctx.message.text +
            "\n\nЩоб змінити просто напиши новий текст", {
            parse_mode: "Markdown",
            disable_web_page_preview: true,
            reply_markup: {
                inline_keyboard: [
                    [{ text: "Надіслати", callback_data: "send" }],
                    [{ text: "Назад", callback_data: "back" }],
                ],
            },
        });
    }
    catch (e) {
        console.log(e);
    }
});
mailingCbScene.action("cbWrite", (ctx) => {
    try {
        ctx
            .answerCbQuery("Це приклад кнопки вона працюватиме після відправки", {
            show_alert: true,
        })
            .catch(() => { });
    }
    catch (e) {
        console.log(e);
    }
});
mailingCbScene.action("back", (ctx) => {
    try {
        ctx.scene.enter("adminPanelScene");
        ctx.answerCbQuery().catch(() => { });
    }
    catch (e) {
        console.log(e);
    }
});
const mailingUpdateScene = new telegraf_1.Scenes.BaseScene("mailingUpdateScene");
exports.mailingUpdateScene = mailingUpdateScene;
mailingUpdateScene.enter((ctx) => {
    var _a, _b;
    try {
        ctx.session.adId = Number((_b = (_a = ctx.callbackQuery) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.message_id);
        ctx.editMessageText(text_1.updateMail, {
            parse_mode: "Markdown",
            disable_web_page_preview: true,
            reply_markup: {
                inline_keyboard: [
                    [{ text: "Надіслати", callback_data: "send" }],
                    [{ text: "Назад", callback_data: "back" }],
                ],
            },
        });
    }
    catch (e) {
        console.log(e);
    }
});
mailingUpdateScene.action("send", async (ctx) => {
    sendMessages = ctx.session.users.length;
    await ctx.answerCbQuery("Можеш продовжувати користуватися ботом. Я дам знати, коли розсилка завершиться", { show_alert: true });
    await ctx.scene.enter("adminPanelScene");
    try {
        for (const userId of ctx.session.users) {
            try {
                await ctx.telegram.sendMessage(userId, text_1.updateInfo + "\n\n" + text_1.clearHistory, {
                    parse_mode: "Markdown",
                    disable_web_page_preview: true,
                    reply_markup: {
                        inline_keyboard: [[{ text: "Прочитано", callback_data: "del" }]],
                    },
                });
            }
            catch (error) {
                sendMessages -= 1;
            }
        }
        ctx.reply(`Повідомлення отримали ${sendMessages} користувачів`, {
            parse_mode: "Markdown",
        });
    }
    catch (e) {
        console.log(e);
    }
});
mailingUpdateScene.action("back", (ctx) => {
    try {
        ctx.scene.enter("adminPanelScene");
        ctx.answerCbQuery().catch(() => { });
    }
    catch (e) {
        console.log(e);
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRtaW4uc2NlbmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYm90L3NjZW5lcy9hZG1pbi5zY2VuZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFDQSx1Q0FBMEM7QUFDMUMsb0RBQTRCO0FBQzVCLDJCQUF5QjtBQUN6QixnQkFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNwQixvREFBNEI7QUFDNUIsZ0JBQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQztBQUNsQyxrQ0FRaUI7QUFHakIsc0RBQTZDO0FBRTdDLE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUN4RCxNQUFNLFFBQVEsR0FBRyxnQkFBTSxDQUFDLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUMvRCxJQUFJLFlBQVksR0FBRyxDQUFDLENBQUM7QUFJckIsTUFBTSxZQUFZLEdBQUc7SUFDbkIsQ0FBQyxFQUFFLElBQUksRUFBRSxZQUFZLEVBQUUsYUFBYSxFQUFFLE1BQU0sRUFBRSxDQUFDO0lBQy9DLENBQUMsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLGFBQWEsRUFBRSxTQUFTLEVBQUUsQ0FBQztJQUNoRCxDQUFDLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxhQUFhLEVBQUUsT0FBTyxFQUFFLENBQUM7Q0FDNUMsQ0FBQztBQUVGLE1BQU0sZUFBZSxHQUFHLGlCQUFNLENBQUMsY0FBYyxDQUFDO0lBQzVDLENBQUMsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLGFBQWEsRUFBRSxRQUFRLEVBQUUsQ0FBQztJQUMvQyxDQUFDLEVBQUUsSUFBSSxFQUFFLGtCQUFrQixFQUFFLGFBQWEsRUFBRSxXQUFXLEVBQUUsQ0FBQztJQUMxRCxDQUFDLEVBQUUsSUFBSSxFQUFFLDBCQUEwQixFQUFFLGFBQWEsRUFBRSxRQUFRLEVBQUUsQ0FBQztJQUMvRCxDQUFDLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxFQUFFLENBQUM7Q0FDM0MsQ0FBQyxDQUFDO0FBSUgsTUFBTSxlQUFlLEdBQUcsSUFBSSxpQkFBTSxDQUFDLFNBQVMsQ0FBZ0IsaUJBQWlCLENBQUMsQ0FBQztBQXFZN0UsMENBQWU7QUFuWWpCLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRTs7SUFDNUIsSUFBSTtRQUNGLElBQUksQ0FBQSxNQUFBLEdBQUcsQ0FBQyxJQUFJLDBDQUFFLEVBQUUsS0FBSSxTQUFTO1lBQUUsT0FBTyxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1FBQ3pFLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ3RDLE1BQU0sRUFBRSxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNyQixJQUFJLE1BQU0sQ0FBQyxNQUFBLEdBQUcsQ0FBQyxJQUFJLDBDQUFFLEVBQUUsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFBLE1BQUEsR0FBRyxDQUFDLElBQUksMENBQUUsUUFBUSxLQUFJLEVBQUU7Z0JBQ3hELE9BQU8sR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsaUJBQWlCLENBQUMsQ0FBQztTQUM3QztRQUNELEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQ2hDLE9BQU8sR0FBRzthQUNQLGFBQWEsQ0FBQyxxQkFBcUIsRUFBRSxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsQ0FBQzthQUMxRCxLQUFLLENBQUMsR0FBRyxFQUFFLEdBQUUsQ0FBQyxDQUFDLENBQUM7S0FDcEI7SUFBQyxPQUFPLENBQUMsRUFBRTtRQUNWLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDaEI7QUFDSCxDQUFDLENBQUMsQ0FBQztBQUlILE1BQU0sZUFBZSxHQUFHLElBQUksaUJBQU0sQ0FBQyxTQUFTLENBQWdCLGlCQUFpQixDQUFDLENBQUM7QUFpWDdFLDBDQUFlO0FBL1dqQixlQUFlLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsRUFBRTs7SUFDbEMsSUFBSTtRQUNGLElBQUksTUFBQSxNQUFBLEdBQUcsQ0FBQyxhQUFhLDBDQUFFLE9BQU8sMENBQUUsVUFBVSxFQUFFO1lBQzFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsbUJBQVksRUFBRSxpQkFBTSxDQUFDLGNBQWMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO1NBQ3hFO2FBQU07WUFDTCxHQUFHLENBQUMsS0FBSyxDQUFDLG1CQUFZLEVBQUUsaUJBQU0sQ0FBQyxjQUFjLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztTQUM5RDtRQUVELE1BQU0sR0FBRyxHQUFHLENBQUMsTUFBTSxtQkFBSyxDQUFDLElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRXZFLEdBQUcsQ0FBQyxPQUFPLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQztRQUN4QixHQUFHLENBQUMsT0FBTyxDQUFDLFVBQVUsR0FBRyxNQUFNLG1CQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDdEQsR0FBRyxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsR0FBRyxNQUFNLG1CQUFLLENBQUMsY0FBYyxDQUFDO1lBQ3hELGFBQWEsRUFBRSxFQUFFLElBQUksRUFBRSxJQUFBLGdCQUFNLEdBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUU7U0FDNUQsQ0FBQyxDQUFDO0tBQ0o7SUFBQyxPQUFPLENBQUMsRUFBRTtRQUNWLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDaEI7QUFDSCxDQUFDLENBQUMsQ0FBQztBQUVILGVBQWUsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUU7SUFDckMsSUFBSTtRQUNGLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFDbkMsR0FBRyxDQUFDLGFBQWEsRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsR0FBRSxDQUFDLENBQUMsQ0FBQztLQUNyQztJQUFDLE9BQU8sQ0FBQyxFQUFFO1FBQ1YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUNoQjtBQUNILENBQUMsQ0FBQyxDQUFDO0FBRUgsZUFBZSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRTtJQUN0QyxJQUFJO1FBQ0YsR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDaEMsR0FBRyxDQUFDLGFBQWEsRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsR0FBRSxDQUFDLENBQUMsQ0FBQztLQUNyQztJQUFDLE9BQU8sQ0FBQyxFQUFFO1FBQ1YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUNoQjtBQUNILENBQUMsQ0FBQyxDQUFDO0FBRUgsZUFBZSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRTtJQUNyQyxJQUFJO1FBQ0YsR0FBRyxDQUFDLGVBQWUsQ0FDakIsaUJBQWlCLGdCQUFNO2FBQ3BCLEVBQUUsQ0FBQyxRQUFRLEVBQUUsTUFBTSxFQUFFLG1CQUFtQixDQUFDO2FBQ3pDLE9BQU8sRUFBRSxJQUFJO1lBQ2QsaUJBQWlCLGdCQUFNO2lCQUNwQixFQUFFLENBQUMsUUFBUSxFQUFFLE1BQU0sRUFBRSxtQkFBbUIsQ0FBQztpQkFDekMsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJO1lBQ3BCLHdCQUF3QixHQUFHLENBQUMsT0FBTyxDQUFDLFVBQVUsSUFBSTtZQUNsRCxtQ0FBbUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsSUFBSSxFQUNyRSxpQkFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FDcEUsQ0FBQztRQUNGLEdBQUcsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLEdBQUUsQ0FBQyxDQUFDLENBQUM7S0FDckM7SUFBQyxPQUFPLENBQUMsRUFBRTtRQUNWLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDaEI7QUFDSCxDQUFDLENBQUMsQ0FBQztBQUVILGVBQWUsQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUU7SUFDeEMsSUFBSTtRQUNGLEdBQUcsQ0FBQyxlQUFlLENBQUMsa0JBQVcsRUFBRSxlQUFlLENBQUMsQ0FBQztRQUNsRCxHQUFHLENBQUMsYUFBYSxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxHQUFFLENBQUMsQ0FBQyxDQUFDO0tBQ3JDO0lBQUMsT0FBTyxDQUFDLEVBQUU7UUFDVixPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ2hCO0FBQ0gsQ0FBQyxDQUFDLENBQUM7QUFFSCxlQUFlLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFO0lBQ3ZDLElBQUk7UUFDRixHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO1FBQ3RDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLEdBQUUsQ0FBQyxDQUFDLENBQUM7S0FDckM7SUFBQyxPQUFPLENBQUMsRUFBRTtRQUNWLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDaEI7QUFDSCxDQUFDLENBQUMsQ0FBQztBQUVILGVBQWUsQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUU7SUFDMUMsSUFBSTtRQUNGLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFDbEMsR0FBRyxDQUFDLGFBQWEsRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsR0FBRSxDQUFDLENBQUMsQ0FBQztLQUNyQztJQUFDLE9BQU8sQ0FBQyxFQUFFO1FBQ1YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUNoQjtBQUNILENBQUMsQ0FBQyxDQUFDO0FBRUgsZUFBZSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRTtJQUN2QyxJQUFJO1FBQ0YsR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsb0JBQW9CLENBQUMsQ0FBQztRQUN0QyxHQUFHLENBQUMsYUFBYSxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxHQUFFLENBQUMsQ0FBQyxDQUFDO0tBQ3JDO0lBQUMsT0FBTyxDQUFDLEVBQUU7UUFDVixPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ2hCO0FBQ0gsQ0FBQyxDQUFDLENBQUM7QUFJSCxNQUFNLGtCQUFrQixHQUFHLElBQUksaUJBQU0sQ0FBQyxTQUFTLENBQzdDLG9CQUFvQixDQUNyQixDQUFDO0FBK1FBLGdEQUFrQjtBQTdRcEIsa0JBQWtCLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUU7O0lBQy9CLElBQUk7UUFDRixHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksR0FBRyxNQUFNLENBQUMsTUFBQSxNQUFBLEdBQUcsQ0FBQyxhQUFhLDBDQUFFLE9BQU8sMENBQUUsVUFBVSxDQUFDLENBQUM7UUFDbEUsR0FBRyxDQUFDLGVBQWUsQ0FBQyxpQkFBVSxFQUFFO1lBQzlCLFVBQVUsRUFBRSxVQUFVO1lBQ3RCLHdCQUF3QixFQUFFLElBQUk7WUFDOUIsWUFBWSxFQUFFO2dCQUNaLGVBQWUsRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDO2FBQzlEO1NBQ0YsQ0FBQyxDQUFDO0tBQ0o7SUFBQyxPQUFPLENBQUMsRUFBRTtRQUNWLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDaEI7QUFDSCxDQUFDLENBQUMsQ0FBQztBQUVILGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxFQUFFO0lBQzlDLFlBQVksR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUM7SUFDeEMsSUFBSTtRQUNGLEdBQUcsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLEdBQUUsQ0FBQyxDQUFDLENBQUM7UUFFdkQsTUFBTSxHQUFHLENBQUMsYUFBYSxDQUNyQixnRkFBZ0YsRUFDaEYsRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLENBQ3JCLENBQUM7UUFDRixNQUFNLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFFekMsS0FBSyxNQUFNLE1BQU0sSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRTtZQUN0QyxJQUFJO2dCQUNGLE1BQU0sR0FBRyxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFO29CQUN2RCxVQUFVLEVBQUUsVUFBVTtvQkFDdEIsd0JBQXdCLEVBQUUsSUFBSTtvQkFDOUIsWUFBWSxFQUFFO3dCQUNaLGVBQWUsRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLGFBQWEsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO3FCQUNqRTtpQkFDRixDQUFDLENBQUM7YUFDSjtZQUFDLE9BQU8sS0FBSyxFQUFFO2dCQUNkLFlBQVksSUFBSSxDQUFDLENBQUM7YUFDbkI7U0FDRjtRQUVELE1BQU0sR0FBRyxDQUFDLEtBQUssQ0FBQyx5QkFBeUIsWUFBWSxlQUFlLEVBQUU7WUFDcEUsVUFBVSxFQUFFLFVBQVU7WUFDdEIsWUFBWSxFQUFFO2dCQUNaLGVBQWUsRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLGFBQWEsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO2FBQ2pFO1NBQ0YsQ0FBQyxDQUFDO0tBQ0o7SUFBQyxPQUFPLENBQUMsRUFBRSxHQUFFO0FBQ2hCLENBQUMsQ0FBQyxDQUFDO0FBRUgsa0JBQWtCLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLEVBQUU7SUFDMUMsSUFBSTtRQUNGLE1BQU0sR0FBRyxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsR0FBRSxDQUFDLENBQUMsQ0FBQztRQUM3RCxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQztRQUNwQyxHQUFHLENBQUMsT0FBTyxDQUFDLE9BQU8sR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQztRQUM3QyxNQUFNLEdBQUcsQ0FBQyxRQUFRO2FBQ2YsZUFBZSxDQUNkLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUNYLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUNoQixFQUFFLEVBQ0YsaUNBQWlDO1lBQy9CLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSTtZQUNoQiwyQ0FBMkMsRUFDN0M7WUFDRSxVQUFVLEVBQUUsVUFBVTtZQUN0Qix3QkFBd0IsRUFBRSxJQUFJO1lBQzlCLFlBQVksRUFBRTtnQkFDWixlQUFlLEVBQUU7b0JBQ2YsQ0FBQyxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsYUFBYSxFQUFFLE1BQU0sRUFBRSxDQUFDO29CQUM5QyxDQUFDLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxFQUFFLENBQUM7aUJBQzNDO2FBQ0Y7U0FDRixDQUNGO2FBQ0EsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDakM7SUFBQyxPQUFPLENBQUMsRUFBRTtRQUNWLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDaEI7QUFDSCxDQUFDLENBQUMsQ0FBQztBQUVILGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRTtJQUN4QyxJQUFJO1FBQ0YsR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsaUJBQWlCLENBQUMsQ0FBQztRQUNuQyxHQUFHLENBQUMsYUFBYSxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxHQUFFLENBQUMsQ0FBQyxDQUFDO0tBQ3JDO0lBQUMsT0FBTyxDQUFDLEVBQUU7UUFDVixPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ2hCO0FBQ0gsQ0FBQyxDQUFDLENBQUM7QUFJSCxNQUFNLGNBQWMsR0FBRyxJQUFJLGlCQUFNLENBQUMsU0FBUyxDQUFnQixnQkFBZ0IsQ0FBQyxDQUFDO0FBb0wzRSx3Q0FBYztBQWxMaEIsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFOztJQUMzQixJQUFJO1FBQ0YsR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDLE1BQUEsTUFBQSxHQUFHLGFBQUgsR0FBRyx1QkFBSCxHQUFHLENBQUUsYUFBYSwwQ0FBRSxPQUFPLDBDQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQ25FLEdBQUcsQ0FBQyxlQUFlLENBQUMsYUFBTSxFQUFFO1lBQzFCLFVBQVUsRUFBRSxVQUFVO1lBQ3RCLHdCQUF3QixFQUFFLElBQUk7WUFDOUIsWUFBWSxFQUFFO2dCQUNaLGVBQWUsRUFBRTtvQkFDZixDQUFDLEVBQUUsSUFBSSxFQUFFLG1CQUFtQixFQUFFLGFBQWEsRUFBRSxJQUFJLEVBQUUsQ0FBQztvQkFDcEQsQ0FBQyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sRUFBRSxDQUFDO2lCQUMzQzthQUNGO1NBQ0YsQ0FBQyxDQUFDO0tBQ0o7SUFBQyxPQUFPLENBQUMsRUFBRTtRQUNWLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDaEI7QUFDSCxDQUFDLENBQUMsQ0FBQztBQUVILGNBQWMsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsRUFBRTtJQUMxQyxZQUFZLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDO0lBQ3hDLElBQUk7UUFDRixHQUFHLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxHQUFFLENBQUMsQ0FBQyxDQUFDO1FBRXZELE1BQU0sR0FBRyxDQUFDLGFBQWEsQ0FDckIsZ0ZBQWdGLEVBQ2hGLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxDQUNyQixDQUFDO1FBQ0YsTUFBTSxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1FBRXpDLEtBQUssTUFBTSxNQUFNLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUU7WUFDdEMsSUFBSTtnQkFDRixNQUFNLEdBQUcsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRTtvQkFDdkQsVUFBVSxFQUFFLFVBQVU7b0JBQ3RCLHdCQUF3QixFQUFFLElBQUk7b0JBQzlCLFlBQVksRUFBRTt3QkFDWixlQUFlLEVBQUU7NEJBQ2YsQ0FBQyxFQUFFLElBQUksRUFBRSxtQkFBbUIsRUFBRSxhQUFhLEVBQUUsU0FBUyxFQUFFLENBQUM7NEJBQ3pELENBQUMsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLGFBQWEsRUFBRSxLQUFLLEVBQUUsQ0FBQzt5QkFDOUM7cUJBQ0Y7aUJBQ0YsQ0FBQyxDQUFDO2FBQ0o7WUFBQyxPQUFPLENBQUMsRUFBRTtnQkFDVixZQUFZLElBQUksQ0FBQyxDQUFDO2FBQ25CO1NBQ0Y7UUFFRCxNQUFNLEdBQUcsQ0FBQyxLQUFLLENBQUMseUJBQXlCLFlBQVksZUFBZSxFQUFFO1lBQ3BFLFVBQVUsRUFBRSxVQUFVO1lBQ3RCLFlBQVksRUFBRTtnQkFDWixlQUFlLEVBQUUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxhQUFhLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQzthQUNqRTtTQUNGLENBQUMsQ0FBQztLQUNKO0lBQUMsT0FBTyxDQUFDLEVBQUU7UUFDVixPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ2hCO0FBQ0gsQ0FBQyxDQUFDLENBQUM7QUFFSCxjQUFjLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFO0lBQ2hDLElBQUk7UUFDRixHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQztRQUNwQyxHQUFHLENBQUMsT0FBTyxDQUFDLE9BQU8sR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQztRQUM3QyxHQUFHLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FDMUIsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQ1gsR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQ2hCLEVBQUUsRUFDRixpQ0FBaUM7WUFDL0IsR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJO1lBQ2hCLDJDQUEyQyxFQUM3QztZQUNFLFVBQVUsRUFBRSxVQUFVO1lBQ3RCLHdCQUF3QixFQUFFLElBQUk7WUFDOUIsWUFBWSxFQUFFO2dCQUNaLGVBQWUsRUFBRTtvQkFDZixDQUFDLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxhQUFhLEVBQUUsTUFBTSxFQUFFLENBQUM7b0JBQzlDLENBQUMsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLEVBQUUsQ0FBQztpQkFDM0M7YUFDRjtTQUNGLENBQ0YsQ0FBQztLQUNIO0lBQUMsT0FBTyxDQUFDLEVBQUU7UUFDVixPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ2hCO0FBQ0gsQ0FBQyxDQUFDLENBQUM7QUFFSCxjQUFjLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFO0lBQ3ZDLElBQUk7UUFDRixHQUFHO2FBQ0EsYUFBYSxDQUFDLG9EQUFvRCxFQUFFO1lBQ25FLFVBQVUsRUFBRSxJQUFJO1NBQ2pCLENBQUM7YUFDRCxLQUFLLENBQUMsR0FBRyxFQUFFLEdBQUUsQ0FBQyxDQUFDLENBQUM7S0FDcEI7SUFBQyxPQUFPLENBQUMsRUFBRTtRQUNWLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDaEI7QUFDSCxDQUFDLENBQUMsQ0FBQztBQUVILGNBQWMsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUU7SUFDcEMsSUFBSTtRQUNGLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFDbkMsR0FBRyxDQUFDLGFBQWEsRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsR0FBRSxDQUFDLENBQUMsQ0FBQztLQUNyQztJQUFDLE9BQU8sQ0FBQyxFQUFFO1FBQ1YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUNoQjtBQUNILENBQUMsQ0FBQyxDQUFDO0FBSUgsTUFBTSxrQkFBa0IsR0FBRyxJQUFJLGlCQUFNLENBQUMsU0FBUyxDQUM3QyxvQkFBb0IsQ0FDckIsQ0FBQztBQXNFQSxnREFBa0I7QUFwRXBCLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFOztJQUMvQixJQUFJO1FBQ0YsR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDLE1BQUEsTUFBQSxHQUFHLENBQUMsYUFBYSwwQ0FBRSxPQUFPLDBDQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQ2xFLEdBQUcsQ0FBQyxlQUFlLENBQUMsaUJBQVUsRUFBRTtZQUM5QixVQUFVLEVBQUUsVUFBVTtZQUN0Qix3QkFBd0IsRUFBRSxJQUFJO1lBQzlCLFlBQVksRUFBRTtnQkFDWixlQUFlLEVBQUU7b0JBQ2YsQ0FBQyxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsYUFBYSxFQUFFLE1BQU0sRUFBRSxDQUFDO29CQUM5QyxDQUFDLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxFQUFFLENBQUM7aUJBQzNDO2FBQ0Y7U0FDRixDQUFDLENBQUM7S0FDSjtJQUFDLE9BQU8sQ0FBQyxFQUFFO1FBQ1YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUNoQjtBQUNILENBQUMsQ0FBQyxDQUFDO0FBRUgsa0JBQWtCLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLEVBQUU7SUFDOUMsWUFBWSxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQztJQUV4QyxNQUFNLEdBQUcsQ0FBQyxhQUFhLENBQ3JCLGdGQUFnRixFQUNoRixFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsQ0FDckIsQ0FBQztJQUNGLE1BQU0sR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsaUJBQWlCLENBQUMsQ0FBQztJQUV6QyxJQUFJO1FBQ0YsS0FBSyxNQUFNLE1BQU0sSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRTtZQUN0QyxJQUFJO2dCQUNGLE1BQU0sR0FBRyxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQzVCLE1BQU0sRUFDTixpQkFBVSxHQUFHLE1BQU0sR0FBRyxtQkFBWSxFQUNsQztvQkFDRSxVQUFVLEVBQUUsVUFBVTtvQkFDdEIsd0JBQXdCLEVBQUUsSUFBSTtvQkFDOUIsWUFBWSxFQUFFO3dCQUNaLGVBQWUsRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLGFBQWEsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO3FCQUNqRTtpQkFDRixDQUNGLENBQUM7YUFDSDtZQUFDLE9BQU8sS0FBSyxFQUFFO2dCQUNkLFlBQVksSUFBSSxDQUFDLENBQUM7YUFDbkI7U0FDRjtRQUVELEdBQUcsQ0FBQyxLQUFLLENBQUMseUJBQXlCLFlBQVksZUFBZSxFQUFFO1lBQzlELFVBQVUsRUFBRSxVQUFVO1NBQ3ZCLENBQUMsQ0FBQztLQUNKO0lBQUMsT0FBTyxDQUFDLEVBQUU7UUFDVixPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ2hCO0FBQ0gsQ0FBQyxDQUFDLENBQUM7QUFFSCxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUU7SUFDeEMsSUFBSTtRQUNGLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFDbkMsR0FBRyxDQUFDLGFBQWEsRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsR0FBRSxDQUFDLENBQUMsQ0FBQztLQUNyQztJQUFDLE9BQU8sQ0FBQyxFQUFFO1FBQ1YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUNoQjtBQUNILENBQUMsQ0FBQyxDQUFDIn0=