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
  date,
  share,
  done,
  withSpecialty,
  toSpecialty,
} = require('./statementText');

// ======================= keyboard =======================

const fieldKeyboard = [
  { text: phone, callback_data: phone },
  { text: withSpecialty, callback_data: withSpecialty },
  { text: toSpecialty, callback_data: toSpecialty },
  { text: done, callback_data: done },
  { text: 'Назад', callback_data: 'statement' },
];

const backKeyboard = Markup.inlineKeyboard([{ text: 'Назад', callback_data: 'back' }]);

const formKeyboard = Markup.inlineKeyboard([
  { text: 'Денна', callback_data: 'денної' },
  { text: 'Заочна', callback_data: 'заочної' },
]);

const specialtyKeyboard = Markup.inlineKeyboard(
  [
    { text: 'Дизайн', callback_data: 'Дизайн' },
    { text: 'Журналістика', callback_data: 'Журналістика' },
    { text: 'Економічна кібернетика', callback_data: 'Економічна кібернетика' },
    { text: 'Філологія', callback_data: 'Філологія' },
    { text: 'Початкова освіта', callback_data: 'Початкова освіта' },
    { text: 'Психологія', callback_data: 'Психологія' },
    { text: 'Філософія', callback_data: 'Філософія' },
    { text: 'Фінанси та кредит', callback_data: 'Фінанси та кредит' },
    { text: 'Менеджмент', callback_data: 'Менеджмент' },
    { text: 'Фізичне визовання', callback_data: 'Фізичне визовання' },
  ],
  { columns: 3 },
);

// ======================= scene function =======================

const statement5Scene = new Scenes.BaseScene('statement5Scene');
const columns = 3;

statement5Scene.command('/start', (ctx) => {
  try {
    {
      ctx.deleteMessage();
      ctx.scene.enter('welcomeScene');
    }
  } catch (error) {
    console.log(error);
  }
});

statement5Scene.enter((ctx) => {
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

statement5Scene.action(phone, (ctx) => {
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

statement5Scene.on('contact', async (ctx) => {
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

statement5Scene.action(withSpecialty, (ctx) => {
  try {
    delete ctx.session.statementData?.withForm;
    delete ctx.session.statementData?.withSpecialty;

    ctx.session.field = withSpecialty;
    ctx.editMessageText(withSpecialty, formKeyboard);
    ctx.answerCbQuery();
  } catch (e) {
    console.log(e);
  }
});

statement5Scene.action(toSpecialty, (ctx) => {
  try {
    delete ctx.session.statementData?.toForm;
    delete ctx.session.statementData?.toSpecialty;

    ctx.session.field = toSpecialty;
    ctx.editMessageText(toSpecialty, formKeyboard);
    ctx.answerCbQuery();
  } catch (error) { }
});

statement5Scene.action(done, (ctx) => {
  try {
    const infoArr = ctx.session.statementData;

    const info = `Група: ${infoArr.group}\nПІБ: ${infoArr.pib}\nНомер: ${infoArr.phone}\nЗ: ${infoArr.withForm} «${infoArr.withSpecialty}»\nНа: ${infoArr.toForm} «${infoArr.toSpecialty}»\n\n\nВсе вірно?`;
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

statement5Scene.action('yes', async (ctx) => {
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

statement5Scene.action('no', (ctx) => {
  try {
    ctx.answerCbQuery('Можеш виправити те, що не правильно', { show_alert: true });
    return ctx.editMessageText(
      statementEnter,
      Markup.inlineKeyboard(ctx.session.keyboard, { columns }),
    );
  } catch (e) { }
});

statement5Scene.action('statement', (ctx) => {
  try {
    ctx.answerCbQuery();
    return ctx.scene.enter('statementScene');
  } catch (e) {
    console.log(e);
  }
});

statement5Scene.action('back', (ctx) => {
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

statement5Scene.action('mainMenu', (ctx) => {
  try {
    ctx.scene.enter('welcomeScene');
  } catch (e) {
    console.log(e);
  }
});

statement5Scene.on('callback_query', (ctx) => {
  try {
    ctx.answerCbQuery();

    if (ctx.session.field == withSpecialty) {
      if (!ctx.session.statementData.withForm)
        ctx.session.statementData.withForm = ctx.callbackQuery.data;
      else if (!ctx.session.statementData.withSpecialty)
        ctx.session.statementData.withSpecialty = ctx.callbackQuery.data;

      if (ctx.session.statementData.withForm && !ctx.session.statementData.withSpecialty) {
        ctx.editMessageText(withSpecialty, specialtyKeyboard);
      } else if (ctx.session.statementData.withForm && ctx.session.statementData.withSpecialty) {
        ctx.session.keyboard[1].text = fieldKeyboard[1].text + '✅';

        delete ctx.session.field;

        ctx.editMessageText(
          statementEnter,
          Markup.inlineKeyboard(ctx.session.keyboard, { columns }),
        );
      }
    } else if (ctx.session.field == toSpecialty) {
      if (!ctx.session.statementData?.toForm)
        ctx.session.statementData.toForm = ctx.callbackQuery.data;
      else if (!ctx.session.statementData?.toSpecialty)
        ctx.session.statementData.toSpecialty = ctx.callbackQuery.data;
    }

    if (ctx.session.statementData.toForm && !ctx.session.statementData.toSpecialty) {
      ctx.editMessageText(toSpecialty, specialtyKeyboard);
    } else if (ctx.session.statementData.toForm && ctx.session.statementData.toSpecialty) {
      ctx.session.keyboard[2].text = fieldKeyboard[2].text + '✅';

      delete ctx.session.field;

      ctx.editMessageText(statementEnter, Markup.inlineKeyboard(ctx.session.keyboard, { columns }));
    }
  } catch (error) { }
});

statement5Scene.on('message', (ctx) => {
  try {
    ctx.deleteMessage;
  } catch (e) {
    console.log(e);
  }
});

statement5Scene.leave((ctx) => {
  delete ctx.session.statementData;
  delete ctx.session.keyboard;
});

module.exports = { statement5Scene };
