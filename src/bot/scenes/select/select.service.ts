/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-empty-function */
import { CustomContext } from "../../custom-context";
import {
  studentWelcome,
  teacherWelcome,
  findQuery,
  toManyQueryFind,
  cantFindQuery,
} from "../../text";
import { getArrTeacher, getArrGroup } from "../../../parser/getGroupAndTeacher";
import { findGroup, findTeacher } from "../../../parser/search";
import { deleteMessage } from "../../helpers";
import { Markup } from "telegraf";

class SelectService {
  async enterStudent(ctx: CustomContext) {
    try {
      ctx.session.weekShift = 0;
      ctx.session.searchArr = await getArrGroup();

      ctx.editMessageText(studentWelcome);
    } catch (e) {
      console.log(e);
    }
    // Marchik Hotyn
  }

  async enterTeacher(ctx: CustomContext) {
    try {
      ctx.session.weekShift = 0;
      ctx.session.searchArr = await getArrTeacher();
      ctx.editMessageText(teacherWelcome);
    } catch (e) {
      console.log(e);
    }
  }

  async startCommand(ctx: CustomContext) {
    try {
      ctx.session.weekShift = 0;
      await ctx.scene.enter("welcomeScene");
      deleteMessage(ctx, Number(ctx.message?.message_id));
    } catch (e) {
      console.log(e);
    }
  }

  async textStudent(ctx: CustomContext) {
    new SelectService().searchFnc("group", ctx);
  }

  async textTeacher(ctx: CustomContext) {
    new SelectService().searchFnc("group", ctx);
  }

  searchFnc(mode: string, ctx: CustomContext) {
    try {
      ctx.session.mode = mode;
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
          ctx.message?.text
        );
      }
      if (mode === "teacher") {
        ctx.session.resultArr = findTeacher(
          ctx.session.searchArr,
          // @ts-ignore
          ctx.message?.text
        );
      }
      if (ctx.session.resultArr.length === 0) {
        ctx.session.id = Number(ctx.message?.message_id);
        for (let i = ctx.session.id; i >= ctx.session.id - 100; i--) {
          if (i != ctx.session.oneMessageId)
            ctx.deleteMessage(i).catch(() => {});
        }
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
        ctx.session.id = Number(ctx.message?.message_id);
        for (let i = ctx.session.id; i >= ctx.session.id - 100; i--) {
          if (i != ctx.session.oneMessageId)
            ctx.deleteMessage(i).catch(() => {});
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
}

export default new SelectService();
