"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const telegraf_1 = require("telegraf");
const user_schema_1 = require("../../db/user.schema");
const composer = new telegraf_1.Composer();
composer.action('del', (ctx) => {
    try {
        ctx.answerCbQuery();
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
        ctx.answerCbQuery();
        ctx.scene.enter('welcomeScene');
    }
    catch (error) { }
});
composer.action('cbScene', (ctx) => {
    try {
        ctx.answerCbQuery();
        ctx.scene.enter('cbScene');
    }
    catch (error) { }
});
exports.default = composer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWN0aW9uc0RlZi5jb21wb3Nlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9ib3QvY29tcG9zZXJzL2FjdGlvbnNEZWYuY29tcG9zZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx1Q0FBb0M7QUFDcEMsc0RBQTZDO0FBRzdDLE1BQU0sUUFBUSxHQUFHLElBQUksbUJBQVEsRUFBaUIsQ0FBQTtBQUU5QyxRQUFRLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFO0lBQzdCLElBQUk7UUFDRixHQUFHLENBQUMsYUFBYSxFQUFFLENBQUM7UUFDcEIsR0FBRyxDQUFDLGFBQWEsRUFBRSxDQUFDO0tBQ3JCO0lBQUMsT0FBTyxDQUFDLEVBQUUsR0FBRztBQUNqQixDQUFDLENBQUMsQ0FBQztBQUVILFFBQVEsQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsRUFBRTs7SUFDekMsSUFBSTtRQUNGLG1CQUFLLENBQUMsZ0JBQWdCLENBQ3BCLEVBQUUsR0FBRyxFQUFFLE1BQUEsR0FBRyxDQUFDLElBQUksMENBQUUsRUFBRSxFQUFFLEVBQ3JCO1lBQ0UsYUFBYSxFQUFFLElBQUk7WUFDbkIsWUFBWSxFQUFFLElBQUk7U0FDbkIsQ0FDRjthQUNFLEtBQUssRUFBRTthQUNQLElBQUksQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLEVBQUU7WUFDcEIsTUFBTSxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1lBQzNDLEdBQUcsQ0FBQyxhQUFhLENBQUMseUNBQXlDLEVBQUUsRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztRQUNyRixDQUFDLENBQUM7YUFDRCxLQUFLLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRTtZQUNiLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDbkIsQ0FBQyxDQUFDLENBQUM7S0FDTjtJQUFDLE9BQU8sS0FBSyxFQUFFLEdBQUc7QUFDckIsQ0FBQyxDQUFDLENBQUM7QUFFSCxRQUFRLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFO0lBQ2xDLElBQUk7UUFDRixHQUFHLENBQUMsYUFBYSxFQUFFLENBQUM7UUFDcEIsR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLENBQUM7S0FDakM7SUFBQyxPQUFPLEtBQUssRUFBRSxHQUFHO0FBQ3JCLENBQUMsQ0FBQyxDQUFDO0FBRUgsUUFBUSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRTtJQUNqQyxJQUFJO1FBQ0YsR0FBRyxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBQ3BCLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0tBQzVCO0lBQUMsT0FBTyxLQUFLLEVBQUUsR0FBRztBQUNyQixDQUFDLENBQUMsQ0FBQztBQUVILGtCQUFlLFFBQVEsQ0FBQSJ9