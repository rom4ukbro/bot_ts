"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const telegraf_1 = require("telegraf");
const user_schema_1 = require("../../db/user.schema");
const composer = new telegraf_1.Composer();
composer.action('del', (ctx) => {
    try {
        ctx.answerCbQuery().catch(() => { });
        ctx.deleteMessage();
    }
    catch (e) { }
});
composer.action('reset_yes', async (ctx) => {
    var _a;
    try {
        user_schema_1.Users.findOneAndUpdate({ _id: (_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id }, {
            default_value: null,
            default_role: null,
        })
            .clone()
            .then(async (value) => {
            await ctx.scene.enter('defaultValueScene');
            ctx.answerCbQuery('Все пройшло успішно!\nЗаповни нові дані', { show_alert: true });
        })
            .catch((err) => {
            console.log(err);
        });
    }
    catch (error) { }
});
composer.action('reset_no', (ctx) => {
    try {
        ctx.answerCbQuery().catch(() => { });
        ctx.scene.enter('welcomeScene');
    }
    catch (error) { }
});
composer.action('cbScene', (ctx) => {
    try {
        ctx.answerCbQuery().catch(() => { });
        ctx.scene.enter('cbScene');
    }
    catch (error) { }
});
exports.default = composer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWN0aW9uc0RlZi5jb21wb3Nlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9ib3QvY29tcG9zZXJzL2FjdGlvbnNEZWYuY29tcG9zZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx1Q0FBb0M7QUFDcEMsc0RBQTZDO0FBRzdDLE1BQU0sUUFBUSxHQUFHLElBQUksbUJBQVEsRUFBaUIsQ0FBQTtBQUU5QyxRQUFRLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFO0lBQzdCLElBQUk7UUFDRixHQUFHLENBQUMsYUFBYSxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxHQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3BDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsQ0FBQztLQUNyQjtJQUFDLE9BQU8sQ0FBQyxFQUFFLEdBQUc7QUFDakIsQ0FBQyxDQUFDLENBQUM7QUFFSCxRQUFRLENBQUMsTUFBTSxDQUFDLFdBQVcsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLEVBQUU7O0lBQ3pDLElBQUk7UUFDRixtQkFBSyxDQUFDLGdCQUFnQixDQUNwQixFQUFFLEdBQUcsRUFBRSxNQUFBLEdBQUcsQ0FBQyxJQUFJLDBDQUFFLEVBQUUsRUFBRSxFQUNyQjtZQUNFLGFBQWEsRUFBRSxJQUFJO1lBQ25CLFlBQVksRUFBRSxJQUFJO1NBQ25CLENBQ0Y7YUFDRSxLQUFLLEVBQUU7YUFDUCxJQUFJLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxFQUFFO1lBQ3BCLE1BQU0sR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsbUJBQW1CLENBQUMsQ0FBQztZQUMzQyxHQUFHLENBQUMsYUFBYSxDQUFDLHlDQUF5QyxFQUFFLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7UUFDckYsQ0FBQyxDQUFDO2FBQ0QsS0FBSyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUU7WUFDYixPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ25CLENBQUMsQ0FBQyxDQUFDO0tBQ047SUFBQyxPQUFPLEtBQUssRUFBRSxHQUFHO0FBQ3JCLENBQUMsQ0FBQyxDQUFDO0FBRUgsUUFBUSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRTtJQUNsQyxJQUFJO1FBQ0YsR0FBRyxDQUFDLGFBQWEsRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsR0FBRSxDQUFDLENBQUMsQ0FBQztRQUNwQyxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsQ0FBQztLQUNqQztJQUFDLE9BQU8sS0FBSyxFQUFFLEdBQUc7QUFDckIsQ0FBQyxDQUFDLENBQUM7QUFFSCxRQUFRLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFO0lBQ2pDLElBQUk7UUFDRixHQUFHLENBQUMsYUFBYSxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxHQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3BDLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0tBQzVCO0lBQUMsT0FBTyxLQUFLLEVBQUUsR0FBRztBQUNyQixDQUFDLENBQUMsQ0FBQztBQUVILGtCQUFlLFFBQVEsQ0FBQSJ9