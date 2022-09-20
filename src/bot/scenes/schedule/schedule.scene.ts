/* eslint-disable @typescript-eslint/no-empty-function */
import { Scenes } from "telegraf";
import emoji from "node-emoji";
import moment from "moment";
import "moment-timezone";
import dotenv from "dotenv";

import { CustomContext } from "../../custom-context";
import {
  choiceStudentText,
  choiceTeacherText,
  nextWeekText,
  todayText,
  previousWeekText,
  manualDateBtnEntry,
  changeQueryBtnText,
  allWeekBtnText,
  aboutBtnText,
  enterDateText,
  errorDateText,
  mainMenu,
} from "../../text";
import { activity, switchDay } from "../../helpers";
import scheduleService from "./schedule.service";

dotenv.config({ path: "./.env" });
moment.locale("uk");

const scheduleScene = new Scenes.BaseScene<CustomContext>("scheduleScene");

scheduleScene.use(async (ctx, next) => {
  activity(ctx);
  next();
});

const checkBtn = emoji.get(":pushpin:");

scheduleScene.enter(scheduleService.enter);

scheduleScene.action("again", scheduleService.again);

scheduleScene.action(checkBtn, (ctx) => ctx.answerCbQuery().catch(() => {}));
scheduleScene.action("Пн", scheduleService.day);
scheduleScene.action("Вт", scheduleService.day);
scheduleScene.action("Ср", scheduleService.day);
scheduleScene.action("Чт", scheduleService.day);
scheduleScene.action("Пт", scheduleService.day);
scheduleScene.action("Сб", scheduleService.day);
scheduleScene.action("Нд", scheduleService.day);

scheduleScene.action(previousWeekText, scheduleService.previousWeek);
scheduleScene.action(nextWeekText, scheduleService.nextWeek);
scheduleScene.action(todayText, scheduleService.today);

scheduleScene.action(mainMenu, scheduleService.mainMenu);

scheduleScene.action(changeQueryBtnText, scheduleService.changeQuery);
scheduleScene.action(choiceStudentText, scheduleService.choiceStudent);
scheduleScene.action(choiceTeacherText, scheduleService.choiceTeacher);

scheduleScene.action(manualDateBtnEntry, scheduleService.manualDate);

scheduleScene.action(aboutBtnText, scheduleService.about);

scheduleScene.action(allWeekBtnText, scheduleService.allWeek);

scheduleScene.action("back", async (ctx) => {
  try {
    await ctx.scene.enter("scheduleScene");
    ctx.answerCbQuery().catch(() => {});
  } catch (e) {
    ctx.answerCbQuery("Ой, сталася помилка. Спробуй ще раз").catch(() => {});
    console.log(e);
  }
});

scheduleScene.action(checkBtn, async (ctx) => {
  try {
    await ctx.scene.enter("scheduleScene");
    ctx.answerCbQuery().catch(() => {});
  } catch (e) {
    ctx.answerCbQuery("Ой, сталася помилка. Спробуй ще раз").catch(() => {});
    console.log(e);
  }
});

// ===================   Write date Scene   =========================

const writeDateScene = new Scenes.BaseScene<CustomContext>("writeDateScene");

writeDateScene.enter((ctx) => {
  try {
    ctx.editMessageText(enterDateText, {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [[{ text: "Назад", callback_data: "back" }]],
      },
    });
  } catch (e) {
    console.log(e);
  }
});

writeDateScene.command("start", async (ctx) => {
  try {
    ctx.session.weekShift = 0;

    await ctx.scene.enter("chooseScene");

    ctx.session.id = ctx.message.message_id;
    for (let i = ctx.session.id - 100; i <= ctx.session.id; i++) {
      ctx.deleteMessage(i).catch(() => {});
    }
  } catch (e) {
    ctx.answerCbQuery("Ой, сталася помилка. Спробуй ще раз").catch(() => {});
    console.log(e);
  }
});

writeDateScene.on("text", (ctx) => {
  try {
    if (!moment(ctx.message.text).isValid()) {
      ctx.deleteMessage(ctx.message.message_id).catch(() => {});
      return ctx.telegram
        .editMessageText(
          ctx.from.id,
          ctx.session.oneMessageId,
          "",
          errorDateText,
          {
            parse_mode: "Markdown",
            reply_markup: {
              inline_keyboard: [[{ text: "Назад", callback_data: "back" }]],
            },
          }
        )
        .catch(() => {});
    }
    ctx.deleteMessage(ctx.message.message_id).catch(() => {});

    ctx.session.weekShift = Math.round(
      (switchDay(
        moment
          .tz(ctx.message.text, "DD.MM.YYYY", "Europe/Zaporozhye")
          .format("dddd"),
        moment
          .tz(ctx.message.text, "DD.MM.YYYY", "Europe/Zaporozhye")
          .format("L")
      ) -
        switchDay(
          moment.tz("Europe/Zaporozhye").format("dddd"),
          moment.tz("Europe/Zaporozhye").format("L")
        )) /
        1000 /
        60 /
        60 /
        24 /
        7
    );
    ctx.session.day =
      moment
        .tz(ctx.message.text, "DD.MM.YYYY", "Europe/Zaporozhye")
        .format("dd")
        .charAt(0)
        .toUpperCase() +
      moment
        .tz(ctx.message.text, "DD.MM.YYYY", "Europe/Zaporozhye")
        .format("dd")
        .charAt(1);
    ctx.scene.enter("scheduleScene");
  } catch (e) {
    console.log(e);
  }
});

writeDateScene.action("back", (ctx) => {
  try {
    ctx.scene.enter("scheduleScene");
    ctx.answerCbQuery().catch(() => {});
  } catch (e) {
    ctx.answerCbQuery("Ой, сталася помилка. Спробуй ще раз").catch(() => {});
    console.log(e);
  }
});

export { scheduleScene, writeDateScene };
