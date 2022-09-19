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
dotenv_1.default.config({ path: './.env' });
moment_1.default.locale('uk');
const scheduleScene = new telegraf_1.Scenes.BaseScene('scheduleScene');
exports.scheduleScene = scheduleScene;
scheduleScene.use(async (ctx, next) => {
    (0, helpers_1.activity)(ctx);
    next();
});
const checkBtn = node_emoji_1.default.get(':pushpin:');
scheduleScene.enter(schedule_service_1.default.enter);
scheduleScene.action('again', schedule_service_1.default.again);
scheduleScene.action(checkBtn, (ctx) => ctx.answerCbQuery());
scheduleScene.action('Пн', schedule_service_1.default.day);
scheduleScene.action('Вт', schedule_service_1.default.day);
scheduleScene.action('Ср', schedule_service_1.default.day);
scheduleScene.action('Чт', schedule_service_1.default.day);
scheduleScene.action('Пт', schedule_service_1.default.day);
scheduleScene.action('Сб', schedule_service_1.default.day);
scheduleScene.action('Нд', schedule_service_1.default.day);
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
scheduleScene.action('back', async (ctx) => {
    try {
        await ctx.scene.enter('scheduleScene');
        ctx.answerCbQuery();
    }
    catch (e) {
        ctx.answerCbQuery('Ой, сталася помилка. Спробуй ще раз');
        console.log(e);
    }
});
scheduleScene.action(checkBtn, async (ctx) => {
    try {
        await ctx.scene.enter('scheduleScene');
        ctx.answerCbQuery();
    }
    catch (e) {
        ctx.answerCbQuery('Ой, сталася помилка. Спробуй ще раз');
        console.log(e);
    }
});
const writeDateScene = new telegraf_1.Scenes.BaseScene('writeDateScene');
exports.writeDateScene = writeDateScene;
writeDateScene.enter((ctx) => {
    try {
        ctx.editMessageText(text_1.enterDateText, {
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [[{ text: 'Назад', callback_data: 'back' }]],
            },
        });
    }
    catch (e) {
        console.log(e);
    }
});
writeDateScene.command('start', async (ctx) => {
    try {
        ctx.session.weekShift = 0;
        await ctx.scene.enter('chooseScene');
        ctx.session.id = ctx.message.message_id;
        for (let i = ctx.session.id - 100; i <= ctx.session.id; i++) {
            ctx.deleteMessage(i).catch((err) => { });
        }
    }
    catch (e) {
        ctx.answerCbQuery('Ой, сталася помилка. Спробуй ще раз');
        console.log(e);
    }
});
writeDateScene.on('text', (ctx) => {
    try {
        if (!(0, moment_1.default)(ctx.message.text).isValid()) {
            ctx.deleteMessage(ctx.message.message_id).catch((e) => { });
            return ctx.telegram
                .editMessageText(ctx.from.id, ctx.session.oneMessageId, '', text_1.errorDateText, {
                parse_mode: 'Markdown',
                reply_markup: {
                    inline_keyboard: [[{ text: 'Назад', callback_data: 'back' }]],
                },
            })
                .catch((err) => { });
        }
        ctx.deleteMessage(ctx.message.message_id).catch((e) => { });
        ctx.session.weekShift = Math.round(((0, helpers_1.switchDay)(moment_1.default.tz(ctx.message.text, 'DD.MM.YYYY', "Europe/Zaporozhye").format('dddd'), moment_1.default.tz(ctx.message.text, 'DD.MM.YYYY', "Europe/Zaporozhye").format('L')) -
            (0, helpers_1.switchDay)(moment_1.default.tz("Europe/Zaporozhye").format('dddd'), moment_1.default.tz("Europe/Zaporozhye").format('L'))) /
            1000 /
            60 /
            60 /
            24 /
            7);
        ctx.session.day =
            moment_1.default.tz(ctx.message.text, 'DD.MM.YYYY', "Europe/Zaporozhye").format('dd').charAt(0).toUpperCase() +
                moment_1.default.tz(ctx.message.text, 'DD.MM.YYYY', "Europe/Zaporozhye").format('dd').charAt(1);
        ctx.scene.enter('scheduleScene');
    }
    catch (e) {
        console.log(e);
    }
});
writeDateScene.action('back', (ctx) => {
    try {
        ctx.scene.enter('scheduleScene');
        ctx.answerCbQuery();
    }
    catch (e) {
        ctx.answerCbQuery('Ой, сталася помилка. Спробуй ще раз');
        console.log(e);
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NoZWR1bGUuc2NlbmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvYm90L3NjZW5lcy9zY2hlZHVsZS9zY2hlZHVsZS5zY2VuZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSx1Q0FBa0M7QUFDbEMsNERBQStCO0FBQy9CLG9EQUE0QjtBQUM1QiwyQkFBeUI7QUFDekIsb0RBQTRCO0FBRzVCLHFDQUEyTjtBQUMzTiwyQ0FBb0Q7QUFDcEQsMEVBQWlEO0FBRWpELGdCQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUM7QUFDbEMsZ0JBQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7QUFFcEIsTUFBTSxhQUFhLEdBQUcsSUFBSSxpQkFBTSxDQUFDLFNBQVMsQ0FBZ0IsZUFBZSxDQUFDLENBQUM7QUF5SWxFLHNDQUFhO0FBdkl0QixhQUFhLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEVBQUU7SUFDcEMsSUFBQSxrQkFBUSxFQUFDLEdBQUcsQ0FBQyxDQUFBO0lBQ2IsSUFBSSxFQUFFLENBQUE7QUFDUixDQUFDLENBQUMsQ0FBQTtBQUVGLE1BQU0sUUFBUSxHQUFHLG9CQUFLLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBRXhDLGFBQWEsQ0FBQyxLQUFLLENBQUMsMEJBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUUzQyxhQUFhLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSwwQkFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBRXJELGFBQWEsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQztBQUM3RCxhQUFhLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSwwQkFBZSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FB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