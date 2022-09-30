"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.job = void 0;
const cron_1 = require("cron");
const telegraf_1 = require("telegraf");
const bot_1 = require("../bot");
const checker_dao_1 = __importDefault(require("./checker.dao"));
const checker_service_1 = __importDefault(require("./checker.service"));
const job = new cron_1.CronJob("0 8-18 * * 0-5", async () => {
    const usersValue = await checker_dao_1.default.getUsersForNotification();
    for (const value of usersValue) {
        const changes = await checker_service_1.default.hasScheduleChange(value.value, value.mode);
        if (changes) {
            const users = await checker_dao_1.default.getUsers(value.value, value.mode);
            for (const user of users) {
                bot_1.bot.telegram.sendMessage(user._id, `Розклад змінено, перевір пари наступних днів:\n${changes
                    .map((v) => `${v.day} ${v.date}`)
                    .join("\n")}`, telegraf_1.Markup.inlineKeyboard([
                    [
                        telegraf_1.Markup.button.callback("Перейти", `watchChanges_${changes[0].date}//${user.default_value}//${user.default_role}`),
                    ],
                ]));
            }
        }
    }
}, null, true);
exports.job = job;
job.start();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hlY2tlci5jcm9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2JvdC9jaGVja2VyL2NoZWNrZXIuY3Jvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSwrQkFBK0I7QUFDL0IsdUNBQWtDO0FBQ2xDLGdDQUE2QjtBQUM3QixnRUFBdUM7QUFDdkMsd0VBQStDO0FBRS9DLE1BQU0sR0FBRyxHQUFHLElBQUksY0FBTyxDQUNyQixnQkFBZ0IsRUFDaEIsS0FBSyxJQUFJLEVBQUU7SUFDVCxNQUFNLFVBQVUsR0FBRyxNQUFNLHFCQUFVLENBQUMsdUJBQXVCLEVBQUUsQ0FBQztJQUM5RCxLQUFLLE1BQU0sS0FBSyxJQUFJLFVBQVUsRUFBRTtRQUM5QixNQUFNLE9BQU8sR0FBRyxNQUFNLHlCQUFjLENBQUMsaUJBQWlCLENBQ3BELEtBQUssQ0FBQyxLQUFLLEVBQ1gsS0FBSyxDQUFDLElBQUksQ0FDWCxDQUFDO1FBRUYsSUFBSSxPQUFPLEVBQUU7WUFDWCxNQUFNLEtBQUssR0FBRyxNQUFNLHFCQUFVLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRWpFLEtBQUssTUFBTSxJQUFJLElBQUksS0FBSyxFQUFFO2dCQUN4QixTQUFHLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FDdEIsSUFBSSxDQUFDLEdBQUcsRUFDUixrREFBa0QsT0FBTztxQkFDdEQsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO3FCQUNoQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFDZixpQkFBTSxDQUFDLGNBQWMsQ0FBQztvQkFDcEI7d0JBQ0UsaUJBQU0sQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUNwQixTQUFTLEVBQ1QsZ0JBQWdCLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssSUFBSSxDQUFDLGFBQWEsS0FBSyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQy9FO3FCQUNGO2lCQUNGLENBQUMsQ0FDSCxDQUFDO2FBQ0g7U0FDRjtLQUNGO0FBQ0gsQ0FBQyxFQUNELElBQUksRUFDSixJQUFJLENBQ0wsQ0FBQztBQUlPLGtCQUFHO0FBRlosR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDIn0=