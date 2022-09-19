import { deleteMessage } from "../../helpers";
import { chooseWelcomeText } from "../../text";
import { CustomContext } from "../../custom-context";
import { choiceKeyboard } from "./choose.keyboard";


class ChooseService {
  async enter(ctx: CustomContext) {
    try {
      if (ctx?.callbackQuery?.message?.message_id)
        ctx.editMessageText(chooseWelcomeText, choiceKeyboard());
      else ctx.reply(chooseWelcomeText, choiceKeyboard());
      deleteMessage(ctx, Number(ctx?.callbackQuery?.message?.message_id || ctx.message?.message_id))
    } catch (e) {
      console.log(e);
    }
  }

  async student(ctx: CustomContext) {
    try {
      ctx.session.oneMessageId = Number(ctx.callbackQuery?.message?.message_id);
      ctx.scene.enter('studentScene');
    } catch (e) {
      console.log(e);
    }
  }

  async teacher(ctx: CustomContext) {
    try {
      ctx.session.oneMessageId = Number(ctx.callbackQuery?.message?.message_id);
      ctx.scene.enter('teacherScene');
    } catch (e) {
      console.log(e);
    }
  }

  async back(ctx: CustomContext) {
    try {
      await ctx.scene.enter('welcomeScene');
      ctx.answerCbQuery();
    } catch (e) { }
  }
}

export default new ChooseService();
