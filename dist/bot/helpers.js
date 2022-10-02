"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activity = exports.switchDay = exports.deleteMessage = void 0;
const moment_1 = __importDefault(require("moment"));
require("moment-timezone");
const user_schema_1 = require("../db/user.schema");
function deleteMessage(ctx, messageId, oneMessageId, limit = 100) {
    for (let i = messageId - limit; i <= messageId; i++) {
        if (i == oneMessageId)
            continue;
        ctx.deleteMessage(i).catch(() => { });
    }
}
exports.deleteMessage = deleteMessage;
async function activity(ctx) {
    var _a;
    await user_schema_1.UsersModel.updateOne({ _id: (_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id }, { last_activity: moment_1.default.tz("Europe/Zaporozhye").format(), blocked: false }).maxTimeMS(500);
}
exports.activity = activity;
function switchDay(day, date) {
    let sDate = moment_1.default.tz(date, "DD.MM.YYYY", "Europe/Zaporozhye").add(0, "days");
    switch (day) {
        case "понеділок": {
            sDate = moment_1.default.tz(date, "DD.MM.YYYY", "Europe/Zaporozhye").add(0, "days");
            break;
        }
        case "вівторок": {
            sDate = moment_1.default
                .tz(date, "DD.MM.YYYY", "Europe/Zaporozhye")
                .add(-1, "days");
            break;
        }
        case "середа": {
            sDate = moment_1.default
                .tz(date, "DD.MM.YYYY", "Europe/Zaporozhye")
                .add(-2, "days");
            break;
        }
        case "четвер": {
            sDate = moment_1.default
                .tz(date, "DD.MM.YYYY", "Europe/Zaporozhye")
                .add(-3, "days");
            break;
        }
        case "п’ятниця": {
            sDate = moment_1.default
                .tz(date, "DD.MM.YYYY", "Europe/Zaporozhye")
                .add(-4, "days");
            break;
        }
        case "субота": {
            sDate = moment_1.default
                .tz(date, "DD.MM.YYYY", "Europe/Zaporozhye")
                .add(-5, "days");
            break;
        }
        case "неділя": {
            sDate = moment_1.default
                .tz(date, "DD.MM.YYYY", "Europe/Zaporozhye")
                .add(-6, "days");
            break;
        }
    }
    return Number(sDate.toDate());
}
exports.switchDay = switchDay;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVscGVycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ib3QvaGVscGVycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFDQSxvREFBNEI7QUFDNUIsMkJBQXlCO0FBRXpCLG1EQUErQztBQUUvQyxTQUFTLGFBQWEsQ0FDcEIsR0FBa0IsRUFDbEIsU0FBaUIsRUFDakIsWUFBcUIsRUFDckIsS0FBSyxHQUFHLEdBQUc7SUFFWCxLQUFLLElBQUksQ0FBQyxHQUFHLFNBQVMsR0FBRyxLQUFLLEVBQUUsQ0FBQyxJQUFJLFNBQVMsRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUNuRCxJQUFJLENBQUMsSUFBSSxZQUFZO1lBQUUsU0FBUztRQUNoQyxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsR0FBRSxDQUFDLENBQUMsQ0FBQztLQUN0QztBQUNILENBQUM7QUF3RFEsc0NBQWE7QUF0RHRCLEtBQUssVUFBVSxRQUFRLENBQUMsR0FBa0I7O0lBQ3hDLE1BQU0sd0JBQVUsQ0FBQyxTQUFTLENBQ3hCLEVBQUUsR0FBRyxFQUFFLE1BQUEsR0FBRyxDQUFDLElBQUksMENBQUUsRUFBRSxFQUFFLEVBQ3JCLEVBQUUsYUFBYSxFQUFFLGdCQUFNLENBQUMsRUFBRSxDQUFDLG1CQUFtQixDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxDQUMzRSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNuQixDQUFDO0FBaURrQyw0QkFBUTtBQS9DM0MsU0FBUyxTQUFTLENBQUMsR0FBVyxFQUFFLElBQVk7SUFDMUMsSUFBSSxLQUFLLEdBQUcsZ0JBQU0sQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFLFlBQVksRUFBRSxtQkFBbUIsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDOUUsUUFBUSxHQUFHLEVBQUU7UUFDWCxLQUFLLFdBQVcsQ0FBQyxDQUFDO1lBQ2hCLEtBQUssR0FBRyxnQkFBTSxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsWUFBWSxFQUFFLG1CQUFtQixDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztZQUMxRSxNQUFNO1NBQ1A7UUFDRCxLQUFLLFVBQVUsQ0FBQyxDQUFDO1lBQ2YsS0FBSyxHQUFHLGdCQUFNO2lCQUNYLEVBQUUsQ0FBQyxJQUFJLEVBQUUsWUFBWSxFQUFFLG1CQUFtQixDQUFDO2lCQUMzQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDbkIsTUFBTTtTQUNQO1FBQ0QsS0FBSyxRQUFRLENBQUMsQ0FBQztZQUNiLEtBQUssR0FBRyxnQkFBTTtpQkFDWCxFQUFFLENBQUMsSUFBSSxFQUFFLFlBQVksRUFBRSxtQkFBbUIsQ0FBQztpQkFDM0MsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQ25CLE1BQU07U0FDUDtRQUNELEtBQUssUUFBUSxDQUFDLENBQUM7WUFDYixLQUFLLEdBQUcsZ0JBQU07aUJBQ1gsRUFBRSxDQUFDLElBQUksRUFBRSxZQUFZLEVBQUUsbUJBQW1CLENBQUM7aUJBQzNDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztZQUNuQixNQUFNO1NBQ1A7UUFDRCxLQUFLLFVBQVUsQ0FBQyxDQUFDO1lBQ2YsS0FBSyxHQUFHLGdCQUFNO2lCQUNYLEVBQUUsQ0FBQyxJQUFJLEVBQUUsWUFBWSxFQUFFLG1CQUFtQixDQUFDO2lCQUMzQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDbkIsTUFBTTtTQUNQO1FBQ0QsS0FBSyxRQUFRLENBQUMsQ0FBQztZQUNiLEtBQUssR0FBRyxnQkFBTTtpQkFDWCxFQUFFLENBQUMsSUFBSSxFQUFFLFlBQVksRUFBRSxtQkFBbUIsQ0FBQztpQkFDM0MsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQ25CLE1BQU07U0FDUDtRQUNELEtBQUssUUFBUSxDQUFDLENBQUM7WUFDYixLQUFLLEdBQUcsZ0JBQU07aUJBQ1gsRUFBRSxDQUFDLElBQUksRUFBRSxZQUFZLEVBQUUsbUJBQW1CLENBQUM7aUJBQzNDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztZQUNuQixNQUFNO1NBQ1A7S0FDRjtJQUNELE9BQU8sTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO0FBQ2hDLENBQUM7QUFFdUIsOEJBQVMifQ==