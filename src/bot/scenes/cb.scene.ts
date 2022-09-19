import { Scenes } from 'telegraf';
import dotenv from 'dotenv';
import { CustomContext } from '../custom-context';

dotenv.config({ path: './.env' });

const cbScene = new Scenes.BaseScene<CustomContext>('cbScene');

cbScene.enter((ctx) => {
  try {
    ctx.session.cbId = Number(ctx.callbackQuery?.message?.message_id);
    ctx.editMessageText('Напиши те, що хочеш, але тільки одним повідомленням', {
      reply_markup: {
        inline_keyboard: [[{ text: 'Відмінити', callback_data: 'del' }]],
      },
    });
  } catch (e) {
    console.log(e);
  }
});

cbScene.on('text', (ctx) => {
  try {
    ctx.deleteMessage(ctx.message.message_id).catch((e) => { });
    ctx.deleteMessage(ctx.session.cbId).catch((e) => { });
    ctx.scene.enter('chooseScene');
    ctx.telegram.sendMessage(
      '-1001378618059',
      `Від [${ctx.from.username || ctx.from.first_name}](tg://user?id=${ctx.chat.id})` + '\n\n' + ctx.message.text,
      { parse_mode: 'Markdown' },
    );
  } catch (e) {
    console.log(e);
  }
});

export { cbScene };
