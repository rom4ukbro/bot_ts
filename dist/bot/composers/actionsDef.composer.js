"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
const telegraf_1 = require("telegraf");
const user_schema_1 = require("../../db/user.schema");
const helpers_1 = require("../helpers");
const composer = new telegraf_1.Composer();
composer.action("del", (ctx) => {
    try {
        ctx.answerCbQuery().catch(() => { });
        ctx.deleteMessage().catch(() => { });
    }
    catch (e) { }
});
composer.action("reset_yes", async (ctx) => {
    var _a;
    try {
        user_schema_1.UsersModel.findOneAndUpdate({ _id: (_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id }, {
            default_value: null,
            default_role: null,
        })
            .clone()
            .then(async () => {
            await ctx.scene.enter("defaultValueScene");
            ctx.answerCbQuery("Все пройшло успішно!\nЗаповни нові дані", {
                show_alert: true,
            });
        })
            .catch((err) => {
            console.log(err);
        });
    }
    catch (error) { }
});
composer.action("reset_no", (ctx) => {
    try {
        ctx.answerCbQuery().catch(() => { });
        ctx.scene.enter("welcomeScene");
    }
    catch (error) { }
});
composer.action("cbWrite", (ctx) => {
    try {
        ctx.answerCbQuery().catch(() => { });
        ctx.scene.enter("cbScene");
    }
    catch (error) { }
});
composer.action("changeNotificationEnable", (ctx) => {
    var _a;
    try {
        ctx.deleteMessage();
        user_schema_1.UsersModel.updateOne({ _id: (_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id }, {
            changeNotification: true,
        })
            .clone()
            .then(async () => {
            ctx.answerCbQuery("Сповіщення ввімкнуто");
        })
            .catch((err) => {
            console.log(err);
        });
    }
    catch (error) { }
});
composer.action("changeNotificationDisenable", (ctx) => {
    var _a;
    try {
        ctx.deleteMessage();
        user_schema_1.UsersModel.updateOne({ _id: (_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id }, {
            changeNotification: false,
        })
            .clone()
            .then(async () => {
            ctx.answerCbQuery("Сповіщення вимкнуто");
        })
            .catch((err) => {
            console.log(err);
        });
    }
    catch (error) { }
});
composer.action(/watchChanges_.+/, async (ctx) => {
    var _a, _b, _c, _d, _e;
    try {
        ctx.answerCbQuery().catch(() => { });
        const day = (0, moment_1.default)((_a = ctx.callbackQuery.data) === null || _a === void 0 ? void 0 : _a.split("_")[1], "DD.MM.YYYY").format("dd");
        ctx.session.day = day.charAt(0).toUpperCase() + day.charAt(1);
        ctx.session.weekShift = 0;
        ctx.session.weekMode = false;
        ctx.session.value = String((_b = ctx.callbackQuery.data) === null || _b === void 0 ? void 0 : _b.split("//")[1]);
        ctx.session.mode = String((_c = ctx.callbackQuery.data) === null || _c === void 0 ? void 0 : _c.split("//")[2]);
        ctx.session.oneMessageId = Number((_d = ctx.callbackQuery.message) === null || _d === void 0 ? void 0 : _d.message_id);
        await ctx.scene.enter("scheduleScene");
        (0, helpers_1.deleteMessage)(ctx, Number((_e = ctx.callbackQuery.message) === null || _e === void 0 ? void 0 : _e.message_id), ctx.session.oneMessageId, 200);
    }
    catch (error) { }
});
exports.default = composer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWN0aW9uc0RlZi5jb21wb3Nlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9ib3QvY29tcG9zZXJzL2FjdGlvbnNEZWYuY29tcG9zZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFDQSxvREFBNEI7QUFDNUIsdUNBQW9DO0FBQ3BDLHNEQUFrRDtBQUVsRCx3Q0FBMkM7QUFFM0MsTUFBTSxRQUFRLEdBQUcsSUFBSSxtQkFBUSxFQUFpQixDQUFDO0FBRS9DLFFBQVEsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUU7SUFDN0IsSUFBSTtRQUNGLEdBQUcsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLEdBQUUsQ0FBQyxDQUFDLENBQUM7UUFDcEMsR0FBRyxDQUFDLGFBQWEsRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsR0FBRSxDQUFDLENBQUMsQ0FBQztLQUNyQztJQUFDLE9BQU8sQ0FBQyxFQUFFLEdBQUU7QUFDaEIsQ0FBQyxDQUFDLENBQUM7QUFFSCxRQUFRLENBQUMsTUFBTSxDQUFDLFdBQVcsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLEVBQUU7O0lBQ3pDLElBQUk7UUFDRix3QkFBVSxDQUFDLGdCQUFnQixDQUN6QixFQUFFLEdBQUcsRUFBRSxNQUFBLEdBQUcsQ0FBQyxJQUFJLDBDQUFFLEVBQUUsRUFBRSxFQUNyQjtZQUNFLGFBQWEsRUFBRSxJQUFJO1lBQ25CLFlBQVksRUFBRSxJQUFJO1NBQ25CLENBQ0Y7YUFDRSxLQUFLLEVBQUU7YUFDUCxJQUFJLENBQUMsS0FBSyxJQUFJLEVBQUU7WUFDZixNQUFNLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLG1CQUFtQixDQUFDLENBQUM7WUFDM0MsR0FBRyxDQUFDLGFBQWEsQ0FBQyx5Q0FBeUMsRUFBRTtnQkFDM0QsVUFBVSxFQUFFLElBQUk7YUFDakIsQ0FBQyxDQUFDO1FBQ0ws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