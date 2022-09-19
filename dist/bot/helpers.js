"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activity = exports.switchDay = exports.deleteMessage = void 0;
const moment_1 = __importDefault(require("moment"));
require("moment-timezone");
const user_schema_1 = require("../db/user.schema");
function deleteMessage(ctx, messageId, oneMessageId) {
    for (let i = messageId - 100; i <= messageId; i++) {
        if (i == oneMessageId)
            continue;
        ctx.deleteMessage(i).catch(() => { });
    }
}
exports.deleteMessage = deleteMessage;
async function activity(ctx) {
    var _a;
    await user_schema_1.Users.updateOne({ _id: (_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id }, { last_activity: moment_1.default.tz("Europe/Zaporozhye").format() }).maxTimeMS(500);
}
exports.activity = activity;
function switchDay(day, date) {
    let sDate = moment_1.default.tz(date, 'DD.MM.YYYY', "Europe/Zaporozhye").add(0, 'days');
    switch (day) {
        case 'понеділок': {
            sDate = moment_1.default.tz(date, 'DD.MM.YYYY', "Europe/Zaporozhye").add(0, 'days');
            break;
        }
        case 'вівторок': {
            sDate = moment_1.default.tz(date, 'DD.MM.YYYY', "Europe/Zaporozhye").add(-1, 'days');
            break;
        }
        case 'середа': {
            sDate = moment_1.default.tz(date, 'DD.MM.YYYY', "Europe/Zaporozhye").add(-2, 'days');
            break;
        }
        case 'четвер': {
            sDate = moment_1.default.tz(date, 'DD.MM.YYYY', "Europe/Zaporozhye").add(-3, 'days');
            break;
        }
        case 'п’ятниця': {
            sDate = moment_1.default.tz(date, 'DD.MM.YYYY', "Europe/Zaporozhye").add(-4, 'days');
            break;
        }
        case 'субота': {
            sDate = moment_1.default.tz(date, 'DD.MM.YYYY', "Europe/Zaporozhye").add(-5, 'days');
            break;
        }
        case 'неділя': {
            sDate = moment_1.default.tz(date, 'DD.MM.YYYY', "Europe/Zaporozhye").add(-6, 'days');
            break;
        }
    }
    return Number(sDate.toDate());
}
exports.switchDay = switchDay;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVscGVycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ib3QvaGVscGVycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxvREFBNEI7QUFDNUIsMkJBQXlCO0FBRXpCLG1EQUEwQztBQUcxQyxTQUFTLGFBQWEsQ0FBQyxHQUFrQixFQUFFLFNBQWlCLEVBQUUsWUFBcUI7SUFDakYsS0FBSyxJQUFJLENBQUMsR0FBRyxTQUFTLEdBQUcsR0FBRyxFQUFFLENBQUMsSUFBSSxTQUFTLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDakQsSUFBSSxDQUFDLElBQUksWUFBWTtZQUFFLFNBQVE7UUFDL0IsR0FBRyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7S0FDdkM7QUFDSCxDQUFDO0FBMENRLHNDQUFhO0FBeEN0QixLQUFLLFVBQVUsUUFBUSxDQUFDLEdBQWtCOztJQUN4QyxNQUFNLG1CQUFLLENBQUMsU0FBUyxDQUFDLEVBQUUsR0FBRyxFQUFFLE1BQUEsR0FBRyxDQUFDLElBQUksMENBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxhQUFhLEVBQUUsZ0JBQU0sQ0FBQyxFQUFFLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFBO0FBQ3pILENBQUM7QUFzQ2tDLDRCQUFRO0FBcEMzQyxTQUFTLFNBQVMsQ0FBQyxHQUFXLEVBQUUsSUFBWTtJQUUxQyxJQUFJLEtBQUssR0FBRyxnQkFBTSxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsWUFBWSxFQUFFLG1CQUFtQixDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUM5RSxRQUFRLEdBQUcsRUFBRTtRQUNYLEtBQUssV0FBVyxDQUFDLENBQUM7WUFDaEIsS0FBSyxHQUFHLGdCQUFNLENBQUMsRUFBRSxDQUFDLElBQUksRUFBRSxZQUFZLEVBQUUsbUJBQW1CLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQzFFLE1BQU07U0FDUDtRQUNELEtBQUssVUFBVSxDQUFDLENBQUM7WUFDZixLQUFLLEdBQUcsZ0JBQU0sQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFLFlBQVksRUFBRSxtQkFBbUIsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztZQUMzRSxNQUFNO1NBQ1A7UUFDRCxLQUFLLFFBQVEsQ0FBQyxDQUFDO1lBQ2IsS0FBSyxHQUFHLGdCQUFNLENBQUMsRUFBRSxDQUFDLElBQUksRUFBRSxZQUFZLEVBQUUsbUJBQW1CLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDM0UsTUFBTTtTQUNQO1FBQ0QsS0FBSyxRQUFRLENBQUMsQ0FBQztZQUNiLEtBQUssR0FBRyxnQkFBTSxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsWUFBWSxFQUFFLG1CQUFtQixDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQzNFLE1BQU07U0FDUDtRQUNELEtBQUssVUFBVSxDQUFDLENBQUM7WUFDZixLQUFLLEdBQUcsZ0JBQU0sQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFLFlBQVksRUFBRSxtQkFBbUIsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztZQUMzRSxNQUFNO1NBQ1A7UUFDRCxLQUFLLFFBQVEsQ0FBQyxDQUFDO1lBQ2IsS0FBSyxHQUFHLGdCQUFNLENBQUMsRUFBRSxDQUFDLElBQUksRUFBRSxZQUFZLEVBQUUsbUJBQW1CLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDM0UsTUFBTTtTQUNQO1FBQ0QsS0FBSyxRQUFRLENBQUMsQ0FBQztZQUNiLEtBQUssR0FBRyxnQkFBTSxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsWUFBWSxFQUFFLG1CQUFtQixDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQzNFLE1BQU07U0FDUDtLQUNGO0lBQ0QsT0FBTyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7QUFDaEMsQ0FBQztBQUV1Qiw4QkFBUyJ9