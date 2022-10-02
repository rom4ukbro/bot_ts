/* eslint-disable @typescript-eslint/no-empty-function */
import moment from "moment";
import { Composer } from "telegraf";
import { UsersModel } from "../../db/user.schema";
import { CustomContext } from "../custom-context";
import { deleteMessage } from "../helpers";

const composer = new Composer<CustomContext>();

composer.action("del", (ctx) => {
  try {
    ctx.answerCbQuery().catch(() => {});
    ctx.deleteMessage().catch(() => {});
  } catch (e) {}
});

composer.action("reset_yes", async (ctx) => {
  try {
    UsersModel.findOneAndUpdate(
      { _id: ctx.from?.id },
      {
        default_value: null,
        default_role: null,
      }
    )
      .clone()
      .then(async () => {
        await ctx.scene.enter("defaultValueScene");
        ctx.answerCbQuery("Все пройшло успішно!\nЗаповни нові дані", {
          show_alert: true,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (error) {}
});

composer.action("reset_no", (ctx) => {
  try {
    ctx.answerCbQuery().catch(() => {});
    ctx.scene.enter("welcomeScene");
  } catch (error) {}
});

composer.action("cbWrite", (ctx) => {
  try {
    ctx.answerCbQuery().catch(() => {});
    ctx.scene.enter("cbScene");
  } catch (error) {}
});

composer.action("changeNotificationEnable", (ctx) => {
  try {
    ctx.deleteMessage();
    UsersModel.updateOne(
      { _id: ctx.from?.id },
      {
        changeNotification: true,
      }
    )
      .clone()
      .then(async () => {
        ctx.answerCbQuery("Сповіщення ввімкнуто");
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (error) {}
});

composer.action("changeNotificationDisenable", (ctx) => {
  try {
    ctx.deleteMessage();
    UsersModel.updateOne(
      { _id: ctx.from?.id },
      {
        changeNotification: false,
      }
    )
      .clone()
      .then(async () => {
        ctx.answerCbQuery("Сповіщення вимкнуто");
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (error) {}
});

composer.action(/watchChanges_.+/, async (ctx) => {
  try {
    ctx.answerCbQuery().catch(() => {});
    const data = ctx.callbackQuery.data?.split("_")[1].split("//")[0] || "";
    const day = moment(data, "DD.MM.YYYY").format("dd");

    ctx.session.day = day.charAt(0).toUpperCase() + day.charAt(1);
    ctx.session.weekShift = 0;
    ctx.session.weekMode = false;
    ctx.session.value = String(ctx.callbackQuery.data?.split("//")[1]);
    ctx.session.mode = String(ctx.callbackQuery.data?.split("//")[2]);
    ctx.session.oneMessageId = Number(ctx.callbackQuery.message?.message_id);

    await ctx.scene.enter("scheduleScene");
    deleteMessage(
      ctx,
      Number(ctx.callbackQuery.message?.message_id),
      ctx.session.oneMessageId,
      200
    );
  } catch (error) {}
});

export default composer;
