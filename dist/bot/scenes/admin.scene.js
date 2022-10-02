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
            $or: [
                { blocked: false },
                { blocked: { $exists: false } },
                { blocked: null },
            ],
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