/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-empty-function */
import moment from "moment";
import emoji from "node-emoji";
import { CustomContext } from "../../custom-context";
import {
  errorLoadText,
  loadSchedule,
  fullDays,
  weekDaysBtn,
  aboutText,
  changeQueryText,
  allWeekBtnText,
  floodText,
} from "../../text";
import {
  parse,
  toMessage,
  toWeekMessage,
} from "../../../parser/scheduleParse.js";
import {
  redisWriteData,
  redisGetData,
  redisDelData,
} from "../../../db/redis.js";
import { scheduleKeyboard } from "./schedule.keyboard";
import { Markup } from "telegraf";
import { choiceKeyboard } from "../choose/choose.keyboard";

const ttl = Number(process.env.TIME_TO_LIVE) || 3600 * 2;

const checkBtn = emoji.get(":pushpin:");

class ScheduleService {
  async enter(ctx: CustomContext) {
    try {
      if (!!ctx.session.default_mode) {
        ctx.session.value = String(ctx.session.default_value);
        ctx.session.mode = String(ctx.session.default_role);
        ctx.session.space = " ";
      }

      delete ctx.session.default_mode;

      if (!ctx.session.day) {
        if (moment().format("LT") > "18:00") {
          ctx.session.day =
            moment().add(1, "day").format("dd").charAt(0).toUpperCase() +
            moment().add(1, "day").format("dd").charAt(1);

          if (ctx.session.day == "Пн") ctx.session.weekShift += 1;
        } else
          ctx.session.day =
            moment().format("dd").charAt(0).toUpperCase() +
            moment().format("dd").charAt(1);
      }

      if (
        !(await redisGetData(ctx.session.value + "_" + ctx.session.weekShift))
      ) {
        ctx.telegram
          .editMessageText(
            ctx.from?.id,
            ctx.session.oneMessageId,
            "",
            loadSchedule
          )
          .catch(() => {});

        await redisWriteData(
          ctx.session.value + "_" + ctx.session.weekShift,
          await parse({
            mode: ctx.session.mode,
            value: ctx.session.value,
            weekShift: ctx.session.weekShift,
          }),
          ttl
        );
      }

      if (
        (await redisGetData(ctx.session.value + "_" + ctx.session.weekShift))
          ?.error == true
      ) {
        await redisDelData(ctx.session.value + "_" + ctx.session.weekShift);
        return ctx.telegram.editMessageText(
          ctx.from?.id,
          ctx.session.oneMessageId,
          "",
          errorLoadText,
          Markup.inlineKeyboard([
            [{ text: "Спробувати ще раз", callback_data: "again" }],
          ])
        );
      }

      if (!ctx.session.weekMode) {
        ctx.session.scheduleKeyboard = JSON.parse(
          JSON.stringify(scheduleKeyboard)
        );

        ctx.session.weekDaysBtn = [...weekDaysBtn];
        ctx.session.weekDaysBtn[
          ctx.session.weekDaysBtn.findIndex(
            (el: any) => el.text == ctx.session.day
          )
        ] = {
          text: checkBtn,
          callback_data: checkBtn,
        };
        ctx.session.scheduleKeyboard[0] = ctx.session.weekDaysBtn;
        // @ts-ignore
        ctx.session.fulDay = fullDays[ctx.session.day];
        ctx.session.scheduleKeyboard[2][1] = {
          text: allWeekBtnText,
          callback_data: allWeekBtnText,
        };
        ctx.telegram
          .editMessageText(
            ctx.from?.id,
            ctx.session.oneMessageId,
            "",
            toMessage(
              await redisGetData(
                ctx.session.value + "_" + ctx.session.weekShift
              ),
              ctx.session.fulDay,
              ctx.session.value,
              String(ctx.session.space)
            ),
            {
              parse_mode: "Markdown",
              disable_web_page_preview: true,
              reply_markup: { inline_keyboard: ctx.session.scheduleKeyboard },
            }
          )
          .catch((err) => {
            console.log(err);
          });
        delete ctx.session.space;
      } else {
        new ScheduleService().allWeek(ctx);
      }
    } catch (e) {
      console.log(e);
    }
  }

  async statement(ctx: CustomContext) {
    try {
      ctx.session.oneMessageId = Number(ctx.callbackQuery?.message?.message_id);

      ctx.scene.enter("statementScene");
      ctx.answerCbQuery().catch(() => {});
    } catch (e) {
      console.log(e);
    }
  }

  async day(ctx: CustomContext) {
    ctx.session.weekMode = false;
    new ScheduleService().daySchedule(String(ctx.callbackQuery?.data), ctx);
  }

  async previousWeek(ctx: CustomContext) {
    try {
      ctx.session.weekShift -= 1;
      await ctx.scene.enter("scheduleScene");
      ctx.answerCbQuery().catch(() => {});
    } catch (e) {
      ctx.answerCbQuery("Ой, сталася помилка. Спробуй ще раз").catch(() => {});
      console.log(e);
    }
  }

  async nextWeek(ctx: CustomContext) {
    try {
      ctx.session.weekShift += 1;
      await ctx.scene.enter("scheduleScene");
      ctx.answerCbQuery().catch(() => {});
    } catch (e) {
      ctx.answerCbQuery("Ой, сталася помилка. Спробуй ще раз").catch(() => {});
      console.log(e);
    }
  }

  async today(ctx: CustomContext) {
    try {
      ctx.session.weekMode = false;
      ctx.session.day =
        moment().format("dd").charAt(0).toUpperCase() +
        moment().format("dd").charAt(1);
      ctx.session.weekShift = 0;
      await ctx.scene.enter("scheduleScene");
      ctx.answerCbQuery().catch(() => {});
    } catch (e) {
      ctx.answerCbQuery("Ой, сталася помилка. Спробуй ще раз").catch(() => {});
      console.log(e);
    }
  }

  async mainMenu(ctx: CustomContext) {
    try {
      await ctx.scene.enter("welcomeScene");
      ctx.answerCbQuery().catch(() => {});
    } catch (e) {
      ctx.answerCbQuery("Ой, сталася помилка. Спробуй ще раз").catch(() => {});
      console.log(e);
    }
  }

  async changeQuery(ctx: CustomContext) {
    try {
      await ctx.editMessageText(changeQueryText, choiceKeyboard());
      ctx.answerCbQuery().catch(() => {});
    } catch (e) {
      ctx.answerCbQuery("Ой, сталася помилка. Спробуй ще раз").catch(() => {});
      console.log(e);
    }
  }

  async choiceStudent(ctx: CustomContext) {
    try {
      ctx.session.oneMessageId = Number(ctx.callbackQuery?.message?.message_id);
      await ctx.scene.enter("studentScene");
      ctx.answerCbQuery().catch(() => {});
    } catch (e) {
      ctx.answerCbQuery("Ой, сталася помилка. Спробуй ще раз").catch(() => {});
      console.log(e);
    }
  }

  async choiceTeacher(ctx: CustomContext) {
    try {
      ctx.session.oneMessageId = Number(ctx.callbackQuery?.message?.message_id);
      await ctx.scene.enter("teacherScene");
      ctx.answerCbQuery().catch(() => {});
    } catch (e) {
      ctx.answerCbQuery("Ой, сталася помилка. Спробуй ще раз").catch(() => {});
      console.log(e);
    }
  }

  async manualDate(ctx: CustomContext) {
    try {
      ctx.scene.enter("writeDateScene");
      ctx.answerCbQuery().catch(() => {});
    } catch (e) {
      ctx.answerCbQuery("Ой, сталася помилка. Спробуй ще раз").catch(() => {});
      console.log(e);
    }
  }

  async about(ctx: CustomContext) {
    try {
      await ctx.editMessageText(
        aboutText,
        Markup.inlineKeyboard([[{ text: "Назад", callback_data: "back" }]])
      );
      ctx.answerCbQuery().catch(() => {});
    } catch (e) {
      ctx.answerCbQuery("Ой, сталася помилка. Спробуй ще раз").catch(() => {});
      console.log(e);
    }
  }

  async allWeek(ctx: CustomContext) {
    try {
      ctx.session.weekMode = true;
      ctx.session.scheduleKeyboard = JSON.parse(
        JSON.stringify(scheduleKeyboard)
      );
      ctx.session.weekDaysBtn = [...weekDaysBtn];
      ctx.session.scheduleKeyboard[0] = ctx.session.weekDaysBtn;
      ctx.session.scheduleKeyboard[2][1] = {
        text: allWeekBtnText + emoji.get(":pushpin:"),
        callback_data: allWeekBtnText + emoji.get(":pushpin:"),
      };
      await ctx.telegram.editMessageText(
        ctx.from?.id,
        ctx.session.oneMessageId,
        "",
        toWeekMessage(
          await redisGetData(ctx.session.value + "_" + ctx.session.weekShift),
          ctx.session.fulDay,
          ctx.session.value
        ),
        {
          parse_mode: "Markdown",
          disable_web_page_preview: true,
          reply_markup: { inline_keyboard: ctx.session.scheduleKeyboard },
        }
      );

      ctx.answerCbQuery().catch(() => {});
    } catch (e) {
      ctx.answerCbQuery("Ой, сталася помилка. Спробуй ще раз").catch(() => {});
      console.log(e);
    }
  }

  async again(ctx: CustomContext) {
    try {
      await redisDelData(ctx.session.value + "_" + ctx.session.weekShift);
      ctx.scene.enter("scheduleScene");
    } catch (e) {}
  }

  async daySchedule(day: string, ctx: CustomContext) {
    try {
      ctx.session.time = ctx.session.time || 0;
      setTimeout(() => {
        ctx.session.time = 0;
      }, 500);
      if (ctx.session.time !== 0)
        return ctx
          .answerCbQuery(floodText, { show_alert: true })
          .catch(() => {});
      ctx.session.time = 1;

      ctx.session.scheduleKeyboard = JSON.parse(
        JSON.stringify(scheduleKeyboard)
      );
      ctx.session.weekDaysBtn = [...weekDaysBtn];
      ctx.session.day = day;
      ctx.session.weekDaysBtn[
        ctx.session.weekDaysBtn.findIndex(
          (el: any) => el.text == ctx.session.day
        )
      ] = {
        text: checkBtn,
        callback_data: checkBtn,
      };
      ctx.session.scheduleKeyboard[0] = ctx.session.weekDaysBtn;
      ctx.session.scheduleKeyboard[2][1] = {
        text: allWeekBtnText,
        callback_data: allWeekBtnText,
      };
      // @ts-ignore
      ctx.session.fulDay = fullDays[ctx.session.day];

      if (
        !(await redisGetData(ctx.session.value + "_" + ctx.session.weekShift))
      )
        return ctx.scene.enter("scheduleScene");
      await ctx.editMessageText(
        toMessage(
          await redisGetData(ctx.session.value + "_" + ctx.session.weekShift),
          ctx.session.fulDay,
          ctx.session.value,
          ""
        ),
        {
          parse_mode: "Markdown",
          disable_web_page_preview: true,
          reply_markup: { inline_keyboard: ctx.session.scheduleKeyboard },
        }
      );
      ctx.answerCbQuery().catch(() => {});
    } catch (e) {
      ctx.answerCbQuery("Ой, сталася помилка. Спробуй ще раз").catch(() => {});
      console.log(e);
    }
  }
}

export default new ScheduleService();
