/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Markup, Scenes } from "telegraf";
import {
  studentWelcome,
  teacherWelcome,
  findQuery,
  toManyQueryFind,
  cantFindQuery,
} from "../../text";
import { getArrTeacher, getArrGroup } from "../../../parser/getGroupAndTeacher";
import { findGroup, findTeacher } from "../../../parser/search";
import {
  choiceStudentText,
  choiceTeacherText,
  defaultValueText,
} from "../../text";
import { Users } from "../../../db/user.schema";
import { deleteMessage } from "../../helpers";
import { CustomContext } from "../../custom-context";
import { choiceKeyboard } from "./default-value.keyboard";

// ===================   defaultValue scene   =========================

const defaultValueScene = new Scenes.BaseScene<CustomContext>(
  "defaultValueScene"
);

defaultValueScene.enter(async (ctx) => {
  try {
    if (ctx.callbackQuery?.message?.message_id)
      await ctx.editMessageText(defaultValueText, choiceKeyboard).catch(() => {
        //
      });
    else {
      await ctx.reply(defaultValueText, choiceKeyboard);
      deleteMessage(ctx, Number(ctx.message?.message_id));
    }
  } catch (e) {
    console.log(e);
  }
});

defaultValueScene.action(choiceStudentText, async (ctx) => {
  try {
    ctx.session.oneMessageId = Number(ctx.callbackQuery?.message?.message_id);
    ctx.session.weekShift = 0;
    ctx.session.searchArr = await getArrGroup();
    ctx.session.mode = "group";

    ctx.editMessageText(studentWelcome);
  } catch (e) {
    console.log(e);
  }
});

defaultValueScene.action(choiceTeacherText, async (ctx) => {
  try {
    ctx.session.oneMessageId = Number(ctx.callbackQuery?.message?.message_id);
    ctx.session.weekShift = 0;
    ctx.session.searchArr = await getArrTeacher();
    ctx.session.mode = "teacher";

    ctx.editMessageText(teacherWelcome);
  } catch (e) {
    console.log(e);
  }
});

defaultValueScene.action("back", async (ctx) => {
  try {
    await ctx.scene.enter("welcomeScene");
    ctx.answerCbQuery();
  } catch (e) {}
});

defaultValueScene.command("start", async (ctx) => {
  try {
    ctx.session.weekShift = 0;

    await ctx.scene.enter("chooseScene");

    deleteMessage(ctx, ctx.message.message_id);
  } catch (e) {
    console.log(e);
  }
});

defaultValueScene.on("text", (ctx) => {
  try {
    if (!ctx.session.mode) {
      ctx.deleteMessage(ctx.message.message_id).catch(() => {});
    } else if (ctx.session.mode == "group") {
      searchFnc("group", ctx);
    } else if (ctx.session.mode == "teacher") {
      searchFnc("teacher", ctx);
    }
  } catch (e) {}
});

// ===================   Helper`s function   =========================

function searchFnc(mode: string, ctx: CustomContext) {
  try {
    ctx.session.id = Number(ctx.message?.message_id);
    for (let i = ctx.session.id - 100; i < ctx.session.id; i++) {
      if (i != ctx.session.oneMessageId) ctx.deleteMessage(i).catch(() => {});
    }
    if (ctx.session.searchArr[0] === "error") {
      ctx.deleteMessage(ctx.message?.message_id).catch(() => {});
      return ctx.telegram.editMessageText(
        ctx.from?.id,
        ctx.session.oneMessageId,
        "",
        "Сталася помилка з сайтом, спробуй пізніше.\nНатисни /start"
      );
    }

    if (mode === "group") {
      ctx.session.resultArr = findGroup(
        ctx.session.searchArr,
        // @ts-ignore
        ctx.message.text
      );
    }
    if (mode === "teacher") {
      ctx.session.resultArr = findTeacher(
        ctx.session.searchArr,
        // @ts-ignore
        ctx.message.text
      );
    }
    if (ctx.session.resultArr.length === 0) {
      deleteMessage(
        ctx,
        Number(ctx.message?.message_id),
        ctx.session.oneMessageId
      );
      return ctx.telegram
        .editMessageText(
          ctx.from?.id,
          ctx.session.oneMessageId,
          "",
          cantFindQuery
        )
        .catch(() => {});
    }
    if (ctx.session.resultArr.length === 1) {
      ctx.session.value = ctx.session.resultArr[0];

      Users.findOneAndUpdate(
        { _id: ctx.from?.id },
        {
          default_value: ctx.session.resultArr[0],
          default_role: mode,
        },
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
        },
        (error) => {
          if (error) return console.log(error);
        }
      );

      ctx.session.default_mode = true;
      ctx.session.default_value = ctx.session.resultArr[0];
      ctx.session.default_role = mode;

      ctx.session.id = Number(ctx.message?.message_id);
      for (let i = ctx.session.id; i >= ctx.session.id - 100; i--) {
        if (i != ctx.session.oneMessageId) ctx.deleteMessage(i).catch(() => {});
      }
      return ctx.scene.enter("scheduleScene");
    }
    if (
      ctx.session.resultArr.length <= 100 &&
      ctx.session.resultArr.length !== 1
    ) {
      return ctx.reply(
        findQuery,
        Markup.keyboard(ctx.session.resultArr, { columns: 2 }).oneTime(true)
      );
    }
    if (ctx.session.resultArr.length > 100) {
      ctx.session.resultArr = ctx.session.resultArr.slice(0, 100);
      return ctx.reply(
        toManyQueryFind,
        Markup.keyboard(ctx.session.resultArr, { columns: 2 }).oneTime(true)
      );
    }
  } catch (e) {
    console.log(e);
  }
}

export { defaultValueScene };
