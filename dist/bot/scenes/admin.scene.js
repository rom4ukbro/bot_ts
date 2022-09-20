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
    [{ text: "Зворотній відгук", callback_data: "cb" }],
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
        return ctx.answerCbQuery("Ти не маєш доступу!", { show_alert: true });
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
        ctx.answerCbQuery();
    }
    catch (e) {
        console.log(e);
    }
});
adminPanelScene.action("close", (ctx) => {
    try {
        ctx.scene.enter("welcomeScene");
        ctx.answerCbQuery();
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
        ctx.answerCbQuery();
    }
    catch (e) {
        console.log(e);
    }
});
adminPanelScene.action("mailing", (ctx) => {
    try {
        ctx.editMessageText(text_1.mailingText, mailingKeyboard);
        ctx.answerCbQuery();
    }
    catch (e) {
        console.log(e);
    }
});
adminPanelScene.action("simple", (ctx) => {
    try {
        ctx.scene.enter("mailingSimpleScene");
        ctx.answerCbQuery();
    }
    catch (e) {
        console.log(e);
    }
});
adminPanelScene.action("cb", (ctx) => {
    try {
        ctx.scene.enter("mailingCbScene");
        ctx.answerCbQuery();
    }
    catch (e) {
        console.log(e);
    }
});
adminPanelScene.action("update", (ctx) => {
    try {
        ctx.scene.enter("mailingUpdateScene");
        ctx.answerCbQuery();
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
        await ctx.scene.enter("adminPanelScene");
    }
    catch (e) { }
});
mailingSimpleScene.on("text", async (ctx) => {
    try {
        await ctx.deleteMessage(ctx.session.delMess).catch(() => { });
        ctx.session.text = ctx.message.text;
        ctx.session.delMess = ctx.message.message_id;
        ctx.telegram
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
        ctx.answerCbQuery();
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
        await ctx.scene.enter("adminPanelScene");
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
mailingCbScene.action("cb", (ctx) => {
    try {
        ctx.answerCbQuery("Це приклад кнопки вона працюватиме після відправки", {
            show_alert: true,
        });
    }
    catch (e) {
        console.log(e);
    }
});
mailingCbScene.action("back", (ctx) => {
    try {
        ctx.scene.enter("adminPanelScene");
        ctx.answerCbQuery();
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
        await ctx.scene.enter("adminPanelScene");
    }
    catch (e) {
        console.log(e);
    }
});
mailingUpdateScene.action("back", (ctx) => {
    try {
        ctx.scene.enter("adminPanelScene");
        ctx.answerCbQuery();
    }
    catch (e) {
        console.log(e);
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRtaW4uc2NlbmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYm90L3NjZW5lcy9hZG1pbi5zY2VuZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFDQSx1Q0FBMEM7QUFDMUMsb0RBQTRCO0FBQzVCLDJCQUF5QjtBQUN6QixnQkFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNwQixvREFBNEI7QUFDNUIsZ0JBQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQztBQUNsQyxrQ0FRaUI7QUFHakIsc0RBQTZDO0FBRTdDLE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUN4RCxNQUFNLFFBQVEsR0FBRyxnQkFBTSxDQUFDLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUMvRCxJQUFJLFlBQVksR0FBRyxDQUFDLENBQUM7QUFJckIsTUFBTSxZQUFZLEdBQUc7SUFDbkIsQ0FBQyxFQUFFLElBQUksRUFBRSxZQUFZLEVBQUUsYUFBYSxFQUFFLE1BQU0sRUFBRSxDQUFDO0lBQy9DLENBQUMsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLGFBQWEsRUFBRSxTQUFTLEVBQUUsQ0FBQztJQUNoRCxDQUFDLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxhQUFhLEVBQUUsT0FBTyxFQUFFLENBQUM7Q0FDNUMsQ0FBQztBQUVGLE1BQU0sZUFBZSxHQUFHLGlCQUFNLENBQUMsY0FBYyxDQUFDO0lBQzVDLENBQUMsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLGFBQWEsRUFBRSxRQUFRLEVBQUUsQ0FBQztJQUMvQyxDQUFDLEVBQUUsSUFBSSxFQUFFLGtCQUFrQixFQUFFLGFBQWEsRUFBRSxJQUFJLEVBQUUsQ0FB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