import moment from 'moment';
import 'moment-timezone';
import { CustomContext } from './custom-context';
import { Users } from '../db/user.schema';


function deleteMessage(ctx: CustomContext, messageId: number, oneMessageId?: number) {
  for (let i = messageId - 100; i <= messageId; i++) {
    if (i == oneMessageId) continue
    ctx.deleteMessage(i).catch(() => { });
  }
}

async function activity(ctx: CustomContext) {
  await Users.updateOne({ _id: ctx.from?.id }, { last_activity: moment.tz("Europe/Zaporozhye").format() }).maxTimeMS(500)
}

function switchDay(day: string, date: string): number {

  let sDate = moment.tz(date, 'DD.MM.YYYY', "Europe/Zaporozhye").add(0, 'days');
  switch (day) {
    case 'понеділок': {
      sDate = moment.tz(date, 'DD.MM.YYYY', "Europe/Zaporozhye").add(0, 'days');
      break;
    }
    case 'вівторок': {
      sDate = moment.tz(date, 'DD.MM.YYYY', "Europe/Zaporozhye").add(-1, 'days');
      break;
    }
    case 'середа': {
      sDate = moment.tz(date, 'DD.MM.YYYY', "Europe/Zaporozhye").add(-2, 'days');
      break;
    }
    case 'четвер': {
      sDate = moment.tz(date, 'DD.MM.YYYY', "Europe/Zaporozhye").add(-3, 'days');
      break;
    }
    case 'п’ятниця': {
      sDate = moment.tz(date, 'DD.MM.YYYY', "Europe/Zaporozhye").add(-4, 'days');
      break;
    }
    case 'субота': {
      sDate = moment.tz(date, 'DD.MM.YYYY', "Europe/Zaporozhye").add(-5, 'days');
      break;
    }
    case 'неділя': {
      sDate = moment.tz(date, 'DD.MM.YYYY', "Europe/Zaporozhye").add(-6, 'days');
      break;
    }
  }
  return Number(sDate.toDate());
}

export { deleteMessage, switchDay, activity }