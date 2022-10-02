import { parse } from "../../parser/scheduleParse";
import { redisGetData, redisWriteData } from "../../db/redis";

type scheduleDTO = Record<
  string,
  {
    date: string;
    day: string;
    items: {
      number: string;
      timeBounds: string;
      info: string;
    }[];
  }
>;

const ttl = 3600 * 12;

class CheckerService {
  async hasScheduleChanges(value: string, mode: "group" | "teacher" = "group") {
    const weekShift = 0;
    const scheduleNew: scheduleDTO = await parse({
      mode,
      value,
      weekShift,
    });
    if (scheduleNew.error) return false;

    const scheduleOld: scheduleDTO = await redisGetData(
      value + "_" + weekShift + "_checker"
    );

    if (!scheduleOld) {
      await redisWriteData(
        value + "_" + weekShift + "_checker",
        scheduleNew,
        ttl
      );
      return false;
    }

    const changes = [];
    for (const [prop, value] of Object.entries(scheduleNew)) {
      if (prop === "sDate" || prop === "eDate") continue;
      const hasChange =
        JSON.stringify(value) !== JSON.stringify(scheduleOld[prop]);
      if (hasChange) {
        await redisWriteData(
          value + "_" + weekShift + "_checker",
          scheduleNew,
          ttl
        );
        await redisWriteData(value + "_" + weekShift, scheduleNew, 3600);
        changes.push(value);
      }
    }

    return changes.length ? changes : false;
  }
}

export default new CheckerService();
