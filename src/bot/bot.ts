import {
  Telegraf,
  Scenes,
  session,
} from 'telegraf';
import moment from 'moment';
import 'moment-timezone';
moment.locale('uk')
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });
import { Users } from '../db/user.schema';
import scenes from './scenes';
import mongoose from 'mongoose';
import { command, actionsDef, actionsAdd } from './composers';
import { CustomContext } from './custom-context';
import { http } from '../server';

const MONGO_USER = process.env.MONGO_USER;
const MONGO_PASSWORD = process.env.MONGO_PASSWORD;
const MONGO_DB = process.env.MONGO_DB;

const uri = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@cluster.5pkto.mongodb.net/${MONGO_DB}?retryWrites=true&w=majority`;

const { BOT_DOMAIN, BOT_TOKEN: token } = process.env;
if (token === undefined) {
  throw new Error('BOT_TOKEN must be provided!');
}

http


const bot = new Telegraf<CustomContext>(token);

// @ts-ignore
const stage = new Scenes.Stage<CustomContext>([
  ...scenes,
  // statementScene,
  // statement1Scene,
  // statement2Scene,
  // statement3Scene,
  // statement4Scene,
  // statement5Scene,
  // statement6Scene,
  // statement7Scene,
  // statement8Scene,
  // statement9Scene,
  // statement10Scene,
]);

bot.use(session());
bot.use(stage.middleware());
bot.use(async (ctx, next) => {
  await Users.updateOne({ _id: ctx.from?.id }, { last_activity: moment.tz("Europe/Zaporozhye").format() }).maxTimeMS(500)
  next()
})
bot.use(command)
bot.use(actionsDef)
bot.use(actionsAdd)

bot.on('message', async (ctx) => {
  try {
    ctx.deleteMessage(ctx.message.message_id).catch((e) => { });
  } catch (error) { }
});

bot.on('callback_query', (ctx) => {
  try {
    ctx.session.oneMessageId = Number(ctx.update.callback_query.message?.message_id)
    ctx.scene.enter('welcomeScene');
  } catch (e) {
    ctx.answerCbQuery('Ой, щось пішло не так');
  }
});

mongoose.connect(uri).then(() => {
  console.log("Mongo connected")
  bot.launch({
    webhook: {
      hookPath: "/" + bot.secretPathComponent(),
      domain: String(BOT_DOMAIN),
      port: 3030
    },
  }).then(() => console.log("Bot start"));
});


process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))

module.exports = { bot };
