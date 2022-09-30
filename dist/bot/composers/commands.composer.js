"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const telegraf_1 = require("telegraf");
const user_schema_1 = require("../../db/user.schema");
const text_1 = require("../text");
const helpers_1 = require("../helpers");
const composer = new telegraf_1.Composer();
composer.command("start", async (ctx) => {
    var _a, _b, _c;
    try {
        if (((_a = ctx.message.chat) === null || _a === void 0 ? void 0 : _a.type) == "supergroup" ||
            ((_b = ctx.message.chat) === null || _b === void 0 ? void 0 : _b.type) == "group") {
            return ctx.reply(`Я не працюю в ${(_c = ctx.message.chat) === null || _c === void 0 ? void 0 : _c.type}`);
        }
        await user_schema_1.UsersModel.findOneAndUpdate({ _id: ctx.from.id }, {
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
            await ctx.scene.enter("welcomeScene");
            (0, helpers_1.deleteMessage)(ctx, ctx.message.message_id);
            ctx.deleteMessage(ctx.session.oneMessageId).catch(() => { });
        })
            .catch((err) => {
            ctx.reply("Щось пішло не так, спробуй ще раз(/start) або звернися по допомогу до творця бота");
            console.log(err);
        });
    }
    catch (e) {
        console.log(e);
    }
});
composer.command("admin", (ctx) => {
    var _a, _b, _c;
    try {
        if (((_a = ctx.message.chat) === null || _a === void 0 ? void 0 : _a.type) == "supergroup" ||
            ((_b = ctx.message.chat) === null || _b === void 0 ? void 0 : _b.type) == "group") {
            return ctx.reply(`Я не працюю в ${(_c = ctx.message.chat) === null || _c === void 0 ? void 0 : _c.type}`);
        }
        ctx.scene.enter("logInAdminScene");
        ctx.session.id = ctx.message.message_id;
        for (let i = ctx.session.id - 100; i <= ctx.session.id; i++) {
            ctx.deleteMessage(i).catch(() => { });
        }
    }
    catch (e) {
        console.log(e);
    }
});
composer.command("reset", (ctx) => {
    var _a, _b, _c, _d;
    try {
        if (((_a = ctx.message.chat) === null || _a === void 0 ? void 0 : _a.type) == "supergroup" ||
            ((_b = ctx.message.chat) === null || _b === void 0 ? void 0 : _b.type) == "group") {
            return ctx.reply(`Я не працюю в ${(_c = ctx.message.chat) === null || _c === void 0 ? void 0 : _c.type}`);
        }
        ctx.deleteMessage(ctx.message.message_id).catch(() => { });
        if (!!((_d = ctx.session) === null || _d === void 0 ? void 0 : _d.oneMessageId)) {
            ctx.telegram.editMessageText(ctx.from.id, ctx.session.oneMessageId, "", text_1.resetDefaultValueText, telegraf_1.Markup.inlineKeyboard([
                [{ text: "Так", callback_data: "reset_yes" }],
                [{ text: "Ні", callback_data: "reset_no" }],
            ]));
        }
        else {
            ctx.reply(text_1.resetDefaultValueText, telegraf_1.Markup.inlineKeyboard([
                [{ text: "Так", callback_data: "reset_yes" }],
                [{ text: "Ні", callback_data: "reset_no" }],
            ]));
        }
        (0, helpers_1.deleteMessage)(ctx, ctx.message.message_id, ctx.session.oneMessageId);
    }
    catch (e) {
        console.log(e);
    }
});
composer.command("change_notification", async (ctx) => {
    var _a, _b, _c;
    try {
        if (((_a = ctx.message.chat) === null || _a === void 0 ? void 0 : _a.type) == "supergroup" ||
            ((_b = ctx.message.chat) === null || _b === void 0 ? void 0 : _b.type) == "group") {
            return ctx.reply(`Я не працюю в ${(_c = ctx.message.chat) === null || _c === void 0 ? void 0 : _c.type}`);
        }
        await ctx.deleteMessage().catch(() => { });
        await ctx.reply("Ти хочеш отримувати сповіщення при зміні розкладу?\n\nЦя функція поки що в тестовому режимі і може працювати погано\nЯкщо ти стикнешся з якимись проблемами, то повідом власника(посилання є в описі бота)", telegraf_1.Markup.inlineKeyboard([
            [
                telegraf_1.Markup.button.callback("Отримувати сповіщення", "changeNotificationEnable"),
            ],
            [
                telegraf_1.Markup.button.callback("Не отримувати сповіщення", "changeNotificationDisenable"),
            ],
        ]));
        (0, helpers_1.deleteMessage)(ctx, ctx.message.message_id, ctx.session.oneMessageId);
    }
    catch (e) {
        console.log(e);
    }
});
exports.default = composer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbWFuZHMuY29tcG9zZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYm90L2NvbXBvc2Vycy9jb21tYW5kcy5jb21wb3Nlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLHVDQUE0QztBQUM1QyxzREFBa0Q7QUFDbEQsa0NBQWdEO0FBQ2hELHdDQUEyQztBQUczQyxNQUFNLFFBQVEsR0FBRyxJQUFJLG1CQUFRLEVBQWlCLENBQUM7QUFFL0MsUUFBUSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxFQUFFOztJQUN0QyxJQUFJO1FBQ0YsSUFDRSxDQUFBLE1BQUEsR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLDBDQUFFLElBQUksS0FBSSxZQUFZO1lBQ3RDLENBQUEsTUFBQSxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksMENBQUUsSUFBSSxLQUFJLE9BQU8sRUFDakM7WUFDQSxPQUFPLEdBQUcsQ0FBQyxLQUFLLENBQUMsaUJBQWlCLE1BQUEsR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLDBDQUFFLElBQUksRUFBRSxDQUFDLENBQUM7U0FDN0Q7UUFFRCxNQUFNLHdCQUFVLENBQUMsZ0JBQWdCLENBQy9CLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLEVBQ3BCO1lBQ0UsR0FBRyxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUNoQixJQUFJLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVO1lBQ3pCLFNBQVMsRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVM7WUFDN0IsUUFBUSxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUTtTQUM1QixFQUNEO1lBQ0UsTUFBTSxFQUFFLElBQUk7WUFDWixHQUFHLEVBQUUsSUFBSTtZQUNULG1CQUFtQixFQUFFLElBQUk7U0FDMUIsQ0FDRjthQUNFLEtBQUssRUFBRTthQUNQLElB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