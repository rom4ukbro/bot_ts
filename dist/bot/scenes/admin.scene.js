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
        const ids = await user_schema_1.UsersModel.find().select("_id");
        ctx.session.users = ids.map((item) => item._id);
        ctx.session.info = {};
        ctx.session.info.usersCount = await user_schema_1.UsersModel.countDocuments();
        ctx.session.info.teacherCount = await user_schema_1.UsersModel.countDocuments({
            default_role: "teacher",
            blocked: false,
        });
        ctx.session.info.studentCount = await user_schema_1.UsersModel.countDocuments({
            default_role: "group",
            blocked: false,
        });
        ctx.session.info.unknownCount = await user_schema_1.UsersModel.countDocuments({
            default_role: null,
        });
        ctx.session.info.weekCount = await user_schema_1.UsersModel.countDocuments({
            last_activity: { $gte: (0, moment_1.default)().add(-1, "weeks").format() },
            blocked: false,
        });
        ctx.session.info.activeCount = await user_schema_1.UsersModel.countDocuments({
            blocked: false,
        });
        ctx.session.info.blockCount = await user_schema_1.UsersModel.countDocuments({
            blocked: true,
        });
        ctx.session.info.notificationCount = await user_schema_1.UsersModel.countDocuments({
            changeNotification: true,
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
                .format("LLL")}\n\n` +
            `Всього користувачів: ${ctx.session.info.usersCount}\n` +
            `Викладачів: ${ctx.session.info.teacherCount}\n` +
            `Студентів: ${ctx.session.info.studentCount}\n` +
            `Невизначених: ${ctx.session.info.unknownCount}\n` +
            `Користувачів за останні 7 днів: ${ctx.session.info.weekCount}\n\n` +
            `Користувачів активувало сповіщення: ${ctx.session.info.notificationCount}\n\n` +
            `Активних: ${ctx.session.info.activeCount}\n` +
            `Заблокувало: ${ctx.session.info.blockCount}\n`, telegraf_1.Markup.inlineKeyboard([[{ text: "Назад", callback_data: "back" }]]));
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
        const blockIds = [];
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
                blockIds.push(userId);
            }
        }
        await user_schema_1.UsersModel.updateMany({ _id: { $in: blockIds } }, { blocked: true });
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
        const blockIds = [];
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
                blockIds.push(userId);
            }
        }
        await user_schema_1.UsersModel.updateMany({ _id: { $in: blockIds } }, { blocked: true });
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
    try {
        await ctx.answerCbQuery("Можеш продовжувати користуватися ботом. Я дам знати, коли розсилка завершиться", { show_alert: true });
        await ctx.scene.enter("adminPanelScene");
        const blockIds = [];
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
                blockIds.push(userId);
            }
        }
        await user_schema_1.UsersModel.updateMany({ _id: { $in: blockIds } }, { blocked: true });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRtaW4uc2NlbmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYm90L3NjZW5lcy9hZG1pbi5zY2VuZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFDQSx1Q0FBMEM7QUFDMUMsb0RBQTRCO0FBQzVCLDJCQUF5QjtBQUN6QixnQkFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNwQixvREFBNEI7QUFDNUIsZ0JBQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQztBQUNsQyxrQ0FRaUI7QUFHakIsc0RBQWtEO0FBRWxELE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUN4RCxNQUFNLFFBQVEsR0FBRyxnQkFBTSxDQUFDLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUMvRCxJQUFJLFlBQVksR0FBRyxDQUFDLENBQUM7QUFJckIsTUFBTSxZQUFZLEdBQUc7SUFDbkIsQ0FBQyxFQUFFLElBQUksRUFBRSxZQUFZLEVBQUUsYUFBYSxFQUFFLE1BQU0sRUFBRSxDQUFDO0lBQy9DLENBQUMsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLGFBQWEsRUFBRSxTQUFTLEVBQUUsQ0FBQztJQUNoRCxDQUFDLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxhQUFhLEVBQUUsT0FBTyxFQUFFLENBQUM7Q0FDNUMsQ0FBQztBQUVGLE1BQU0sZUFBZSxHQUFHLGlCQUFNLENBQUMsY0FBYyxDQUFDO0lBQzVDLENBQUMsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLGFBQWEsRUFBRSxRQUFRLEVBQUUsQ0FBQztJQUMvQyxDQUFDLEVBQUUsSUFBSSxFQUFFLGtCQUFrQixFQUFFLGFBQWEsRUFBRSxXQUFXLEVBQUUsQ0FB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