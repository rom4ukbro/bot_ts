"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeDateScene = exports.scheduleScene = void 0;
const telegraf_1 = require("telegraf");
const node_emoji_1 = __importDefault(require("node-emoji"));
const moment_1 = __importDefault(require("moment"));
require("moment-timezone");
const dotenv_1 = __importDefault(require("dotenv"));
const text_1 = require("../../text");
const helpers_1 = require("../../helpers");
const schedule_service_1 = __importDefault(require("./schedule.service"));
dotenv_1.default.config({ path: "./.env" });
moment_1.default.locale("uk");
const scheduleScene = new telegraf_1.Scenes.BaseScene("scheduleScene");
exports.scheduleScene = scheduleScene;
scheduleScene.use(async (ctx, next) => {
    (0, helpers_1.activity)(ctx);
    next();
});
const checkBtn = node_emoji_1.default.get(":pushpin:");
scheduleScene.enter(schedule_service_1.default.enter);
scheduleScene.action("again", schedule_service_1.default.again);
scheduleScene.action(checkBtn, (ctx) => ctx.answerCbQuery().catch(() => { }));
scheduleScene.action("Пн", schedule_service_1.default.day);
scheduleScene.action("Вт", schedule_service_1.default.day);
scheduleScene.action("Ср", schedule_service_1.default.day);
scheduleScene.action("Чт", schedule_service_1.default.day);
scheduleScene.action("Пт", schedule_service_1.default.day);
scheduleScene.action("Сб", schedule_service_1.default.day);
scheduleScene.action("Нд", schedule_service_1.default.day);
scheduleScene.action(text_1.previousWeekText, schedule_service_1.default.previousWeek);
scheduleScene.action(text_1.nextWeekText, schedule_service_1.default.nextWeek);
scheduleScene.action(text_1.todayText, schedule_service_1.default.today);
scheduleScene.action(text_1.mainMenu, schedule_service_1.default.mainMenu);
scheduleScene.action(text_1.changeQueryBtnText, schedule_service_1.default.changeQuery);
scheduleScene.action(text_1.choiceStudentText, schedule_service_1.default.choiceStudent);
scheduleScene.action(text_1.choiceTeacherText, schedule_service_1.default.choiceTeacher);
scheduleScene.action(text_1.manualDateBtnEntry, schedule_service_1.default.manualDate);
scheduleScene.action(text_1.aboutBtnText, schedule_service_1.default.about);
scheduleScene.action(text_1.allWeekBtnText, schedule_service_1.default.allWeek);
scheduleScene.action("back", async (ctx) => {
    try {
        await ctx.scene.enter("scheduleScene");
        ctx.answerCbQuery().catch(() => { });
    }
    catch (e) {
        ctx.answerCbQuery("Ой, сталася помилка. Спробуй ще раз").catch(() => { });
        console.log(e);
    }
});
scheduleScene.action(checkBtn, async (ctx) => {
    try {
        await ctx.scene.enter("scheduleScene");
        ctx.answerCbQuery().catch(() => { });
    }
    catch (e) {
        ctx.answerCbQuery("Ой, сталася помилка. Спробуй ще раз").catch(() => { });
        console.log(e);
    }
});
const writeDateScene = new telegraf_1.Scenes.BaseScene("writeDateScene");
exports.writeDateScene = writeDateScene;
writeDateScene.enter((ctx) => {
    try {
        ctx.editMessageText(text_1.enterDateText, {
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: [[{ text: "Назад", callback_data: "back" }]],
            },
        });
    }
    catch (e) {
        console.log(e);
    }
});
writeDateScene.command("start", async (ctx) => {
    try {
        ctx.session.weekShift = 0;
        await ctx.scene.enter("chooseScene");
        ctx.session.id = ctx.message.message_id;
        for (let i = ctx.session.id - 100; i <= ctx.session.id; i++) {
            ctx.deleteMessage(i).catch(() => { });
        }
    }
    catch (e) {
        ctx.answerCbQuery("Ой, сталася помилка. Спробуй ще раз").catch(() => { });
        console.log(e);
    }
});
writeDateScene.on("text", (ctx) => {
    try {
        if (!(0, moment_1.default)(ctx.message.text, "DD.MM.YYYY").isValid()) {
            ctx.deleteMessage(ctx.message.message_id).catch(() => { });
            return ctx.telegram
                .editMessageText(ctx.from.id, ctx.session.oneMessageId, "", text_1.errorDateText, {
                parse_mode: "Markdown",
                reply_markup: {
                    inline_keyboard: [[{ text: "Назад", callback_data: "back" }]],
                },
            })
                .catch(() => { });
        }
        ctx.deleteMessage(ctx.message.message_id).catch(() => { });
        ctx.session.weekShift = Math.round(((0, helpers_1.switchDay)(moment_1.default
            .tz(ctx.message.text, "DD.MM.YYYY", "Europe/Zaporozhye")
            .format("dddd"), moment_1.default
            .tz(ctx.message.text, "DD.MM.YYYY", "Europe/Zaporozhye")
            .format("L")) -
            (0, helpers_1.switchDay)(moment_1.default.tz("Europe/Zaporozhye").format("dddd"), moment_1.default.tz("Europe/Zaporozhye").format("L"))) /
            1000 /
            60 /
            60 /
            24 /
            7);
        const day = moment_1.default
            .tz(ctx.message.text, "DD.MM.YYYY", "Europe/Zaporozhye")
            .format("dd");
        ctx.session.day = day.charAt(0).toUpperCase() + day.charAt(1);
        ctx.scene.enter("scheduleScene");
    }
    catch (e) {
        console.log(e);
    }
});
writeDateScene.action("back", (ctx) => {
    try {
        ctx.scene.enter("scheduleScene");
        ctx.answerCbQuery().catch(() => { });
    }
    catch (e) {
        ctx.answerCbQuery("Ой, сталася помилка. Спробуй ще раз").catch(() => { });
        console.log(e);
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NoZWR1bGUuc2NlbmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvYm90L3NjZW5lcy9zY2hlZHVsZS9zY2hlZHVsZS5zY2VuZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFDQSx1Q0FBa0M7QUFDbEMsNERBQStCO0FBQy9CLG9EQUE0QjtBQUM1QiwyQkFBeUI7QUFDekIsb0RBQTRCO0FBRzVCLHFDQWFvQjtBQUNwQiwyQ0FBb0Q7QUFDcEQsMEVBQWlEO0FBRWpELGdCQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUM7QUFDbEMsZ0JBQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7QUFFcEIsTUFBTSxhQUFhLEdBQUcsSUFBSSxpQkFBTSxDQUFDLFNBQVMsQ0FBZ0IsZUFBZSxDQUFDLENBQUM7QUF1SmxFLHNDQUFhO0FBckp0QixhQUFhLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEVBQUU7SUFDcEMsSUFBQSxrQkFBUSxFQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ2QsSUFBSSxFQUFFLENBQUM7QUFDVCxDQUFDLENBQUMsQ0FBQztBQUVILE1BQU0sUUFBUSxHQUFHLG9CQUFLLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBRXhDLGFBQWEsQ0FBQyxLQUFLLENBQUMsMEJBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUUzQyxhQUFhLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSwwQkFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBRXJELGFBQWEsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxHQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDN0UsYUFBYSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsMEJBQWUsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNoRCxhQUFhLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSwwQkFBZSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2hELGFBQWEsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLDBCQUFlLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDaEQsYUFBYSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsMEJBQWUsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNoRCxhQUFhLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSwwQkFBZSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2hELGFBQWEsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLDBCQUFlLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDaEQsYUFBYSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsMEJBQWUsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUVoRCxhQUFhLENBQUMsTUFBTSxDQUFDLHVCQUFnQixFQUFFLDBCQUFlLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDckUsYUFBYSxDQUFDLE1BQU0sQ0FBQyxtQkFBWSxFQUFFLDBCQUFlLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDN0QsYUFBYSxDQUFDLE1BQU0sQ0FBQyxnQkFBUyxFQUFFLDBCQUFlLENBQUMsS0FBSyxDQUFDLENBQUM7QUFFdkQsYUFBYSxDQUFDLE1BQU0sQ0FBQyxlQUFRLEVBQUUsMEJBQWUsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUV6RCxhQUFhLENBQUMsTUFBTSxDQUFDLHlCQUFrQixFQUFFLDBCQUFlLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDdEUsYUFBYSxDQUFDLE1BQU0sQ0FBQyx3QkFBaUIsRUFBRSwwQkFBZSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQ3ZFLGFBQWEsQ0FBQyxNQUFNLENBQUMsd0JBQWlCLEVBQUUsMEJBQWUsQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUV2RSxhQUFhLENBQUMsTUFBTSxDQUFDLHlCQUFrQixFQUFFLDBCQUFlLENBQUMsVUFBVSxDQUFDLENBQUM7QUFFckUsYUFBYSxDQUFDLE1BQU0sQ0FBQyxtQkFBWSxFQUFFLDBCQUFlLENBQUMsS0FBSyxDQUFDLENBQUM7QUFFMUQsYUFBYSxDQUFDLE1BQU0sQ0FBQyxxQkFBYyxFQUFFLDBCQUFlLENBQUMsT0FBTyxDQUFDLENBQUM7QUFFOUQsYUFBYSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxFQUFFO0lBQ3pDLElBQUk7UUFDRixNQUFNLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQ3ZDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLEdBQUUsQ0FBQyxDQUFDLENBQUM7S0FDckM7SUFBQyxPQUFPLENBQUMsRUFBRTtRQUNWLEdBQUcsQ0FBQyxhQUFhLENBQUMscUNBQXFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLEdBQUUsQ0FBQyxDQUFDLENBQUM7UUFDekUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUNoQjtBQUNILENBQUMsQ0FBQyxDQUFDO0FBRUgsYUFBYSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxFQUFFO0lBQzNDLElBQUk7UUFDRixNQUFNLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQ3ZDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLEdBQUUsQ0FBQyxDQUFDLENBQUM7S0FDckM7SUFBQyxPQUFPLENBQUMsRUFBRTtRQUNWLEdBQUcsQ0FBQyxhQUFhLENBQUMscUNBQXFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLEdBQUUsQ0FBQyxDQUFDLENBQUM7UUFDekUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUNoQjtBQUNILENBQUMsQ0FBQyxDQUFDO0FBSUgsTUFBTSxjQUFjLEdBQUcsSUFBSSxpQkFBTSxDQUFDLFNBQVMsQ0FBZ0IsZ0JBQWdCLENBQUMsQ0FBQztBQTJGckQsd0NBQWM7QUF6RnRDLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRTtJQUMzQixJQUFJO1FBQ0YsR0FBRyxDQUFDLGVBQWUsQ0FBQyxvQkFBYSxFQUFFO1lBQ2pDLFVBQVUsRUFBRSxVQUFVO1lBQ3RCLFlBQVksRUFBRTtnQkFDWixlQUFlLEVBQUUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQzthQUM5RDtTQUNGLENBQUMsQ0FBQztLQUNKO0lBQUMsT0FBTyxDQUFDLEVBQUU7UUFDVixPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ2hCO0FBQ0gsQ0FBQyxDQUFDLENBQUM7QUFFSCxjQUFjLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLEVBQUU7SUFDNUMsSUFBSTtRQUNGLEdBQUcsQ0FBQyxPQUFPLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQztRQUUxQixNQUFNLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBRXJDLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRSxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDO1FBQ3hDLEtBQUssSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFLEdBQUcsR0FBRyxFQUFFLENBQUMsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUMzRCxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsR0FBRSxDQUFDLENBQUMsQ0FBQztTQUN0QztLQUNGO0lBQUMsT0FBTyxDQUFDLEVBQUU7UUFDVixHQUFHLENBQUMsYUFBYSxDQUFDLHFDQUFxQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxHQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3pFLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDaEI7QUFDSCxDQUFDLENBQUMsQ0FBQztBQUVILGNBQWMsQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUU7SUFDaEMsSUFBSTtRQUNGLElBQUksQ0FBQyxJQUFBLGdCQUFNLEVBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsWUFBWSxDQUFDLENBQUMsT0FBTyxFQUFFLEVBQUU7WUFDckQsR0FBRyxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsR0FBRSxDQUFDLENBQUMsQ0FBQztZQUMxRCxPQUFPLEdBQUcsQ0FBQyxRQUFRO2lCQUNoQixlQUFlLENBQ2QsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQ1gsR0FBRyxDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQ3hCLEVBQUUsRUFDRixvQkFBYSxFQUNiO2dCQUNFLFVBQVUsRUFBRSxVQUFVO2dCQUN0QixZQUFZLEVBQUU7b0JBQ1osZUFBZSxFQUFFLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUM7aUJBQzlEO2FBQ0YsQ0FDRjtpQkFDQSxLQUFLLENBQUMsR0FBRyxFQUFFLEdBQUUsQ0FBQyxDQUFDLENBQUM7U0FDcEI7UUFDRCxHQUFHLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxHQUFFLENBQUMsQ0FBQyxDQUFDO1FBRTFELEdBQUcsQ0FBQyxPQUFPLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQ2hDLENBQUMsSUFBQSxtQkFBUyxFQUNSLGdCQUFNO2FBQ0gsRUFBRSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLFlBQVksRUFBRSxtQkFBbUIsQ0FBQzthQUN2RCxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQ2pCLGdCQUFNO2FBQ0gsRUFBRSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLFlBQVksRUFBRSxtQkFBbUIsQ0FBQzthQUN2RCxNQUFNLENBQUMsR0FBRyxDQUFDLENBQ2Y7WUFDQyxJQUFBLG1CQUFTLEVBQ1AsZ0JBQU0sQ0FBQyxFQUFFLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQzdDLGdCQUFNLENBQUMsRUFBRSxDQUFDLG1CQUFtQixDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUMzQyxDQUFDO1lBQ0YsSUFBSTtZQUNKLEVBQUU7WUFDRixFQUFFO1lBQ0YsRUFBRTtZQUNGLENBQUMsQ0FDSixDQUFDO1FBQ0YsTUFBTSxHQUFHLEdBQUcsZ0JBQU07YUFDZixFQUFFLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsWUFBWSxFQUFFLG1CQUFtQixDQUFDO2FBQ3ZELE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNoQixHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDOUQsR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUM7S0FDbEM7SUFBQyxPQUFPLENBQUMsRUFBRTtRQUNWLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDaEI7QUFDSCxDQUFDLENBQUMsQ0FBQztBQUVILGNBQWMsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUU7SUFDcEMsSUFBSTtRQUNGLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQ2pDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLEdBQUUsQ0FBQyxDQUFDLENBQUM7S0FDckM7SUFBQyxPQUFPLENBQUMsRUFBRTtRQUNWLEdBQUcsQ0FBQyxhQUFhLENBQUMscUNBQXFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLEdBQUUsQ0FBQyxDQUFDLENBQUM7UUFDekUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUNoQjtBQUNILENBQUMsQ0FBQyxDQUFDIn0=