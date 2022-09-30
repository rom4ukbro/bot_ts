/* eslint-disable @typescript-eslint/no-empty-function */
import { Composer, Markup } from "telegraf";
import { UsersModel } from "../../db/user.schema";
import { resetDefaultValueText } from "../text";
import { deleteMessage } from "../helpers";
import { CustomContext } from "../custom-context";

const composer = new Composer<CustomContext>();

composer.command("start", async (ctx) => {
  try {
    if (
      ctx.message.chat?.type == "supergroup" ||
      ctx.message.chat?.type == "group"
    ) {
      return ctx.reply(`Я не працюю в ${ctx.message.chat?.type}`);
    }

    await UsersModel.findOneAndUpdate(
      { _id: ctx.from.id },
      {
        _id: ctx.from.id,
        name: ctx.from.first_name,
        last_name: ctx.from.last_name,
        username: ctx.from.username,
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    )
      .clone()
      .then(async (result) => {
        ctx.session.default_value = result?.default_value;
        ctx.session.default_role = result?.default_role;
        ctx.session.weekShift = 0;

        await ctx.scene.enter("welcomeScene");

        deleteMessage(ctx, ctx.message.message_id);
        ctx.deleteMessage(ctx.session.oneMessageId).catch(() => {});
      })
      .catch((err) => {
        ctx.reply(
          "Щось пішло не так, спробуй ще раз(/start) або звернися по допомогу до творця бота"
        );
        console.log(err);
      });
  } catch (e) {
    console.log(e);
  }
});

composer.command("admin", (ctx) => {
  try {
    if (
      ctx.message.chat?.type == "supergroup" ||
      ctx.message.chat?.type == "group"
    ) {
      return ctx.reply(`Я не працюю в ${ctx.message.chat?.type}`);
    }

    ctx.scene.enter("logInAdminScene");

    ctx.session.id = ctx.message.message_id;
    for (let i = ctx.session.id - 100; i <= ctx.session.id; i++) {
      ctx.deleteMessage(i).catch(() => {});
    }
  } catch (e) {
    console.log(e);
  }
});

composer.command("reset", (ctx) => {
  try {
    if (
      ctx.message.chat?.type == "supergroup" ||
      ctx.message.chat?.type == "group"
    ) {
      return ctx.reply(`Я не працюю в ${ctx.message.chat?.type}`);
    }

    ctx.deleteMessage(ctx.message.message_id).catch(() => {});
    if (!!ctx.session?.oneMessageId) {
      ctx.telegram.editMessageText(
        ctx.from.id,
        ctx.session.oneMessageId,
        "",
        resetDefaultValueText,
        Markup.inlineKeyboard([
          [{ text: "Так", callback_data: "reset_yes" }],
          [{ text: "Ні", callback_data: "reset_no" }],
        ])
      );
    } else {
      ctx.reply(
        resetDefaultValueText,
        Markup.inlineKeyboard([
          [{ text: "Так", callback_data: "reset_yes" }],
          [{ text: "Ні", callback_data: "reset_no" }],
        ])
      );
    }

    deleteMessage(ctx, ctx.message.message_id, ctx.session.oneMessageId);
  } catch (e) {
    console.log(e);
  }
});

composer.command("change_notification", async (ctx) => {
  try {
    if (
      ctx.message.chat?.type == "supergroup" ||
      ctx.message.chat?.type == "group"
    ) {
      return ctx.reply(`Я не працюю в ${ctx.message.chat?.type}`);
    }

    await ctx.deleteMessage().catch(() => {});
    await ctx.reply(
      "Ти хочеш отримувати сповіщення при зміні розкладу?\n\nЦя функція поки що в тестовому режимі і може працювати погано\nЯкщо ти стикнешся з якимись проблемами, то повідом власника(посилання є в описі бота)",
      Markup.inlineKeyboard([
        [
          Markup.button.callback(
            "Отримувати сповіщення",
            "changeNotificationEnable"
          ),
        ],
        [
          Markup.button.callback(
            "Не отримувати сповіщення",
            "changeNotificationDisenable"
          ),
        ],
      ])
    );

    deleteMessage(ctx, ctx.message.message_id, ctx.session.oneMessageId);
  } catch (e) {
    console.log(e);
  }
});

export default composer;
