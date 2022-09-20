import { deleteMessage } from "../../helpers";
import { welcomeText } from "../../text";
import { Users } from "../../../db/user.schema";
import { CustomContext } from "../../custom-context";
import { choiceKeyboard } from "./welcome.keyboard";

class WelcomeService {
  async enter(ctx: CustomContext) {
    try {
      if (ctx?.callbackQuery?.message?.message_id) {
        ctx.editMessageText(welcomeText, choiceKeyboard()).catch((err) => {
          ctx.editMessageText(welcomeText + ":", choiceKeyboard());
        });
      } else {
        ctx.reply(welcomeText, choiceKeyboard());
        deleteMessage(
          ctx,
          Number(ctx.message?.message_id),
          ctx.session.oneMessageId
        );
      }
    } catch (e) {}
  }

  async statement(ctx: CustomContext) {
    try {
      ctx.session.oneMessageId = Number(ctx.callbackQuery?.message?.message_id);

      ctx.scene.enter("statementScene");
      ctx.answerCbQuery();
    } catch (e) {
      console.log(e);
    }
  }

  async schedule(ctx: CustomContext) {
    try {
      ctx.answerCbQuery();

      ctx.session.oneMessageId = Number(ctx.callbackQuery?.message?.message_id);

      if (!!ctx.session.value && !!ctx.session.mode) {
        ctx.scene.enter("scheduleScene");
      } else if (!ctx.session.default_value || !ctx.session.default_role) {
        await Users.findOne({ _id: ctx.from?.id })
          .then(async (user) => {
            if (!user?.default_value || !user?.default_role) {
              return ctx.scene.enter("defaultValueScene");
            }

            ctx.session.default_value = user.default_value;
            ctx.session.default_role = user.default_role;
            ctx.session.weekShift = 0;
          })
          .catch((err) => {});

        if (ctx.session.default_value && ctx.session.default_role) {
          ctx.session.default_mode = true;
          return ctx.scene.enter("scheduleScene");
        }

        return ctx.scene.enter("defaultValueScene");
      } else if (ctx.session.default_value && ctx.session.default_role) {
        ctx.session.default_mode = true;
        ctx.scene.enter("scheduleScene");
      } else {
        ctx.scene.enter("chooseScene");
      }
    } catch (e) {
      console.log(e);
    }
  }

  async progress(ctx: CustomContext) {
    try {
      return ctx.answerCbQuery("Це поки що не доступно :< Я працюю над цим ");
      ctx.session.oneMessageId = Number(ctx.callbackQuery?.message?.message_id);
      ctx.scene.enter("progressScene");
    } catch (e) {
      console.log(e);
    }
  }
}

export default new WelcomeService();
