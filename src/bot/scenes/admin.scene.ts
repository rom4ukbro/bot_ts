import { Markup, Scenes } from 'telegraf';
import moment from 'moment';
import 'moment-timezone';
moment.locale('uk');
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });
import { adminWelcome, mailingText, simpleMail, cbMail, updateMail, clearHistory, updateInfo } from '../text';
import { CustomContext } from '../custom-context';

import { Users } from '../../db/user.schema';

const admins = String(process.env.ADMINS_ID).split(',');
const botStart = moment.tz("Europe/Zaporozhye").format('LLLL');
var sendMessages = 0;

// ===================   Keyboard   =========================

const adminsFncBtn = [
  [{ text: 'Інформація', callback_data: 'info' }],
  [{ text: 'Розсилка', callback_data: 'mailing' }],
  [{ text: 'Вийти', callback_data: 'close' }],
];

const mailingKeyboard = Markup.inlineKeyboard([
  [{ text: 'Звичайна', callback_data: 'simple' }],
  [{ text: 'Зворотній відгук', callback_data: 'cb' }],
  [{ text: 'Сповістити про оновлення', callback_data: 'update' }],
  [{ text: 'Назад', callback_data: 'back' }],
]);

// ===================   LogIn admin scene   =========================

const logInAdminScene = new Scenes.BaseScene<CustomContext>('logInAdminScene');

logInAdminScene.enter((ctx) => {
  try {
    if (ctx.chat?.id == 548746493) return ctx.scene.enter('adminPanelScene');
    for (let i = 0; i < admins.length; i++) {
      const el = admins[i];
      if (String(ctx.from?.id) == el || ctx.from?.username == el) return ctx.scene.enter('adminPanelScene');
    }
    ctx.scene.enter('welcomeScene');
    return ctx.answerCbQuery('Ти не маєш доступу!', { show_alert: true });
  } catch (e) {
    console.log(e);
  }
});

// ===================   Admin scene   =========================

const adminPanelScene = new Scenes.BaseScene<CustomContext>('adminPanelScene');

var ids: number[] = [];

adminPanelScene.enter(async (ctx) => {
  try {
    ids = [];
    if (ctx.callbackQuery?.message?.message_id) {
      ctx.editMessageText(adminWelcome, Markup.inlineKeyboard(adminsFncBtn));
    } else {
      ctx.reply(adminWelcome, Markup.inlineKeyboard(adminsFncBtn));
    }

    await Users.find()
      .select('_id')
      .then((id) =>
        id.map((item) => {
          ids.push(item._id);
        }),
      );
  } catch (e) {
    console.log(e);
  }
});

adminPanelScene.action('back', (ctx) => {
  try {
    ctx.scene.enter('adminPanelScene');
    ctx.answerCbQuery();
  } catch (e) {
    console.log(e);
  }
});

adminPanelScene.action('close', (ctx) => {
  try {
    ctx.scene.enter('welcomeScene');
    ctx.answerCbQuery();
  } catch (e) {
    console.log(e);
  }
});

adminPanelScene.action('info', (ctx) => {
  try {
    ctx.editMessageText(
      `Бота запущено: ${moment.tz(botStart, 'LLLL', "Europe/Zaporozhye").fromNow()}\n` +
      `Користувачів: ${ids.length}\n` +
      ``,
      Markup.inlineKeyboard([[{ text: 'Назад', callback_data: 'back' }]]),
    );
    ctx.answerCbQuery();
  } catch (e) {
    console.log(e);
  }
});
adminPanelScene.action('mailing', (ctx) => {
  try {
    ctx.editMessageText(mailingText, mailingKeyboard);
    ctx.answerCbQuery();
  } catch (e) {
    console.log(e);
  }
});
adminPanelScene.action('simple', (ctx) => {
  try {
    ctx.scene.enter('mailingSimpleScene');
    ctx.answerCbQuery();
  } catch (e) {
    console.log(e);
  }
});
adminPanelScene.action('cb', (ctx) => {
  try {
    ctx.scene.enter('mailingCbScene');
    ctx.answerCbQuery();
  } catch (e) {
    console.log(e);
  }
});
adminPanelScene.action('update', (ctx) => {
  try {
    ctx.scene.enter('mailingUpdateScene');
    ctx.answerCbQuery();
  } catch (e) {
    console.log(e);
  }
});

// ===================   Simple mailing scene   =========================

const mailingSimpleScene = new Scenes.BaseScene<CustomContext>('mailingSimpleScene');

mailingSimpleScene.enter((ctx) => {
  try {
    ctx.session.adId = Number(ctx.callbackQuery?.message?.message_id);
    ctx.editMessageText(simpleMail, {
      parse_mode: 'Markdown',
      disable_web_page_preview: true,
      reply_markup: {
        inline_keyboard: [[{ text: 'Назад', callback_data: 'back' }]],
      },
    });
  } catch (e) {
    console.log(e);
  }
});

mailingSimpleScene.action('send', async (ctx) => {
  sendMessages = ids.length;
  try {
    ctx.deleteMessage(ctx.session.adId).catch((err) => { });
    ctx.deleteMessage(ctx.session.delMess).catch((err) => { });

    for (let n = 0; n < ids.length; n++) {

      for (let n = ids.length; n > 0; n--) {
        const element = ids[n];

        ctx.telegram
          .sendMessage(element, ctx.session.text, {
            parse_mode: 'Markdown',
            disable_web_page_preview: true,
            reply_markup: {
              inline_keyboard: [[{ text: 'Зрозуміло', callback_data: 'del' }]],
            },
          })
          .catch((err) => {
            sendMessages -= 1;
          });
      }

      setTimeout(() => {
        ctx.telegram.sendMessage(
          '-1001378618059',
          `Повідомлення отримали ${sendMessages} користувачів`,
          { parse_mode: 'Markdown' },
        );
      }, 15000);

      await ctx.scene.enter('adminPanelScene');
    }
  } catch (e) { }
});


mailingSimpleScene.on('text', (ctx) => {
  try {
    ctx.session.text = ctx.message.text;
    ctx.session.delMess = ctx.message.message_id;
    ctx.telegram.editMessageText(
      ctx.chat.id,
      ctx.session.adId,
      '',
      'Цей текст буде відправлено:\n\n' +
      ctx.message.text +
      '\n\nЩоб змінити просто напиши новий текст\n\nЩоб відправити напиши "ТАК"',
      {
        parse_mode: 'Markdown',
        disable_web_page_preview: true,
        reply_markup: {
          inline_keyboard: [
            [{ text: 'Надіслати', callback_data: 'send' }],
            [{ text: 'Назад', callback_data: 'back' }],
          ],
        },
      },
    );
  } catch (e) {
    console.log(e);
  }
});

mailingSimpleScene.action('back', (ctx) => {
  try {
    ctx.scene.enter('adminPanelScene');
    ctx.answerCbQuery();
  } catch (e) {
    console.log(e);
  }
});

// ===================   Cb mailing scene   =========================

const mailingCbScene = new Scenes.BaseScene<CustomContext>('mailingCbScene');

mailingCbScene.enter((ctx) => {
  try {
    ctx.session.adId = Number(ctx?.callbackQuery?.message?.message_id);
    ctx.editMessageText(cbMail, {
      parse_mode: 'Markdown',
      disable_web_page_preview: true,
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Написати', callback_data: 'cb' }],
          [{ text: 'Назад', callback_data: 'back' }],
        ],
      },
    });
  } catch (e) {
    console.log(e);
  }
});

mailingCbScene.action('send', async (ctx) => {
  sendMessages = ids.length;
  try {
    ctx.deleteMessage(Number(ctx.callbackQuery?.message?.message_id)).catch((err) => { });
    ctx.deleteMessage(ctx.session.adId).catch((err) => { });
    ctx.deleteMessage(ctx.session.delMess).catch((err) => { });

    for (let n = ids.length; n > 0; n--) {
      const element = ids[n];

      ctx.telegram
        .sendMessage(element, ctx.session.text, {
          parse_mode: 'Markdown',
          disable_web_page_preview: true,
          reply_markup: {
            inline_keyboard: [[{ text: 'Зрозуміло', callback_data: 'del' }]],
          },
        })
        .catch((err) => {
          sendMessages -= 1;
        });
    }

    setTimeout(() => {
      ctx.telegram.sendMessage(
        '-1001378618059',
        `Повідомлення отримали ${sendMessages} користувачів`,
        { parse_mode: 'Markdown' },
      );
    }, 10000);

    setTimeout(() => {
      ctx.telegram.sendMessage(
        '-1001378618059',
        `Повідомлення отримали ${sendMessages} користувачів`,
        { parse_mode: 'Markdown' },
      );
    }, 15000);

    await ctx.scene.enter('adminPanelScene');
  } catch (e) {
    console.log(e);
  }
});

mailingCbScene.on('text', (ctx) => {
  try {
    ctx.session.text = ctx.message.text;
    ctx.session.delMess = ctx.message.message_id;
    ctx.telegram.editMessageText(
      ctx.chat.id,
      ctx.session.adId,
      '',
      'Цей текст буде відправлено:\n\n' +
      ctx.message.text +
      '\n\nЩоб змінити просто напиши новий текст\nЩоб відправити напиши "ТАК"',
      {
        parse_mode: 'Markdown',
        disable_web_page_preview: true,
        reply_markup: {
          inline_keyboard: [[{ text: 'Назад', callback_data: 'back' }]],
        },
      },
    );
  } catch (e) {
    console.log(e);
  }
});

mailingCbScene.action('cb', (ctx) => {
  try {
    ctx.answerCbQuery('Це приклад кнопки вона працюватиме після відправки', {
      show_alert: true,
    });
  } catch (e) {
    console.log(e);
  }
});

mailingCbScene.action('back', (ctx) => {
  try {
    ctx.scene.enter('adminPanelScene');
    ctx.answerCbQuery();
  } catch (e) {
    console.log(e);
  }
});

// ===================   Update mailing scene   =========================

const mailingUpdateScene = new Scenes.BaseScene<CustomContext>('mailingUpdateScene');

mailingUpdateScene.enter((ctx) => {
  try {
    ctx.session.adId = Number(ctx.callbackQuery?.message?.message_id);
    ctx.editMessageText(updateMail, {
      parse_mode: 'Markdown',
      disable_web_page_preview: true,
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Надіслати', callback_data: 'send' }],
          [{ text: 'Назад', callback_data: 'back' }],
        ],
      },
    });
  } catch (e) {
    console.log(e);
  }
});

mailingUpdateScene.action('send', async (ctx) => {
  sendMessages = ids.length;

  try {
    ctx.deleteMessage(ctx.session.adId).catch((err) => { });

    for (let n = 0; n < ids.length; n++) {
      const element = ids[n];

      ctx.telegram
        .sendMessage(element, updateInfo + '\n\n' + clearHistory, {
          parse_mode: 'Markdown',
          disable_web_page_preview: true,
          reply_markup: {
            inline_keyboard: [
              [{ text: 'Зрозуміло', callback_data: 'del' }],
              [{ text: 'Надіслати', callback_data: 'send' }],
            ],
          },
        })
        .catch((err) => {
          sendMessages -= 1;
        });
      ctx.telegram.sendMessage(element, updateInfo + '\n\n' + clearHistory).catch((err) => {
        sendMessages -= 1;
      });
    }

    setTimeout(() => {
      ctx.telegram.sendMessage(
        '-1001378618059',
        `Повідомлення отримали ${sendMessages} користувачів`,
        { parse_mode: 'Markdown' },
      );
    }, 15000);

    await ctx.scene.enter('adminPanelScene');
  } catch (e) {
    console.log(e);
  }
});

mailingUpdateScene.action('back', (ctx) => {
  try {
    ctx.scene.enter('adminPanelScene');
    ctx.answerCbQuery();
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
