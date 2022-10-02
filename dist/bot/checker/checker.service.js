"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const scheduleParse_1 = require("../../parser/scheduleParse");
const redis_1 = require("../../db/redis");
const ttl = 3600 * 12;
class CheckerService {
    async hasScheduleChanges(value, mode = "group") {
        const weekShift = 0;
        const scheduleNew = await (0, scheduleParse_1.parse)({
            mode,
            value,
            weekShift,
        });
        if (scheduleNew.error)
            return false;
        const scheduleOld = await (0, redis_1.redisGetData)(value + "_" + weekShift + "_checker");
        if (!scheduleOld) {
            await (0, redis_1.redisWriteData)(value + "_" + weekShift + "_checker", scheduleNew, ttl);
            return false;
        }
        const changes = [];
        for (const [prop, value] of Object.entries(scheduleNew)) {
            if (prop === "sDate" || prop === "eDate")
                continue;
            const hasChange = JSON.stringify(value) !== JSON.stringify(scheduleOld[prop]);
            if (hasChange) {
                await (0, redis_1.redisWriteData)(value + "_" + weekShift + "_checker", scheduleNew, ttl);
                await (0, redis_1.redisWriteData)(value + "_" + weekShift, scheduleNew, 3600);
                changes.push(value);
            }
        }
        return changes.length ? changes : false;
    }
}
exports.default = new CheckerService();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hlY2tlci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2JvdC9jaGVja2VyL2NoZWNrZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDhEQUFtRDtBQUNuRCwwQ0FBOEQ7QUFlOUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQztBQUV0QixNQUFNLGNBQWM7SUFDbEIsS0FBSyxDQUFDLGtCQUFrQixDQUFDLEtBQWEsRUFBRSxPQUE0QixPQUFPO1FBQ3pFLE1BQU0sU0FBUyxHQUFHLENBQUMsQ0FBQztRQUNwQixNQUFNLFdBQVcsR0FBZ0IsTUFBTSxJQUFBLHFCQUFLLEVBQUM7WUFDM0MsSUFBSTtZQUNKLEtBQUs7WUFDTCxTQUFTO1NBQ1YsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxXQUFXLENBQUMsS0FBSztZQUFFLE9BQU8sS0FBSyxDQUFDO1FBRXBDLE1BQU0sV0FBVyxHQUFnQixNQUFNLElBQUEsb0JBQVksRUFDakQsS0FBSyxHQUFHLEdBQUcsR0FBRyxTQUFTLEdBQUcsVUFBVSxDQUNyQyxDQUFDO1FBRUYsSUFBSSxDQUFDLFdBQVcsRUFBRTtZQUNoQixNQUFNLElBQUEsc0JBQWMsRUFDbEIsS0FBSyxHQUFHLEdBQUcsR0FBRyxTQUFTLEdBQUcsVUFBVSxFQUNwQyxXQUFXLEVBQ1gsR0FBRyxDQUNKLENBQUM7WUFDRixPQUFPLEtBQUssQ0FBQztTQUNkO1FBRUQsTUFBTSxPQUFPLEdBQUcsRUFBRSxDQUFDO1FBQ25CLEtBQUssTUFBTSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxFQUFFO1lBQ3ZELElBQUksSUFBSSxLQUFLLE9BQU8sSUFBSSxJQUFJLEtBQUssT0FBTztnQkFBRSxTQUFTO1lBQ25ELE1BQU0sU0FBUyxHQUNiLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEtBQUssSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUM5RCxJQUFJLFNBQVMsRUFBRTtnQkFDYixNQUFNLElBQUEsc0JBQWMsRUFDbEIsS0FBSyxHQUFHLEdBQUcsR0FBRyxTQUFTLEdBQUcsVUFBVSxFQUNwQyxXQUFXLEVBQ1gsR0FBRyxDQUNKLENBQUM7Z0JBQ0YsTUFBTSxJQUFBLHNCQUFjLEVBQUMsS0FBSyxHQUFHLEdBQUcsR0FBRyxTQUFTLEVBQUUsV0FBVyxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUNqRSxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2FBQ3JCO1NBQ0Y7UUFFRCxPQUFPLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO0lBQzFDLENBQUM7Q0FDRjtBQUVELGtCQUFlLElBQUksY0FBYyxFQUFFLENBQUMifQ==