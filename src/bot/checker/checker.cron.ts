import { CronJob } from "cron";
import { Markup } from "telegraf";
import { bot } from "../bot";
import checkerDao from "./checker.dao";
import checkerService from "./checker.service";

const job = new CronJob(
  "0 8-18 * * 0-5",
  async () => {
    const usersValue = await checkerDao.getUsersForNotification();
    for (const value of usersValue) {
      const changes = await checkerService.hasScheduleChange(
        value.value,
        value.mode
      );

      if (changes) {
        const users = await checkerDao.getUsers(value.value, value.mode);

        for (const user of users) {
          bot.telegram.sendMessage(
            user._id,
            `Розклад змінено, перевір пари наступних днів:\n${changes
              .map((v) => `${v.day} ${v.date}`)
              .join("\n")}`,
            Markup.inlineKeyboard([
              [
                Markup.button.callback(
                  "Перейти",
                  `watchChanges_${changes[0].date}//${user.default_value}//${user.default_role}`
                ),
              ],
            ])
          );
        }
      }
    }
  },
  null,
  true
);

job.start();

export { job };
