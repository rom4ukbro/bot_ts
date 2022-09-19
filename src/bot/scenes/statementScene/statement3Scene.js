const { Telegraf, Markup, Scenes, Extra } = require('telegraf');
const shevchenko = require('shevchenko');
const moment = require('moment');
moment.locale('uk');

const { googleApis } = require('../../../google/googleAPI');
const {
  sharePhone,
  oneAbsenceDate,
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
  photo,
  reasonJob,
  reasonChild,
  statementNumJ,
  statementNumC,
  statementNumB,
  photoText,
} = require('./statementText');

// ======================= keyboard =======================

const fieldKeyboard = [
  { text: phone, callback_data: phone },
  { text: reason, callback_data: reason },
  // { text: statementNumB, callback_data: statementNumB },
  { text: photo, callback_data: photo },
  { text: done, callback_data: done },

  { text: 'Назад', callback_data: 'statement' },
];

const backKeyboard = Markup.inlineKeyboard([{ text: 'Назад', callback_data: 'back' }]);

const reasonKeyboard = Markup.inlineKeyboard([
  [
    { text: 'працевлаштуванням', callback_data: 'reasonJob' },
    { text: reasonChild, callback_data: reasonChild },
  ],
  [{ text: 'Назад', callback_data: 'back' }],
]);

// ======================= scene function =======================

const statement3Scene = new Scenes.BaseScene('statement3Scene');
const columns = 3;

statement3Scene.command('/start', (ctx) => {
  try {
    {
      ctx.deleteMessage();
      ctx.scene.enter('welcomeScene');
    }
  } catch (error) {
    console.log(error);
  }
});

statement3Scene.enter((ctx) => {
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

statement3Scene.action(phone, (ctx) => {
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

statement3Scene.on('contact', async (ctx) => {
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

statement3Scene.action(reason, (ctx) => {
  try {
    ctx.editMessageText(absenceReason, reasonKeyboard);
    ctx.answerCbQuery();
  } catch (e) {
    console.log(e);
  }
});

statement3Scene.action('reasonJob', (ctx) => {
  try {
    ctx.session.statementData.reason = reasonJob;
    ctx.session.field = reasonJob;
    ctx.answerCbQuery();
    ctx.session.keyboard[1].text = fieldKeyboard[1].text + '✅';
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

statement3Scene.action(reasonChild, (ctx) => {
  try {
    ctx.session.statementData.reason = ctx?.update?.callback_query?.data;
    ctx.session.field = ctx?.update?.callback_query?.data;
    ctx.answerCbQuery();
    ctx.session.keyboard[1].text = fieldKeyboard[1].text + '✅';
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

statement3Scene.action(statementNumB, (ctx) => {
  try {
    if (ctx.session.statementData.reason == reasonJob) {
      ctx.editMessageText(statementNumJ, backKeyboard);
      ctx.session.field = reasonJob;
    } else if (ctx.session.statementData.reason == reasonChild) {
      ctx.editMessageText(statementNumC, backKeyboard);
      ctx.session.field = reasonChild;
    } else {
      ctx.session.field = reason;
      ctx.editMessageText(absenceReason, reasonKeyboard);
    }

    ctx.answerCbQuery();
  } catch (e) {
    console.log(e);
  }
});

statement3Scene.on('text', (ctx) => {
  try {
    if (ctx.session.field == reasonJob) {
      const statementNum = ctx.message.text.split(' ');

      if (statementNum.length != 2) {
        ctx.deleteMessage(ctx.message.message_id);
        return ctx.telegram
          .editMessageText(
            ctx.from.id,
            ctx.session.oneMessageId,
            null,
            'Введені дані не відповідають формату',
            backKeyboard,
          )
          .catch((err) => { });
      }
      if (!moment(statementNum[0], 'DD.MM.YYYY').isValid()) {
        ctx.deleteMessage(ctx.message.message_id);
        return ctx.telegram
          .editMessageText(ctx.from.id, ctx.session.oneMessageId, null, dateError, backKeyboard)
          .catch((err) => { });
      }

      ctx.session.statementData.add = `довідку з місця роботи від date № num`
        .replace('date', statementNum[0])
        .replace('num', statementNum[1]);

      ctx.session.keyboard[2].text = fieldKeyboard[2].text + '✅';
      ctx.deleteMessage();
    } else if (ctx.session.field == reasonChild) {
      const statementNum = ctx.message.text.split(' ');

      if (statementNum.length != 3) {
        ctx.deleteMessage(ctx.message.message_id);
        return ctx.telegram
          .editMessageText(
            ctx.from.id,
            ctx.session.oneMessageId,
            null,
            'Введені дані не відповідають формату',
            backKeyboard,
          )
          .catch((err) => { });
      }
      if (!moment(statementNum[0], 'DD.MM.YYYY').isValid()) {
        ctx.deleteMessage(ctx.message.message_id);
        return ctx.telegram
          .editMessageText(ctx.from.id, ctx.session.oneMessageId, null, dateError, backKeyboard)
          .catch((err) => { });
      }
      ctx.session.statementData.add = `копію свідоцтва про народження від date серія series № num`
        .replace('date', statementNum[0])
        .replace('series', statementNum[1])
        .replace('num', statementNum[2]);

      ctx.session.keyboard[2].text = fieldKeyboard[2].text + '✅';
      ctx.deleteMessage();
    } else {
      ctx.deleteMessage();
    }
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

statement3Scene.action(photo, (ctx) => {
  try {
    ctx.session.field = photo;
    ctx.editMessageText(photoText, backKeyboard);
    ctx.answerCbQuery();
  } catch (e) {
    console.log(e);
  }
});

statement3Scene.on('photo', async (ctx) => {
  if (ctx.session.field == photo) {
    ctx.session.statementData.uri = (
      await ctx.telegram.getFileLink(ctx.message.photo[ctx.message.photo.length - 1].file_id)
    ).href;
    ctx.session.keyboard[3].text = fieldKeyboard[3].text + '✅';
  }

  delete ctx.session.field;
  ctx.session.photoId = ctx.message.message_id;
  return ctx.telegram.editMessageText(
    ctx.from.id,
    ctx.session.oneMessageId,
    null,
    statementEnter,
    Markup.inlineKeyboard(ctx.session.keyboard, { columns }),
  );
});

statement3Scene.action(done, (ctx) => {
  try {
    const infoArr = ctx.session.statementData;

    const info = `Група: ${infoArr.group}\nПІБ: ${infoArr.pib}\nНомер: ${infoArr.phone}\nПричина: відсутній(ня) у зв\'язку з ${infoArr.reason}\nДодаю: ${infoArr.add}\nДокумент: [покликання](${infoArr.uri})\n\nВсе вірно?`;
    if (/undefined/.test(info) && ctx.session.statementData.uri) {
      return ctx.answerCbQuery(fieldNotFill, { show_alert: true });
    }
    ctx.editMessageText(info, {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Так', callback_data: 'yes' }],
          [{ text: 'Ні', callback_data: 'no' }],
        ],
      },
      parse_mode: 'Markdown',
    });
    ctx.answerCbQuery();
  } catch (e) {
    console.log(e);
  }
});

statement3Scene.action('yes', async (ctx) => {
  try {
    ctx.answerCbQuery('Заява створюється, зачекай', { show_alert: true });
    const result = await googleApis('generateDocs', ctx.session.statementData);

    ctx.deleteMessage(ctx.session.photoId);

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

statement3Scene.action('no', (ctx) => {
  try {
    ctx.answerCbQuery('Можеш виправити те, що не правильно', { show_alert: true });
    return ctx.editMessageText(
      statementEnter,
      Markup.inlineKeyboard(ctx.session.keyboard, { columns }),
    );
  } catch (e) { }
});

statement3Scene.action('statement', (ctx) => {
  try {
    ctx.answerCbQuery();
    return ctx.scene.enter('statementScene');
  } catch (e) {
    console.log(e);
  }
});

statement3Scene.action('back', (ctx) => {
  try {
    ctx.answerCbQuery();
    return ctx.editMessageText(
      statementEnter,
      Markup.inlineKeyboard(ctx.session.keyboard, { columns }),
    );
  } catch (e) {
    console.log(e);
  }
});

statement3Scene.action('mainMenu', (ctx) => {
  try {
    ctx.scene.enter('welcomeScene');
  } catch (e) {
    console.log(e);
  }
});

statement3Scene.on('message', (ctx) => {
  try {
    ctx.deleteMessage;
  } catch (e) {
    console.log(e);
  }
});

statement3Scene.leave((ctx) => {
  delete ctx.session.statementData;
  delete ctx.session.keyboard;
  delete ctx.session.field;
});

module.exports = { statement3Scene };
