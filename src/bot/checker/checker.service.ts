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

class CheckerService {
  async hasScheduleChange(value: string, mode: "group" | "teacher" = "group") {
    const scheduleNew: scheduleDTO = await parse({
      mode,
      value,
      weekShift: 0,
    });
    if (scheduleNew.error) return false;

    const scheduleOld: scheduleDTO = await redisGetData(
      value + "_" + 0 + "_checker"
    );

    if (!scheduleOld) {
      await redisWriteData(value + "_" + 0 + "_checker", scheduleNew, 7200);
      return false;
    }

    const changes = [];
    for (const [prop, value] of Object.entries(scheduleNew)) {
      if (prop === "sDate" || prop === "eDate") continue;
      const hasChange =
        JSON.stringify(value) !== JSON.stringify(scheduleOld[prop]);
      if (hasChange) {
        await redisWriteData(value + "_" + 0 + "_checker", scheduleNew, 7200);
        await redisWriteData(value + "_" + 0, scheduleNew, 3600);
        changes.push(value);
      }
    }

    return changes.length ? changes : false;
  }
}

export default new CheckerService();
