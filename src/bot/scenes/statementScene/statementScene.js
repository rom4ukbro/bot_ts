const { Markup, Scenes } = require('telegraf');

const {
  absenceLess,
  explanatoryNote,
  individualTraining,
  distanceLearning,
  chooseSpecialty,
  deductionsStudent,
  renewalStudent,
  rearrangementTest,
  academicLeave,
  transferSession,
} = require('./statementText');

// ===================   keyboard   =========================

const contactKeyboard = Markup.inlineKeyboard(
  [
    { text: absenceLess, callback_data: absenceLess },
    { text: explanatoryNote, callback_data: explanatoryNote },
    { text: individualTraining, callback_data: individualTraining },
    { text: distanceLearning, callback_data: distanceLearning },
    { text: chooseSpecialty, callback_data: chooseSpecialty },
    { text: deductionsStudent, callback_data: deductionsStudent },
    { text: renewalStudent, callback_data: renewalStudent },
    { text: rearrangementTest, callback_data: rearrangementTest },
    { text: academicLeave, callback_data: academicLeave },
    { text: transferSession, callback_data: transferSession },
    { text: 'Назад', callback_data: 'back' },
  ],
  {
    columns: 2,
  },
);

// ===================   Welcome scene   =========================

const statementScene = new Scenes.BaseScene('statementScene');

statementScene.enter((ctx) => {
  try {
    ctx.editMessageText('Яка довідка тобі потрібна?', contactKeyboard);
  } catch (e) {
    console.log(e);
  }
});

statementScene.action(absenceLess, (ctx) => {
  ctx.answerCbQuery();
  return ctx.scene.enter('statement1Scene');
});

statementScene.action(explanatoryNote, (ctx) => {
  ctx.answerCbQuery();
  return ctx.scene.enter('statement2Scene');
});

statementScene.action(individualTraining, (ctx) => {
  ctx.answerCbQuery();
  return ctx.scene.enter('statement3Scene');
});

statementScene.action(distanceLearning, (ctx) => {
  ctx.answerCbQuery();
  return ctx.scene.enter('statement4Scene');
});

statementScene.action(chooseSpecialty, (ctx) => {
  ctx.answerCbQuery();
  return ctx.scene.enter('statement5Scene');
});

statementScene.action(deductionsStudent, (ctx) => {
  ctx.answerCbQuery();
  return ctx.scene.enter('statement6Scene');
});

statementScene.action(renewalStudent, (ctx) => {
  ctx.answerCbQuery();
  return ctx.scene.enter('statement7Scene');
});

statementScene.action(rearrangementTest, (ctx) => {
  ctx.answerCbQuery();
  return ctx.scene.enter('statement8Scene');
});

statementScene.action(academicLeave, (ctx) => {
  ctx.answerCbQuery();
  return ctx.scene.enter('statement9Scene');
});

statementScene.action(transferSession, (ctx) => {
  ctx.answerCbQuery();
  return ctx.scene.enter('statement10Scene');
});

statementScene.action('back', (ctx) => {
  ctx.answerCbQuery();
  return ctx.scene.enter('welcomeScene');
});

module.exports = { statementScene };
