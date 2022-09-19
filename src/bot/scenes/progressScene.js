const { Markup, Scenes } = require('telegraf');

const {
  progressWelcome,
  progressTextButton,
  debtsTextButton,
  noDebtsText,
  hasDebtsText,
  mainMenu,
  loadProgress,
  errorPassText,
  errorProgressText,
  errorLoginText,
  progressHelpText,
} = require('../text');
const { redisWriteData, redisGetData, redisDelData } = require('../../DB/redis.js');
const { progressParse, toMessage } = require('../../Parser/progressParse.js');

// ===================   keyboard   =========================

const choiceKeyboard = Markup.inlineKeyboard([
  [{ text: progressTextButton, callback_data: progressTextButton }],
  [{ text: debtsTextButton, callback_data: debtsTextButton }],
  [{ text: mainMenu, callback_data: mainMenu }],
]);

const welcomeKeyboard = [
  [{ text: 'Допомога', callback_data: 'help' }],
  [{ text: 'Назад', callback_data: mainMenu }],
];

const backKeyboard = [[{ text: 'Назад', callback_data: mainMenu }]];

// ===================   Welcome scene   =========================

const progressScene = new Scenes.BaseScene('progressScene');

progressScene.enter(async (ctx) => {
  try {
    if (!!(await redisGetData(ctx.from.id))?.data) {
      ctx.session.progress = await redisGetData(ctx.from.id);

      ctx.telegram.editMessageText(
        ctx.from.id,
        ctx.session.oneMessageId,
        '',
        `Оцінки ${ctx.session.progress.name}\n\n${toMessage(
          ctx.session.progress.data,
        )}\n\nТвій середній бал - ${ctx.session.progress.avarage}`,

        choiceKeyboard,
      );
      delete ctx.session.progress;
    } else {
      ctx.editMessageText(progressWelcome, {
        reply_markup: { inline_keyboard: welcomeKeyboard },
        parse_mode: 'Markdown',
        disable_web_page_preview: true,
      });
    }

    deleteMessage(ctx, ctx.session.id)
  } catch (e) {
    console.log(e);
  }
});

progressScene.command('start', async (ctx) => {
  await ctx.scene.enter('welcomeScene');

  deleteMessage(ctx, ctx.message.message_id, ctx.session.oneMessageId)
  ctx.deleteMessage(ctx.session.oneMessageId).catch((err) => { });
  ctx.session.progress = null;
});

progressScene.on('text', async (ctx) => {
  ctx.deleteMessage(ctx.message.message_id).catch((e) => { });

  ctx.telegram.editMessageText(ctx.from.id, ctx.session.oneMessageId, '', loadProgress);
  try {
    ctx.session.payload = ctx.message.text.split(' ');

    !/@ugi.edu.ua/.test(ctx.session.payload[0]) ? (ctx.session.payload[0] += '@ugi.edu.ua') : 0;

    if (ctx.session.payload.length > 2) {
      return ctx.telegram.editMessageText(
        ctx.from.id,
        ctx.session.oneMessageId,
        '',
        'Надто багато слів\nСпробуй ще раз',
        { reply_markup: { inline_keyboard: backKeyboard } },
      );
    }
    if (ctx.session.payload.length < 2) {
      return ctx.telegram.editMessageText(
        ctx.from.id,
        ctx.session.oneMessageId,
        '',
        'Надто мало слів, напевно ти написав(ла) тільки логін\nСпробуй ще раз',
        { reply_markup: { inline_keyboard: backKeyboard } },
      );
    }

    ctx.session.progress = await progressParse({
      login: ctx.session.payload[0],
      password: ctx.session.payload[1],
    });
    if (ctx.session.progress.errorLogin) {
      return ctx.telegram.editMessageText(
        ctx.from.id,
        ctx.session.oneMessageId,
        '',
        errorLoginText,
        { reply_markup: { inline_keyboard: backKeyboard } },
      );
    }
    if (ctx.session.progress.errorPass) {
      return ctx.telegram.editMessageText(
        ctx.from.id,
        ctx.session.oneMessageId,
        '',
        errorPassText,
        { reply_markup: { inline_keyboard: backKeyboard } },
      );
    }
    if (ctx.session.progress.error) {
      return ctx.telegram.editMessageText(
        ctx.from.id,
        ctx.session.oneMessageId,
        '',
        errorProgressText,
        { reply_markup: { inline_keyboard: backKeyboard } },
      );
    }

    await redisWriteData(ctx.from.id, ctx.session.progress, 60 * 60 * 24);

    ctx.telegram.editMessageText(
      ctx.from.id,
      ctx.session.oneMessageId,
      '',
      `Оцінки ${ctx.session.progress.name}\n\n${toMessage(
        ctx.session.progress.data,
      )}\n\nТвій середній бал - ${ctx.session.progress.avarage}`,

      choiceKeyboard,
    );
    delete ctx.session.progress;
  } catch (e) {
    console.log(e);
  }
});

progressScene.action(progressTextButton, async (ctx) => {
  try {
    ctx.session.progress = await redisGetData(ctx.from.id);
    if (!ctx.session.progress) {
      ctx.answerCbQuery('Дані зберігаються 24 години, тепер тобі треба перезайти', {
        show_alert: true,
      });
      return ctx.scene.enter('progressScene');
    }
    ctx.editMessageText(
      `Оцінки ${ctx.session.progress.name}\n\n${toMessage(
        ctx.session.progress.data,
      )}\n\nТвій середній бал - ${ctx.session.progress.avarage}`,
      choiceKeyboard,
    );
    ctx.answerCbQuery();
    delete ctx.session.progress;
  } catch (e) { }
});

progressScene.action(debtsTextButton, async (ctx) => {
  try {
    ctx.session.progress = await redisGetData(ctx.from.id);
    if (!ctx.session.progress) {
      ctx.answerCbQuery('Дані зберігаються 24 години, тепер тобі треба перезайти', {
        show_alert: true,
      });
      return ctx.scene.enter('progressScene');
    }
    if (!ctx.session.progress.debts.length) {
      ctx.answerCbQuery();
      return await ctx.editMessageText(
        `Борги ${ctx.session.progress.name}\n\n${noDebtsText}`,
        choiceKeyboard,
      );
    }
    ctx.answerCbQuery('Ящик пандори відкрито!');
    ctx.editMessageText(
      `Борги ${ctx.session.progress.name}\n\n${hasDebtsText}\n\n${toMessage(
        ctx.session.progress.debts,
      )}`,
      choiceKeyboard,
    );
    delete ctx.session.progress;
  } catch (e) { }
});

progressScene.action(mainMenu, async (ctx) => {
  try {
    await ctx.scene.enter('welcomeScene');
    ctx.answerCbQuery();
    ctx.session.progress = null;
  } catch (e) { }
});

progressScene.action('help', (ctx) => ctx.answerCbQuery(progressHelpText, { show_alert: true }));

module.exports = progressScene;
