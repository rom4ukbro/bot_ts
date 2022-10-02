/* eslint-disable @typescript-eslint/no-empty-function */
import { CronJob } from "cron";
import { Markup } from "telegraf";
import moment from "moment";
import "moment-timezone";
moment.locale("uk");
import { bot } from "../bot";
import checkerDao from "./checker.dao";
import checkerService from "./checker.service";

const job = new CronJob(
  "*/30 * * * *",
  async () => {
    const usersValue = await checkerDao.getValues();
    for (const value of usersValue) {
      const changes = await checkerService.hasScheduleChanges(
        value.value,
        value.mode
      );
      if (changes) {
        const users = await checkerDao.getUsersForNotification(
          value.value,
          value.mode
        );
        for (const user of users) {
          bot.telegram
            .sendMessage(
              user._id,
              `Розклад змінено, перевір пари наступних днів:\n${changes
                .map(
                  (v) =>
                    `${v.day} ${v.date}(${moment
                      .tz(v.date, "DD.MM.YYYY", "Europe/Zaporozhye")
                      .fromNow()})`
                )
                .join("\n")}`,
              Markup.inlineKeyboard([
                [
                  Markup.button.callback(
                    "Перейти",
                    `watchChanges_${changes[0].date}//${user.default_value}//${user.default_role}`
                  ),
                ],
              ])
            )
            .catch(() => {});
        }
      }
    }
  },
  null,
  true
);

process.once("SIGINT", () => job.stop());
process.once("SIGTERM", () => job.stop());

export { job };
