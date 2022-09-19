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
  course,
  renewalDate,
  oneAbsenceDate,
} = require('./statementText');

// ======================= keyboard =======================

const fieldKeyboard = [
  { text: phone, callback_data: phone },
  { text: withSpecialty, callback_data: withSpecialty },
  { text: renewalDate.split(' ')[0], callback_data: renewalDate },
  { text: done, callback_data: done },
  { text: 'Назад', callback_data: 'statement' },
];

const backKeyboard = Markup.inlineKeyboard([{ text: 'Назад', callback_data: 'back' }]);

const courseKeyboard = Markup.inlineKeyboard([
  { text: '1', callback_data: 1 },
  { text: '2', callback_data: 2 },
  { text: '3', callback_data: 3 },
  { text: '4', callback_data: 4 },
]);

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

const statement7Scene = new Scenes.BaseScene('statement7Scene');
const columns = 3;

statement7Scene.command('/start', (ctx) => {
  try {
    {
      ctx.deleteMessage();
      ctx.scene.enter('welcomeScene');
    }
  } catch (error) {
    console.log(error);
  }
});

statement7Scene.enter((ctx) => {
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

statement7Scene.action(phone, (ctx) => {
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

statement7Scene.on('contact', async (ctx) => {
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

statement7Scene.action(withSpecialty, (ctx) => {
  try {
    delete ctx.session.statementData?.withForm;
    delete ctx.session.statementData?.withSpecialty;
    delete ctx.session.statementData?.withCourse;

    ctx.session.field = withSpecialty;
    ctx.editMessageText(withSpecialty, courseKeyboard);
    ctx.answerCbQuery();
  } catch (e) {
    console.log(e);
  }
});

statement7Scene.action(renewalDate, (ctx) => {
  try {
    ctx.session.field = date;
    ctx.editMessageText(oneAbsenceDate, backKeyboard);
    ctx.answerCbQuery();
  } catch (e) {
    console.log(e);
  }
});

statement7Scene.on('text', (ctx) => {
  try {
    if (ctx.session.field == date) {
      const absenceDate = ctx.message.text;

      if (!moment(absenceDate, 'DD.MM.YYYY').isValid()) {
        ctx.deleteMessage(ctx.message.message_id);
        return ctx.telegram
          .editMessageText(ctx.from.id, ctx.session.oneMessageId, null, dateError, backKeyboard)
          .catch((err) => { });
      }

      ctx.session.statementData.absenceDate = absenceDate;
      ctx.session.keyboard[2].text = fieldKeyboard[2].text + '✅';
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

statement7Scene.action(done, (ctx) => {
  try {
    const infoArr = ctx.session.statementData;

    const info = `Група: ${infoArr.group}\nПІБ: ${infoArr.pib}\nНомер: ${infoArr.phone}\nЗ: ${infoArr.withCourse} курсу ${infoArr.withForm} «${infoArr.withSpecialty}»\nДата відрахування: ${infoArr.absenceDate}\n\n\nВсе вірно?`;
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

statement7Scene.action('yes', async (ctx) => {
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

statement7Scene.action('no', (ctx) => {
  try {
    ctx.answerCbQuery('Можеш виправити те, що не правильно', { show_alert: true });
    return ctx.editMessageText(
      statementEnter,
      Markup.inlineKeyboard(ctx.session.keyboard, { columns }),
    );
  } catch (e) { }
});

statement7Scene.action('statement', (ctx) => {
  try {
    ctx.answerCbQuery();
    return ctx.scene.enter('statementScene');
  } catch (e) {
    console.log(e);
  }
});

statement7Scene.action('back', (ctx) => {
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

statement7Scene.action('mainMenu', (ctx) => {
  try {
    ctx.scene.enter('welcomeScene');
  } catch (e) {
    console.log(e);
  }
});

statement7Scene.on('callback_query', (ctx) => {
  try {
    ctx.answerCbQuery();

    if (ctx.session.field == withSpecialty) {
      if (!ctx.session.statementData.withCourse)
        ctx.session.statementData.withCourse = ctx.callbackQuery.data;
      else if (!ctx.session.statementData.withForm)
        ctx.session.statementData.withForm = ctx.callbackQuery.data;
      else if (!ctx.session.statementData.withSpecialty)
        ctx.session.statementData.withSpecialty = ctx.callbackQuery.data;

      if (
        ctx.session.statementData.withCourse &&
        !ctx.session.statementData.withForm &&
        !ctx.session.statementData.withSpecialty
      )
        ctx.editMessageText(withSpecialty, formKeyboard);
      else if (
        ctx.session.statementData.withCourse &&
        ctx.session.statementData.withForm &&
        !ctx.session.statementData.withSpecialty
      ) {
        ctx.editMessageText(withSpecialty, specialtyKeyboard);
      } else if (
        ctx.session.statementData.withCourse &&
        ctx.session.statementData.withForm &&
        ctx.session.statementData.withSpecialty
      ) {
        ctx.session.keyboard[1].text = fieldKeyboard[1].text + '✅';

        delete ctx.session.field;

        ctx.editMessageText(
          statementEnter,
          Markup.inlineKeyboard(ctx.session.keyboard, { columns }),
        );
      }
    }
  } catch (error) { }
});

statement7Scene.on('message', (ctx) => {
  try {
    ctx.deleteMessage;
  } catch (e) {
    console.log(e);
  }
});

statement7Scene.leave((ctx) => {
  delete ctx.session.statementData;
  delete ctx.session.keyboard;
});

module.exports = { statement7Scene };
