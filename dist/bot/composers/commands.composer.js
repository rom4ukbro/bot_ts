"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const telegraf_1 = require("telegraf");
const user_schema_1 = require("../../db/user.schema");
const text_1 = require("../text");
const helpers_1 = require("../helpers");
const composer = new telegraf_1.Composer();
composer.command('start', async (ctx) => {
    var _a, _b, _c;
    try {
        if (((_a = ctx.message.chat) === null || _a === void 0 ? void 0 : _a.type) == 'supergroup' ||
            ((_b = ctx.message.chat) === null || _b === void 0 ? void 0 : _b.type) == 'group') {
            return ctx.reply(`Я не працюю в ${(_c = ctx.message.chat) === null || _c === void 0 ? void 0 : _c.type}`);
        }
        await user_schema_1.Users.findOneAndUpdate({ _id: ctx.from.id }, {
            _id: ctx.from.id,
            name: ctx.from.first_name,
            last_name: ctx.from.last_name,
            username: ctx.from.username,
        }, {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true,
        })
            .clone()
            .then(async (result) => {
            ctx.session.default_value = result === null || result === void 0 ? void 0 : result.default_value;
            ctx.session.default_role = result === null || result === void 0 ? void 0 : result.default_role;
            ctx.session.weekShift = 0;
            await ctx.scene.enter('welcomeScene');
            (0, helpers_1.deleteMessage)(ctx, ctx.message.message_id);
            ctx.deleteMessage(ctx.session.oneMessageId).catch((err) => { });
        })
            .catch((err) => {
            ctx.reply('Щось пішло не так, спробуй ще раз(/start) або звернися по допомогу до творця бота');
            console.log(err);
        });
    }
    catch (e) {
        console.log(e);
    }
});
composer.command('admin', (ctx) => {
    var _a, _b, _c;
    try {
        if (((_a = ctx.message.chat) === null || _a === void 0 ? void 0 : _a.type) == 'supergroup' ||
            ((_b = ctx.message.chat) === null || _b === void 0 ? void 0 : _b.type) == 'group') {
            return ctx.reply(`Я не працюю в ${(_c = ctx.message.chat) === null || _c === void 0 ? void 0 : _c.type}`);
        }
        ctx.scene.enter('logInAdminScene');
        ctx.session.id = ctx.message.message_id;
        for (let i = ctx.session.id - 100; i <= ctx.session.id; i++) {
            ctx.deleteMessage(i).catch((err) => { });
        }
    }
    catch (e) {
        console.log(e);
    }
});
composer.command('reset', (ctx) => {
    var _a, _b, _c, _d;
    try {
        if (((_a = ctx.message.chat) === null || _a === void 0 ? void 0 : _a.type) == 'supergroup' ||
            ((_b = ctx.message.chat) === null || _b === void 0 ? void 0 : _b.type) == 'group') {
            return ctx.reply(`Я не працюю в ${(_c = ctx.message.chat) === null || _c === void 0 ? void 0 : _c.type}`);
        }
        ctx.deleteMessage(ctx.message.message_id).catch((e) => { });
        if (!!((_d = ctx.session) === null || _d === void 0 ? void 0 : _d.oneMessageId)) {
            ctx.telegram
                .editMessageText(ctx.from.id, ctx.session.oneMessageId, '', text_1.resetDefaultValueText, telegraf_1.Markup.inlineKeyboard([
                [{ text: 'Так', callback_data: 'reset_yes' }],
                [{ text: 'Ні', callback_data: 'reset_no' }],
            ]));
        }
        else {
            ctx.reply(text_1.resetDefaultValueText, telegraf_1.Markup.inlineKeyboard([
                [{ text: 'Так', callback_data: 'reset_yes' }],
                [{ text: 'Ні', callback_data: 'reset_no' }],
            ]));
        }
        (0, helpers_1.deleteMessage)(ctx, ctx.message.message_id, ctx.session.oneMessageId);
    }
    catch (e) {
        console.log(e);
    }
});
exports.default = composer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbWFuZHMuY29tcG9zZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYm90L2NvbXBvc2Vycy9jb21tYW5kcy5jb21wb3Nlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHVDQUE0QztBQUM1QyxzREFBNkM7QUFDN0Msa0NBQWdEO0FBQ2hELHdDQUEyQztBQUczQyxNQUFNLFFBQVEsR0FBRyxJQUFJLG1CQUFRLEVBQWlCLENBQUE7QUFFOUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxFQUFFOztJQUN0QyxJQUFJO1FBQ0YsSUFDRSxDQUFBLE1BQUEsR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLDBDQUFFLElBQUksS0FBSSxZQUFZO1lBQ3RDLENBQUEsTUFBQSxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksMENBQUUsSUFBSSxLQUFJLE9BQU8sRUFDakM7WUFDQSxPQUFPLEdBQUcsQ0FBQyxLQUFLLENBQUMsaUJBQWlCLE1BQUEsR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLDBDQUFFLElBQUksRUFBRSxDQUFDLENBQUM7U0FDN0Q7UUFFRCxNQUFNLG1CQUFLLENBQUMsZ0JBQWdCLENBQzFCLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLEVBQ3BCO1lBQ0UsR0FBRyxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUNoQixJQUFJLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVO1lBQ3pCLFNBQVMsRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVM7WUFDN0IsUUFBUSxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUTtTQUM1QixFQUNEO1lBQ0UsTUFBTSxFQUFFLElBQUk7WUFDWixHQUFHLEVBQUUsSUFBSTtZQUNULG1CQUFtQixFQUFFLElBQUk7U0FDMUIsQ0FDRjthQUNFLEtBQUssRUFBRTthQUNQLElB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