"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mailingUpdateScene = exports.mailingCbScene = exports.mailingSimpleScene = exports.adminPanelScene = exports.logInAdminScene = void 0;
const telegraf_1 = require("telegraf");
const moment_1 = __importDefault(require("moment"));
require("moment-timezone");
moment_1.default.locale('uk');
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: './.env' });
const text_1 = require("../text");
const user_schema_1 = require("../../db/user.schema");
const admins = String(process.env.ADMINS_ID).split(',');
const botStart = moment_1.default.tz("Europe/Zaporozhye").format('LLLL');
var sendMessages = 0;
const adminsFncBtn = [
    [{ text: 'Інформація', callback_data: 'info' }],
    [{ text: 'Розсилка', callback_data: 'mailing' }],
    [{ text: 'Вийти', callback_data: 'close' }],
];
const mailingKeyboard = telegraf_1.Markup.inlineKeyboard([
    [{ text: 'Звичайна', callback_data: 'simple' }],
    [{ text: 'Зворотній відгук', callback_data: 'cb' }],
    [{ text: 'Сповістити про оновлення', callback_data: 'update' }],
    [{ text: 'Назад', callback_data: 'back' }],
]);
const logInAdminScene = new telegraf_1.Scenes.BaseScene('logInAdminScene');
exports.logInAdminScene = logInAdminScene;
logInAdminScene.enter((ctx) => {
    var _a, _b, _c;
    try {
        if (((_a = ctx.chat) === null || _a === void 0 ? void 0 : _a.id) == 548746493)
            return ctx.scene.enter('adminPanelScene');
        for (let i = 0; i < admins.length; i++) {
            const el = admins[i];
            if (String((_b = ctx.from) === null || _b === void 0 ? void 0 : _b.id) == el || ((_c = ctx.from) === null || _c === void 0 ? void 0 : _c.username) == el)
                return ctx.scene.enter('adminPanelScene');
        }
        ctx.scene.enter('welcomeScene');
        return ctx.answerCbQuery('Ти не маєш доступу!', { show_alert: true });
    }
    catch (e) {
        console.log(e);
    }
});
const adminPanelScene = new telegraf_1.Scenes.BaseScene('adminPanelScene');
exports.adminPanelScene = adminPanelScene;
var ids = [];
adminPanelScene.enter(async (ctx) => {
    var _a, _b;
    try {
        ids = [];
        if ((_b = (_a = ctx.callbackQuery) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.message_id) {
            ctx.editMessageText(text_1.adminWelcome, telegraf_1.Markup.inlineKeyboard(adminsFncBtn));
        }
        else {
            ctx.reply(text_1.adminWelcome, telegraf_1.Markup.inlineKeyboard(adminsFncBtn));
        }
        await user_schema_1.Users.find()
            .select('_id')
            .then((id) => id.map((item) => {
            ids.push(item._id);
        }));
    }
    catch (e) {
        console.log(e);
    }
});
adminPanelScene.action('back', (ctx) => {
    try {
        ctx.scene.enter('adminPanelScene');
        ctx.answerCbQuery();
    }
    catch (e) {
        console.log(e);
    }
});
adminPanelScene.action('close', (ctx) => {
    try {
        ctx.scene.enter('welcomeScene');
        ctx.answerCbQuery();
    }
    catch (e) {
        console.log(e);
    }
});
adminPanelScene.action('info', (ctx) => {
    try {
        ctx.editMessageText(`Бота запущено: ${moment_1.default.tz(botStart, 'LLLL', "Europe/Zaporozhye").fromNow()}\n` +
            `Користувачів: ${ids.length}\n` +
            ``, telegraf_1.Markup.inlineKeyboard([[{ text: 'Назад', callback_data: 'back' }]]));
        ctx.answerCbQuery();
    }
    catch (e) {
        console.log(e);
    }
});
adminPanelScene.action('mailing', (ctx) => {
    try {
        ctx.editMessageText(text_1.mailingText, mailingKeyboard);
        ctx.answerCbQuery();
    }
    catch (e) {
        console.log(e);
    }
});
adminPanelScene.action('simple', (ctx) => {
    try {
        ctx.scene.enter('mailingSimpleScene');
        ctx.answerCbQuery();
    }
    catch (e) {
        console.log(e);
    }
});
adminPanelScene.action('cb', (ctx) => {
    try {
        ctx.scene.enter('mailingCbScene');
        ctx.answerCbQuery();
    }
    catch (e) {
        console.log(e);
    }
});
adminPanelScene.action('update', (ctx) => {
    try {
        ctx.scene.enter('mailingUpdateScene');
        ctx.answerCbQuery();
    }
    catch (e) {
        console.log(e);
    }
});
const mailingSimpleScene = new telegraf_1.Scenes.BaseScene('mailingSimpleScene');
exports.mailingSimpleScene = mailingSimpleScene;
mailingSimpleScene.enter((ctx) => {
    var _a, _b;
    try {
        ctx.session.adId = Number((_b = (_a = ctx.callbackQuery) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.message_id);
        ctx.editMessageText(text_1.simpleMail, {
            parse_mode: 'Markdown',
            disable_web_page_preview: true,
            reply_markup: {
                inline_keyboard: [[{ text: 'Назад', callback_data: 'back' }]],
            },
        });
    }
    catch (e) {
        console.log(e);
    }
});
mailingSimpleScene.action('send', async (ctx) => {
    sendMessages = ids.length;
    try {
        ctx.deleteMessage(ctx.session.adId).catch((err) => { });
        ctx.deleteMessage(ctx.session.delMess).catch((err) => { });
        for (let n = 0; n < ids.length; n++) {
            for (let n = ids.length; n > 0; n--) {
                const element = ids[n];
                ctx.telegram
                    .sendMessage(element, ctx.session.text, {
                    parse_mode: 'Markdown',
                    disable_web_page_preview: true,
                    reply_markup: {
                        inline_keyboard: [[{ text: 'Зрозуміло', callback_data: 'del' }]],
                    },
                })
                    .catch((err) => {
                    sendMessages -= 1;
                });
            }
            setTimeout(() => {
                ctx.telegram.sendMessage('-1001378618059', `Повідомлення отримали ${sendMessages} користувачів`, { parse_mode: 'Markdown' });
            }, 15000);
            await ctx.scene.enter('adminPanelScene');
        }
    }
    catch (e) { }
});
mailingSimpleScene.on('text', (ctx) => {
    try {
        ctx.session.text = ctx.message.text;
        ctx.session.delMess = ctx.message.message_id;
        ctx.telegram.editMessageText(ctx.chat.id, ctx.session.adId, '', 'Цей текст буде відправлено:\n\n' +
            ctx.message.text +
            '\n\nЩоб змінити просто напиши новий текст\n\nЩоб відправити напиши "ТАК"', {
            parse_mode: 'Markdown',
            disable_web_page_preview: true,
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Надіслати', callback_data: 'send' }],
                    [{ text: 'Назад', callback_data: 'back' }],
                ],
            },
        });
    }
    catch (e) {
        console.log(e);
    }
});
mailingSimpleScene.action('back', (ctx) => {
    try {
        ctx.scene.enter('adminPanelScene');
        ctx.answerCbQuery();
    }
    catch (e) {
        console.log(e);
    }
});
const mailingCbScene = new telegraf_1.Scenes.BaseScene('mailingCbScene');
exports.mailingCbScene = mailingCbScene;
mailingCbScene.enter((ctx) => {
    var _a, _b;
    try {
        ctx.session.adId = Number((_b = (_a = ctx === null || ctx === void 0 ? void 0 : ctx.callbackQuery) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.message_id);
        ctx.editMessageText(text_1.cbMail, {
            parse_mode: 'Markdown',
            disable_web_page_preview: true,
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Написати', callback_data: 'cb' }],
                    [{ text: 'Назад', callback_data: 'back' }],
                ],
            },
        });
    }
    catch (e) {
        console.log(e);
    }
});
mailingCbScene.action('send', async (ctx) => {
    var _a, _b;
    sendMessages = ids.length;
    try {
        ctx.deleteMessage(Number((_b = (_a = ctx.callbackQuery) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.message_id)).catch((err) => { });
        ctx.deleteMessage(ctx.session.adId).catch((err) => { });
        ctx.deleteMessage(ctx.session.delMess).catch((err) => { });
        for (let n = ids.length; n > 0; n--) {
            const element = ids[n];
            ctx.telegram
                .sendMessage(element, ctx.session.text, {
                parse_mode: 'Markdown',
                disable_web_page_preview: true,
                reply_markup: {
                    inline_keyboard: [[{ text: 'Зрозуміло', callback_data: 'del' }]],
                },
            })
                .catch((err) => {
                sendMessages -= 1;
            });
        }
        setTimeout(() => {
            ctx.telegram.sendMessage('-1001378618059', `Повідомлення отримали ${sendMessages} користувачів`, { parse_mode: 'Markdown' });
        }, 10000);
        setTimeout(() => {
            ctx.telegram.sendMessage('-1001378618059', `Повідомлення отримали ${sendMessages} користувачів`, { parse_mode: 'Markdown' });
        }, 15000);
        await ctx.scene.enter('adminPanelScene');
    }
    catch (e) {
        console.log(e);
    }
});
mailingCbScene.on('text', (ctx) => {
    try {
        ctx.session.text = ctx.message.text;
        ctx.session.delMess = ctx.message.message_id;
        ctx.telegram.editMessageText(ctx.chat.id, ctx.session.adId, '', 'Цей текст буде відправлено:\n\n' +
            ctx.message.text +
            '\n\nЩоб змінити просто напиши новий текст\nЩоб відправити напиши "ТАК"', {
            parse_mode: 'Markdown',
            disable_web_page_preview: true,
            reply_markup: {
                inline_keyboard: [[{ text: 'Назад', callback_data: 'back' }]],
            },
        });
    }
    catch (e) {
        console.log(e);
    }
});
mailingCbScene.action('cb', (ctx) => {
    try {
        ctx.answerCbQuery('Це приклад кнопки вона працюватиме після відправки', {
            show_alert: true,
        });
    }
    catch (e) {
        console.log(e);
    }
});
mailingCbScene.action('back', (ctx) => {
    try {
        ctx.scene.enter('adminPanelScene');
        ctx.answerCbQuery();
    }
    catch (e) {
        console.log(e);
    }
});
const mailingUpdateScene = new telegraf_1.Scenes.BaseScene('mailingUpdateScene');
exports.mailingUpdateScene = mailingUpdateScene;
mailingUpdateScene.enter((ctx) => {
    var _a, _b;
    try {
        ctx.session.adId = Number((_b = (_a = ctx.callbackQuery) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.message_id);
        ctx.editMessageText(text_1.updateMail, {
            parse_mode: 'Markdown',
            disable_web_page_preview: true,
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Надіслати', callback_data: 'send' }],
                    [{ text: 'Назад', callback_data: 'back' }],
                ],
            },
        });
    }
    catch (e) {
        console.log(e);
    }
});
mailingUpdateScene.action('send', async (ctx) => {
    sendMessages = ids.length;
    try {
        ctx.deleteMessage(ctx.session.adId).catch((err) => { });
        for (let n = 0; n < ids.length; n++) {
            const element = ids[n];
            ctx.telegram
                .sendMessage(element, text_1.updateInfo + '\n\n' + text_1.clearHistory, {
                parse_mode: 'Markdown',
                disable_web_page_preview: true,
                reply_markup: {
                    inline_keyboard: [
                        [{ text: 'Зрозуміло', callback_data: 'del' }],
                        [{ text: 'Надіслати', callback_data: 'send' }],
                    ],
                },
            })
                .catch((err) => {
                sendMessages -= 1;
            });
            ctx.telegram.sendMessage(element, text_1.updateInfo + '\n\n' + text_1.clearHistory).catch((err) => {
                sendMessages -= 1;
            });
        }
        setTimeout(() => {
            ctx.telegram.sendMessage('-1001378618059', `Повідомлення отримали ${sendMessages} користувачів`, { parse_mode: 'Markdown' });
        }, 15000);
        await ctx.scene.enter('adminPanelScene');
    }
    catch (e) {
        console.log(e);
    }
});
mailingUpdateScene.action('back', (ctx) => {
    try {
        ctx.scene.enter('adminPanelScene');
        ctx.answerCbQuery();
    }
    catch (e) {
        console.log(e);
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRtaW4uc2NlbmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYm90L3NjZW5lcy9hZG1pbi5zY2VuZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSx1Q0FBMEM7QUFDMUMsb0RBQTRCO0FBQzVCLDJCQUF5QjtBQUN6QixnQkFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNwQixvREFBNEI7QUFDNUIsZ0JBQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQztBQUNsQyxrQ0FBOEc7QUFHOUcsc0RBQTZDO0FBRTdDLE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUN4RCxNQUFNLFFBQVEsR0FBRyxnQkFBTSxDQUFDLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUMvRCxJQUFJLFlBQVksR0FBRyxDQUFDLENBQUM7QUFJckIsTUFBTSxZQUFZLEdBQUc7SUFDbkIsQ0FBQyxFQUFFLElBQUksRUFBRSxZQUFZLEVBQUUsYUFBYSxFQUFFLE1BQU0sRUFBRSxDQUFDO0lBQy9DLENBQUMsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLGFBQWEsRUFBRSxTQUFTLEVBQUUsQ0FBQztJQUNoRCxDQUFDLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxhQUFhLEVBQUUsT0FBTyxFQUFFLENBQUM7Q0FDNUMsQ0FBQztBQUVGLE1BQU0sZUFBZSxHQUFHLGlCQUFNLENBQUMsY0FBYyxDQUFDO0lBQzVDLENBQUMsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLGFBQWEsRUFBRSxRQUFRLEVBQUUsQ0FBQztJQUMvQyxDQUFDLEVBQUUsSUFBSSxFQUFFLGtCQUFrQixFQUFFLGFBQWEsRUFBRSxJQUFJLEVBQUUsQ0FB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