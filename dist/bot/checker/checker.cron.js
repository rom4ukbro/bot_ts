"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.job = void 0;
const cron_1 = require("cron");
const telegraf_1 = require("telegraf");
const moment_1 = __importDefault(require("moment"));
require("moment-timezone");
moment_1.default.locale("uk");
const bot_1 = require("../bot");
const checker_dao_1 = __importDefault(require("./checker.dao"));
const checker_service_1 = __importDefault(require("./checker.service"));
const job = new cron_1.CronJob("*/30 * * * *", async () => {
    const usersValue = await checker_dao_1.default.getValues();
    for (const value of usersValue) {
        const changes = await checker_service_1.default.hasScheduleChanges(value.value, value.mode);
        if (changes) {
            const users = await checker_dao_1.default.getUsersForNotification(value.value, value.mode);
            for (const user of users) {
                bot_1.bot.telegram
                    .sendMessage(user._id, `Розклад змінено, перевір пари наступних днів:\n${changes
                    .map((v) => `${v.day} ${v.date}(${moment_1.default
                    .tz(v.date, "DD.MM.YYYY", "Europe/Zaporozhye")
                    .fromNow()})`)
                    .join("\n")}`, telegraf_1.Markup.inlineKeyboard([
                    [
                        telegraf_1.Markup.button.callback("Перейти", `watchChanges_${changes[0].date}//${user.default_value}//${user.default_role}`),
                    ],
                ]))
                    .catch(() => { });
            }
        }
    }
}, null, true);
exports.job = job;
job.start();
process.once("SIGINT", () => job.stop());
process.once("SIGTERM", () => job.stop());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hlY2tlci5jcm9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2JvdC9jaGVja2VyL2NoZWNrZXIuY3Jvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFDQSwrQkFBK0I7QUFDL0IsdUNBQWtDO0FBQ2xDLG9EQUE0QjtBQUM1QiwyQkFBeUI7QUFDekIsZ0JBQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDcEIsZ0NBQTZCO0FBQzdCLGdFQUF1QztBQUN2Qyx3RUFBK0M7QUFFL0MsTUFBTSxHQUFHLEdBQUcsSUFBSSxjQUFPLENBQ3JCLGNBQWMsRUFDZCxLQUFLLElBQUksRUFBRTtJQUNULE1BQU0sVUFBVSxHQUFHLE1BQU0scUJBQVUsQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUNoRCxLQUFLLE1BQU0sS0FBSyxJQUFJLFVBQVUsRUFBRTtRQUM5QixNQUFNLE9BQU8sR0FBRyxNQUFNLHlCQUFjLENBQUMsa0JBQWtCLENBQ3JELEtBQUssQ0FBQyxLQUFLLEVBQ1gsS0FBSyxDQUFDLElBQUksQ0FDWCxDQUFDO1FBQ0YsSUFBSSxPQUFPLEVBQUU7WUFDWCxNQUFNLEtBQUssR0FBRyxNQUFNLHFCQUFVLENBQUMsdUJBQXVCLENBQ3BELEtBQUssQ0FBQyxLQUFLLEVBQ1gsS0FBSyxDQUFDLElBQUksQ0FDWCxDQUFDO1lBQ0YsS0FBSyxNQUFNLElBQUksSUFBSSxLQUFLLEVBQUU7Z0JBQ3hCLFNBQUcsQ0FBQyxRQUFRO3FCQUNULFdBQVcsQ0FDVixJQUFJLENBQUMsR0FBRyxFQUNSLGtEQUFrRCxPQUFPO3FCQUN0RCxHQUFHLENBQ0YsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUNKLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsSUFBSSxJQUFJLGdCQUFNO3FCQUN6QixFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxZQUFZLEVBQUUsbUJBQW1CLENBQUM7cUJBQzdDLE9BQU8sRUFBRSxHQUFHLENBQ2xCO3FCQUNBLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUNmLGlCQUFNLENBQUMsY0FBYyxDQUFDO29CQUNwQjt3QkFDRSxpQkFBTSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQ3BCLFNBQVMsRUFDVCxnQkFBZ0IsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSyxJQUFJLENBQUMsYUFBYSxLQUFLLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FDL0U7cUJBQ0Y7aUJBQ0YsQ0FBQyxDQUNIO3FCQUNBLEtBQUssQ0FBQyxHQUFHLEVBQUUsR0FBRSxDQUFDLENBQUMsQ0FBQzthQUNwQjtTQUNGO0tBQ0Y7QUFDSCxDQUFDLEVBQ0QsSUFBSSxFQUNKLElBQUksQ0FDTCxDQUFDO0FBT08sa0JBQUc7QUFMWixHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7QUFFWixPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUN6QyxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyJ9