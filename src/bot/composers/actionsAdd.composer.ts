import { Composer } from "telegraf";
import { UsersModel } from "../../db/user.schema";
import {
  nextWeekText,
  todayText,
  previousWeekText,
  manualDateBtnEntry,
  changeQueryBtnText,
  allWeekBtnText,
  mainMenu,
} from "../text";
import { CustomContext } from "../custom-context";

const composer = new Composer<CustomContext>();

composer.action("Пн", (ctx) => {
  ctx.session.day = "Пн";
  oneReaction(ctx);
});

composer.action("Вт", (ctx) => {
  ctx.session.day = "Вт";
  oneReaction(ctx);
});

composer.action("Ср", (ctx) => {
  ctx.session.day = "Ср";
  oneReaction(ctx);
});

composer.action("Чт", (ctx) => {
  ctx.session.day = "Чт";
  oneReaction(ctx);
});

composer.action("Пт", (ctx) => {
  ctx.session.day = "Пт";
  oneReaction(ctx);
});

composer.action("Сб", (ctx) => {
  ctx.session.day = "Сб";
  oneReaction(ctx);
});

composer.action("Нд", (ctx) => {
  ctx.session.day = "Нд";
  oneReaction(ctx);
});

composer.action(previousWeekText, (ctx) => {
  oneReaction(ctx);
});

composer.action(nextWeekText, (ctx) => {
  oneReaction(ctx);
});

composer.action(todayText, (ctx) => {
  oneReaction(ctx);
});

composer.action(mainMenu, (ctx) => {
  try {
    ctx.answerCbQuery().catch(() => {});
    ctx.scene.enter("welcomeScene");
  } catch (e) {}
});

composer.action(changeQueryBtnText, (ctx) => {
  oneReaction(ctx);
});

composer.action(manualDateBtnEntry, (ctx) => {
  oneReaction(ctx);
});

composer.action(allWeekBtnText, (ctx) => {
  oneReaction(ctx);
});
composer.action("📌", (ctx) => {
  oneReaction(ctx);
});

function oneReaction(ctx: CustomContext) {
  try {
    ctx.session.time = 0;
    UsersModel.findById(ctx.from?.id)
      .then((result) => {
        ctx.answerCbQuery().catch(() => {});

        ctx.session.oneMessageId = Number(
          ctx.callbackQuery?.message?.message_id
        );
        ctx.session.default_value = result?.default_value;
        ctx.session.default_role = result?.default_role;
        ctx.session.default_mode = true;
        ctx.session.weekShift = 0;

        if (!ctx.session.default_value || !ctx.session.default_role)
          return ctx.scene.enter("defaultValueScene");

        ctx.scene.enter("scheduleScene");
      })
      .catch((err) => {
        ctx.reply(
          "Щось пішло не так, спробуй ще(/start) раз або звернися по допомогу до творця бота"
        );
        console.log(err);
      });
  } catch (error) {}
}

export default composer;
