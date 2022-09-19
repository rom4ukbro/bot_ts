const { Telegraf, Markup, Scenes, Extra } = require('telegraf');
const shevchenko = require('shevchenko');
const moment = require('moment');
moment.locale('uk');

const { googleApis } = require('../../../google/googleAPI');
const {
  sharePhone,
  absenceDate,
  dateError,
  absenceReason,
  createSuccess,
  createFailed,
  mainMenu,
  review,
  phoneNotFound,
  fieldNotFill,
  statementEnter,
  phone,
  reason,
  date,
  share,
  done,
} = require('./statementText');

// ======================= keyboard =======================

const fieldKeyboard = [
  { text: phone, callback_data: phone },
  { text: reason, callback_data: reason },
  { text: date, callback_data: date },
  { text: done, callback_data: done },
  { text: 'Назад', callback_data: 'statement' },
];

const backKeyboard = Markup.inlineKeyboard([{ text: 'Назад', callback_data: 'back' }]);

// ======================= scene function =======================

const statement1Scene = new Scenes.BaseScene('statement1Scene');
const columns = 3;

statement1Scene.command('/start', (ctx) => {
  try {
    {
      ctx.deleteMessage();
      ctx.scene.enter('welcomeScene');
    }
  } catch (error) {
    console.log(error);
  }
});

statement1Scene.enter((ctx) => {
  try {
    ctx.session.keyboard = JSON.parse(JSON.stringify(fieldKeyboard));
    ctx.editMessageText(statementEnter, Markup.inlineKeyboard(ctx.session.keyboard, { columns }));
    ctx.session.statementData = {};
    ctx.session.statementData.docName = ctx?.update?.callback_query?.data;
    ctx.session.statementData.createDate = moment().format('L');
  } catch (e) {
    console.log(e);
  }
});

statement1Scene.action(phone, (ctx) => {
  try {
    ctx.reply(
      sharePhone,
      Markup.keyboard([Markup.button.contactRequest(share)])
        .oneTime()
        .resize(),
    );
    ctx.answerCbQuery();
  } catch (e) {
    console.log(e);
  }
});

statement1Scene.on('contact', async (ctx) => {
  try {
    const payload = { phone: '+' + ctx?.message?.contact?.phone_number };
    const userInfo = await googleApis('checkPhone', payload);
    ctx.session.keyboard[0].text = fieldKeyboard[0].text + '✅';

    if (userInfo.notFound) {
      ctx.deleteMessage(ctx.message.reply_to_message.message_id);
      ctx.deleteMessage(ctx.message.message_id);
      return ctx.editMessageText(
        phoneNotFound,
        Markup.inlineKeyboard([Markup.button.callback(mainMenu, 'mainMenu')]),
      );
    }

    if (userInfo.status === 'failed') {
      ctx.deleteMessage(ctx.message.reply_to_message.message_id);
      ctx.deleteMessage(ctx.message.message_id);
      return ctx.editMessageText(
        'Не вдалося перевірити номер',
        Markup.inlineKeyboard([Markup.button.callback(mainMenu, 'mainMenu')]),
      );
    }

    ctx.session.statementData.gender = userInfo[14] == 'Жіноча' ? 'female' : 'male';

    ctx.session.statementData.phone = '+' + ctx.message.contact.phone_number;

    ctx.session.statementData.firstName = userInfo[0].split(' ')[1];
    ctx.session.statementData.lastName = userInfo[0].split(' ')[0];
    ctx.session.statementData.pib = `${ctx.session.statementData.lastName} ${ctx.session.statementData.firstName}`;
    ctx.session.statementData.group = userInfo[1];

    const inGenitive = shevchenko.inGenitive({
      gender: ctx.session.statementData.gender,
      firstName: ctx.session.statementData.firstName,
      lastName: ctx.session.statementData.lastName,
    });

    ctx.session.statementData.inGenitive = `${inGenitive.lastName} ${inGenitive.firstName}`;

    await ctx.deleteMessage();
    await ctx.deleteMessage(ctx.message.reply_to_message.message_id);

    return ctx.telegram.editMessageText(
      ctx.from.id,
      ctx.session.oneMessageId,
      null,
      statementEnter,
      Markup.inlineKeyboard(ctx.session.keyboard, { columns }),
    );
  } catch (e) {
    console.log(e);
  }
});

statement1Scene.action(reason, (ctx) => {
  try {
    ctx.session.field = reason;
    ctx.editMessageText(absenceReason, backKeyboard);
    ctx.answerCbQuery();
  } catch (e) {
    console.log(e);
  }
});

statement1Scene.action(date, (ctx) => {
  try {
    ctx.session.field = date;
    ctx.editMessageText(absenceDate, backKeyboard);
    ctx.answerCbQuery();
  } catch (error) { }
});

statement1Scene.on('text', (ctx) => {
  try {
    if (ctx.session.field == date) {
      const absenceDate = ctx.message.text.split('-');

      if (
        !moment(absenceDate[0], 'DD.MM.YYYY').isValid() ||
        !moment(absenceDate[1], 'DD.MM.YYYY').isValid()
      ) {
        ctx.deleteMessage(ctx.message.message_id);
        return ctx.telegram
          .editMessageText(ctx.from.id, ctx.session.oneMessageId, null, dateError, backKeyboard)
          .catch((err) => { });
      }

      ctx.session.statementData.sDate = absenceDate[0];
      ctx.session.statementData.eDate = absenceDate[1];
      ctx.session.keyboard[2].text = fieldKeyboard[2].text + '✅';
      ctx.deleteMessage();
    } else if (ctx.session.field == reason) {
      ctx.session.keyboard[1].text = fieldKeyboard[1].text + '✅';
      ctx.session.statementData.reason = ctx.message.text;
      ctx.deleteMessage();
    } else {
      ctx.deleteMessage();
    }
    delete ctx.session.field;
    return ctx.telegram.editMessageText(
      ctx.from.id,
      ctx.session.oneMessageId,
      null,
      statementEnter,
      Markup.inlineKeyboard(ctx.session.keyboard, { columns }),
    );
  } catch (e) {
    console.log(e);
  }
});

statement1Scene.action(done, (ctx) => {
  try {
    const infoArr = ctx.session.statementData;

    const info = `Група: ${infoArr.group}\nПІБ: ${infoArr.pib}\nНомер: ${infoArr.phone}\nВідсутність: з ${infoArr.sDate} по ${infoArr.eDate}\nПричина: відсутній(ня) у зв\'язку з ${infoArr.reason}\n\nВсе вірно?`;
    if (/undefined/.test(info)) {
      return ctx.answerCbQuery(fieldNotFill, { show_alert: true });
    }
    ctx.editMessageText(
      info,
      Markup.inlineKeyboard([
        [{ text: 'Так', callback_data: 'yes' }],
        [{ text: 'Ні', callback_data: 'no' }],
      ]),
    );
    ctx.answerCbQuery();
  } catch (e) {
    console.log();
  }
});

statement1Scene.action('yes', async (ctx) => {
  try {
    ctx.answerCbQuery('Заява створюється, зачекай', { show_alert: true });
    const result = await googleApis('generateDocs', ctx.session.statementData);

    if (result.status == 'OK') {
      ctx.editMessageText(
        createSuccess,
        Markup.inlineKeyboard([
          Markup.button.url(review, result.url),
          Markup.button.callback(mainMenu, 'mainMenu'),
        ]),
      );
    } else {
      ctx.editMessageText(
        createFailed,
        Markup.inlineKeyboard([Markup.button.callback(mainMenu, 'mainMenu')]),
      );
    }
  } catch (e) {
    console.log(e);
  }
});

statement1Scene.action('no', (ctx) => {
  try {
    ctx.answerCbQuery('Можеш виправити те, що не правильно', { show_alert: true });
    return ctx.editMessageText(
      statementEnter,
      Markup.inlineKeyboard(ctx.session.keyboard, { columns }),
    );
  } catch (e) { }
});

statement1Scene.action('statement', (ctx) => {
  try {
    ctx.answerCbQuery();
    return ctx.scene.enter('statementScene');
  } catch (e) {
    console.log(e);
  }
});

statement1Scene.action('back', (ctx) => {
  try {
    ctx.answerCbQuery();
    return ctx.editMessageText(
      statementEnter,
      Markup.inlineKeyboard(ctx.session.keyboard, { columns }),
    );
  } catch (e) {
    console.log();
  }
});

statement1Scene.action('mainMenu', (ctx) => {
  try {
    ctx.scene.enter('welcomeScene');
  } catch (e) {
    console.log(e);
  }
});

statement1Scene.on('message', (ctx) => {
  try {
    ctx.deleteMessage;
  } catch (e) {
    console.log(e);
  }
});

statement1Scene.leave((ctx) => {
  delete ctx.session.statementData;
  delete ctx.session.keyboard;
});

module.exports = { statement1Scene };
