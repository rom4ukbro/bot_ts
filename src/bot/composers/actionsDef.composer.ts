import { Composer } from 'telegraf';
import { Users } from '../../db/user.schema';
import { CustomContext } from '../custom-context';

const composer = new Composer<CustomContext>()

composer.action('del', (ctx) => {
  try {
    ctx.answerCbQuery().catch(() => {});
    ctx.deleteMessage();
  } catch (e) { }
});

composer.action('reset_yes', async (ctx) => {
  try {
    Users.findOneAndUpdate(
      { _id: ctx.from?.id },
      {
        default_value: null,
        default_role: null,
      },
    )
      .clone()
      .then(async (value) => {
        await ctx.scene.enter('defaultValueScene');
        ctx.answerCbQuery('Все пройшло успішно!\nЗаповни нові дані', { show_alert: true });
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (error) { }
});

composer.action('reset_no', (ctx) => {
  try {
    ctx.answerCbQuery().catch(() => {});
    ctx.scene.enter('welcomeScene');
  } catch (error) { }
});

composer.action('cbScene', (ctx) => {
  try {
    ctx.answerCbQuery().catch(() => {});
    ctx.scene.enter('cbScene');
  } catch (error) { }
});

export default composer