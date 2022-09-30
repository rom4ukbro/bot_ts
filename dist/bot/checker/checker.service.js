"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const scheduleParse_1 = require("../../parser/scheduleParse");
const redis_1 = require("../../db/redis");
class CheckerService {
    async hasScheduleChange(value, mode = "group") {
        const scheduleNew = await (0, scheduleParse_1.parse)({
            mode,
            value,
            weekShift: 0,
        });
        if (scheduleNew.error)
            return false;
        const scheduleOld = await (0, redis_1.redisGetData)(value + "_" + 0 + "_checker");
        if (!scheduleOld) {
            await (0, redis_1.redisWriteData)(value + "_" + 0 + "_checker", scheduleNew, 7200);
            return false;
        }
        const changes = [];
        for (const [prop, value] of Object.entries(scheduleNew)) {
            if (prop === "sDate" || prop === "eDate")
                continue;
            const hasChange = JSON.stringify(value) !== JSON.stringify(scheduleOld[prop]);
            if (hasChange) {
                await (0, redis_1.redisWriteData)(value + "_" + 0 + "_checker", scheduleNew, 7200);
                changes.push(value);
            }
        }
        return changes.length ? changes : false;
    }
}
exports.default = new CheckerService();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hlY2tlci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2JvdC9jaGVja2VyL2NoZWNrZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDhEQUFtRDtBQUNuRCwwQ0FBOEQ7QUFlOUQsTUFBTSxjQUFjO0lBQ2xCLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxLQUFhLEVBQUUsT0FBNEIsT0FBTztRQUN4RSxNQUFNLFdBQVcsR0FBZ0IsTUFBTSxJQUFBLHFCQUFLLEVBQUM7WUFDM0MsSUFBSTtZQUNKLEtBQUs7WUFDTCxTQUFTLEVBQUUsQ0FBQztTQUNiLENBQUMsQ0FBQztRQUNILElBQUksV0FBVyxDQUFDLEtBQUs7WUFBRSxPQUFPLEtBQUssQ0FBQztRQUVwQyxNQUFNLFdBQVcsR0FBZ0IsTUFBTSxJQUFBLG9CQUFZLEVBQ2pELEtBQUssR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLFVBQVUsQ0FDN0IsQ0FBQztRQUVGLElBQUksQ0FBQyxXQUFXLEVBQUU7WUFDaEIsTUFBTSxJQUFBLHNCQUFjLEVBQUMsS0FBSyxHQUFHLEdBQUcsR0FBRyxDQUFDLEdBQUcsVUFBVSxFQUFFLFdBQVcsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUN0RSxPQUFPLEtBQUssQ0FBQztTQUNkO1FBRUQsTUFBTSxPQUFPLEdBQUcsRUFBRSxDQUFDO1FBQ25CLEtBQUssTUFBTSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxFQUFFO1lBQ3ZELElBQUksSUFBSSxLQUFLLE9BQU8sSUFBSSxJQUFJLEtBQUssT0FBTztnQkFBRSxTQUFTO1lBQ25ELE1BQU0sU0FBUyxHQUNiLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEtBQUssSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUM5RCxJQUFJLFNBQVMsRUFBRTtnQkFDYixNQUFNLElBQUEsc0JBQWMsRUFBQyxLQUFLLEdBQUcsR0FBRyxHQUFHLENBQUMsR0FBRyxVQUFVLEVBQUUsV0FBVyxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUN0RSxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2FBQ3JCO1NBQ0Y7UUFFRCxPQUFPLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO0lBQzFDLENBQUM7Q0FDRjtBQUVELGtCQUFlLElBQUksY0FBYyxFQUFFLENBQUMifQ==