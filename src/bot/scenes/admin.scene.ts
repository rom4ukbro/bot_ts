/* eslint-disable @typescript-eslint/no-empty-function */
import { Markup, Scenes } from "telegraf";
import moment from "moment";
import "moment-timezone";
moment.locale("uk");
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import {
  adminWelcome,
  mailingText,
  simpleMail,
  cbMail,
  updateMail,
  clearHistory,
  updateInfo,
} from "../text";
import { CustomContext } from "../custom-context";

import { UsersModel } from "../../db/user.schema";

const admins = String(process.env.ADMINS_ID).split(",");
const botStart = moment.tz("Europe/Zaporozhye").format("LLLL");
let sendMessages = 0;

// ===================   Keyboard   =========================

const adminsFncBtn = [
  [{ text: "Інформація", callback_data: "info" }],
  [{ text: "Розсилка", callback_data: "mailing" }],
  [{ text: "Вийти", callback_data: "close" }],
];

const mailingKeyboard = Markup.inlineKeyboard([
  [{ text: "Звичайна", callback_data: "simple" }],
  [{ text: "Зворотній відгук", callback_data: "cbMailing" }],
  [{ text: "Сповістити про оновлення", callback_data: "update" }],
  [{ text: "Назад", callback_data: "back" }],
]);

// ===================   LogIn admin scene   =========================

const logInAdminScene = new Scenes.BaseScene<CustomContext>("logInAdminScene");

logInAdminScene.enter((ctx) => {
  try {
    if (ctx.chat?.id == 548746493) return ctx.scene.enter("adminPanelScene");
    for (let i = 0; i < admins.length; i++) {
      const el = admins[i];
      if (String(ctx.from?.id) == el || ctx.from?.username == el)
        return ctx.scene.enter("adminPanelScene");
    }
    ctx.scene.enter("welcomeScene");
    return ctx
      .answerCbQuery("Ти не маєш доступу!", { show_alert: true })
      .catch(() => {});
  } catch (e) {
    console.log(e);
  }
});

// ===================   Admin scene   =========================

const adminPanelScene = new Scenes.BaseScene<CustomContext>("adminPanelScene");

adminPanelScene.enter(async (ctx) => {
  try {
    if (ctx.callbackQuery?.message?.message_id) {
      ctx.editMessageText(adminWelcome, Markup.inlineKeyboard(adminsFncBtn));
    } else {
      ctx.reply(adminWelcome, Markup.inlineKeyboard(adminsFncBtn));
    }

    const ids = await UsersModel.find().select("_id");

    ctx.session.users = ids.map((item) => item._id);
    ctx.session.info = {};
    ctx.session.info.usersCount = await UsersModel.countDocuments();
    ctx.session.info.teacherCount = await UsersModel.countDocuments({
      default_role: "teacher",
    });
    ctx.session.info.studentCount = await UsersModel.countDocuments({
      default_role: "group",
    });
    ctx.session.info.unknownCount = await UsersModel.countDocuments({
      default_role: null,
    });
    ctx.session.info.weekCount = await UsersModel.countDocuments({
      last_activity: { $gte: moment().add(-1, "weeks").format() },
    });
    ctx.session.info.activeCount = await UsersModel.countDocuments({
      $or: [
        { blocked: false },
        { blocked: { $exists: false } },
        { blocked: null },
      ],
    });
    ctx.session.info.blockCount = await UsersModel.countDocuments({
      blocked: true,
    });
    ctx.session.info.notificationCount = await UsersModel.countDocuments({
      changeNotification: true,
    });
  } catch (e) {
    console.log(e);
  }
});

adminPanelScene.action("back", (ctx) => {
  try {
    ctx.scene.enter("adminPanelScene");
    ctx.answerCbQuery().catch(() => {});
  } catch (e) {
    console.log(e);
  }
});

adminPanelScene.action("close", (ctx) => {
  try {
    ctx.scene.enter("welcomeScene");
    ctx.answerCbQuery().catch(() => {});
  } catch (e) {
    console.log(e);
  }
});

adminPanelScene.action("info", (ctx) => {
  try {
    ctx.editMessageText(
      `Бот запущено: ${moment
        .tz(botStart, "LLLL", "Europe/Zaporozhye")
        .fromNow()}\n` +
        `Дата запуску: ${moment
          .tz(botStart, "LLLL", "Europe/Zaporozhye")
          .format("LLL")}\n` +
        `Всього користувачів: ${ctx.session.info.usersCount}\n` +
        `Викладачів: ${ctx.session.info.teacherCount}\n` +
        `Студентів: ${ctx.session.info.studentCount}\n` +
        `Невизначених: ${ctx.session.info.unknownCount}\n` +
        `Користувачів за останні 7 днів: ${ctx.session.info.weekCount}\n\n` +
        `Користувачів активувало сповіщення: ${ctx.session.info.notificationCount}\n\n` +
        `Активних: ${ctx.session.info.activeCount}\n` +
        `Заблокувало: ${ctx.session.info.blockCount}\n`,
      Markup.inlineKeyboard([[{ text: "Назад", callback_data: "back" }]])
    );
    ctx.answerCbQuery().catch(() => {});
  } catch (e) {
    console.log(e);
  }
});

adminPanelScene.action("mailing", (ctx) => {
  try {
    ctx.editMessageText(mailingText, mailingKeyboard);
    ctx.answerCbQuery().catch(() => {});
  } catch (e) {
    console.log(e);
  }
});

adminPanelScene.action("simple", (ctx) => {
  try {
    ctx.scene.enter("mailingSimpleScene");
    ctx.answerCbQuery().catch(() => {});
  } catch (e) {
    console.log(e);
  }
});

adminPanelScene.action("cbMailing", (ctx) => {
  try {
    ctx.scene.enter("mailingCbScene");
    ctx.answerCbQuery().catch(() => {});
  } catch (e) {
    console.log(e);
  }
});

adminPanelScene.action("update", (ctx) => {
  try {
    ctx.scene.enter("mailingUpdateScene");
    ctx.answerCbQuery().catch(() => {});
  } catch (e) {
    console.log(e);
  }
});

// ===================   Simple mailing scene   =========================

const mailingSimpleScene = new Scenes.BaseScene<CustomContext>(
  "mailingSimpleScene"
);

mailingSimpleScene.enter((ctx) => {
  try {
    ctx.session.adId = Number(ctx.callbackQuery?.message?.message_id);
    ctx.editMessageText(simpleMail, {
      parse_mode: "Markdown",
      disable_web_page_preview: true,
      reply_markup: {
        inline_keyboard: [[{ text: "Назад", callback_data: "back" }]],
      },
    });
  } catch (e) {
    console.log(e);
  }
});

mailingSimpleScene.action("send", async (ctx) => {
  sendMessages = ctx.session.users.length;
  try {
    ctx.deleteMessage(ctx.session.delMess).catch(() => {});

    await ctx.answerCbQuery(
      "Можеш продовжувати користуватися ботом. Я дам знати, коли розсилка завершиться",
      { show_alert: true }
    );
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
      } catch (error) {
        sendMessages -= 1;
        blockIds.push(userId);
      }
    }

    await UsersModel.updateMany({ _id: { $in: blockIds } }, { blocked: true });

    await ctx.reply(`Повідомлення отримали ${sendMessages} користувачів`, {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [[{ text: "Прочитано", callback_data: "del" }]],
      },
    });
  } catch (e) {}
});

mailingSimpleScene.on("text", async (ctx) => {
  try {
    await ctx.deleteMessage(ctx.session.delMess).catch(() => {});
    ctx.session.text = ctx.message.text;
    ctx.session.delMess = ctx.message.message_id;
    await ctx.telegram
      .editMessageText(
        ctx.chat.id,
        ctx.session.adId,
        "",
        "Цей текст буде відправлено:\n\n" +
          ctx.message.text +
          "\n\nЩоб змінити просто напиши новий текст",
        {
          parse_mode: "Markdown",
          disable_web_page_preview: true,
          reply_markup: {
            inline_keyboard: [
              [{ text: "Надіслати", callback_data: "send" }],
              [{ text: "Назад", callback_data: "back" }],
            ],
          },
        }
      )
      .catch((e) => console.log(e));
  } catch (e) {
    console.log(e);
  }
});

mailingSimpleScene.action("back", (ctx) => {
  try {
    ctx.scene.enter("adminPanelScene");
    ctx.answerCbQuery().catch(() => {});
  } catch (e) {
    console.log(e);
  }
});

// ===================   Cb mailing scene   =========================

const mailingCbScene = new Scenes.BaseScene<CustomContext>("mailingCbScene");

mailingCbScene.enter((ctx) => {
  try {
    ctx.session.adId = Number(ctx?.callbackQuery?.message?.message_id);
    ctx.editMessageText(cbMail, {
      parse_mode: "Markdown",
      disable_web_page_preview: true,
      reply_markup: {
        inline_keyboard: [
          [{ text: "Зворотній зв'язок", callback_data: "cb" }],
          [{ text: "Назад", callback_data: "back" }],
        ],
      },
    });
  } catch (e) {
    console.log(e);
  }
});

mailingCbScene.action("send", async (ctx) => {
  sendMessages = ctx.session.users.length;
  try {
    ctx.deleteMessage(ctx.session.delMess).catch(() => {});

    await ctx.answerCbQuery(
      "Можеш продовжувати користуватися ботом. Я дам знати, коли розсилка завершиться",
      { show_alert: true }
    );
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
      } catch (e) {
        sendMessages -= 1;
        blockIds.push(userId);
      }
    }

    await UsersModel.updateMany({ _id: { $in: blockIds } }, { blocked: true });

    await ctx.reply(`Повідомлення отримали ${sendMessages} користувачів`, {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [[{ text: "Прочитано", callback_data: "del" }]],
      },
    });
  } catch (e) {
    console.log(e);
  }
});

mailingCbScene.on("text", (ctx) => {
  try {
    ctx.session.text = ctx.message.text;
    ctx.session.delMess = ctx.message.message_id;
    ctx.telegram.editMessageText(
      ctx.chat.id,
      ctx.session.adId,
      "",
      "Цей текст буде відправлено:\n\n" +
        ctx.message.text +
        "\n\nЩоб змінити просто напиши новий текст",
      {
        parse_mode: "Markdown",
        disable_web_page_preview: true,
        reply_markup: {
          inline_keyboard: [
            [{ text: "Надіслати", callback_data: "send" }],
            [{ text: "Назад", callback_data: "back" }],
          ],
        },
      }
    );
  } catch (e) {
    console.log(e);
  }
});

mailingCbScene.action("cbWrite", (ctx) => {
  try {
    ctx
      .answerCbQuery("Це приклад кнопки вона працюватиме після відправки", {
        show_alert: true,
      })
      .catch(() => {});
  } catch (e) {
    console.log(e);
  }
});

mailingCbScene.action("back", (ctx) => {
  try {
    ctx.scene.enter("adminPanelScene");
    ctx.answerCbQuery().catch(() => {});
  } catch (e) {
    console.log(e);
  }
});

// ===================   Update mailing scene   =========================

const mailingUpdateScene = new Scenes.BaseScene<CustomContext>(
  "mailingUpdateScene"
);

mailingUpdateScene.enter((ctx) => {
  try {
    ctx.session.adId = Number(ctx.callbackQuery?.message?.message_id);
    ctx.editMessageText(updateMail, {
      parse_mode: "Markdown",
      disable_web_page_preview: true,
      reply_markup: {
        inline_keyboard: [
          [{ text: "Надіслати", callback_data: "send" }],
          [{ text: "Назад", callback_data: "back" }],
        ],
      },
    });
  } catch (e) {
    console.log(e);
  }
});

mailingUpdateScene.action("send", async (ctx) => {
  sendMessages = ctx.session.users.length;

  try {
    await ctx.answerCbQuery(
      "Можеш продовжувати користуватися ботом. Я дам знати, коли розсилка завершиться",
      { show_alert: true }
    );
    await ctx.scene.enter("adminPanelScene");

    const blockIds = [];
    for (const userId of ctx.session.users) {
      try {
        await ctx.telegram.sendMessage(
          userId,
          updateInfo + "\n\n" + clearHistory,
          {
            parse_mode: "Markdown",
            disable_web_page_preview: true,
            reply_markup: {
              inline_keyboard: [[{ text: "Прочитано", callback_data: "del" }]],
            },
          }
        );
      } catch (error) {
        sendMessages -= 1;
        blockIds.push(userId);
      }
    }

    await UsersModel.updateMany({ _id: { $in: blockIds } }, { blocked: true });

    ctx.reply(`Повідомлення отримали ${sendMessages} користувачів`, {
      parse_mode: "Markdown",
    });
  } catch (e) {
    console.log(e);
  }
});

mailingUpdateScene.action("back", (ctx) => {
  try {
    ctx.scene.enter("adminPanelScene");
    ctx.answerCbQuery().catch(() => {});
  } catch (e) {
    console.log(e);
  }
});

export {
  logInAdminScene,
  adminPanelScene,
  mailingSimpleScene,
  mailingCbScene,
  mailingUpdateScene,
};
