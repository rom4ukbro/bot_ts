"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const telegraf_1 = require("telegraf");
const user_schema_1 = require("../../db/user.schema");
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
        user_schema_1.Users.findOneAndUpdate({ _id: (_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id }, {
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
composer.action("cbScene", (ctx) => {
    try {
        ctx.answerCbQuery().catch(() => { });
        ctx.scene.enter("cbScene");
    }
    catch (error) { }
});
exports.default = composer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWN0aW9uc0RlZi5jb21wb3Nlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9ib3QvY29tcG9zZXJzL2FjdGlvbnNEZWYuY29tcG9zZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx1Q0FBb0M7QUFDcEMsc0RBQTZDO0FBRzdDLE1BQU0sUUFBUSxHQUFHLElBQUksbUJBQVEsRUFBaUIsQ0FBQztBQUUvQyxRQUFRLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFO0lBQzdCLElBQUk7UUFDRixHQUFHLENBQUMsYUFBYSxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxHQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3BDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLEdBQUUsQ0FBQyxDQUFDLENBQUM7S0FDckM7SUFBQyxPQUFPLENBQUMsRUFBRSxHQUFFO0FBQ2hCLENBQUMsQ0FBQyxDQUFDO0FBRUgsUUFBUSxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxFQUFFOztJQUN6QyxJQUFJO1FBQ0YsbUJBQUssQ0FBQyxnQkFBZ0IsQ0FDcEIsRUFBRSxHQUFHLEVBQUUsTUFBQSxHQUFHLENBQUMsSUFBSSwwQ0FBRSxFQUFFLEVBQUUsRUFDckI7WUFDRSxhQUFhLEVBQUUsSUFBSTtZQUNuQixZQUFZLEVBQUUsSUFBSTtTQUNuQixDQUNGO2FBQ0UsS0FBSyxFQUFFO2FBQ1AsSUFBSSxDQUFDLEtBQUssSUFBSSxFQUFFO1lBQ2YsTUFBTSxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1lBQzNDLEdBQUcsQ0FBQyxhQUFhLENBQUMseUNBQXlDLEVBQUU7Z0JBQzNELFVBQVUsRUFBRSxJQUFJO2FBQ2pCLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQzthQUNELEtBQUssQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFO1lBQ2IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNuQixDQUFDLENBQUMsQ0FBQztLQUNOO0lBQUMsT0FBTyxLQUFLLEVBQUUsR0FBRTtBQUNwQixDQUFDLENBQUMsQ0FBQztBQUVILFFBQVEsQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUU7SUFDbEMsSUFBSTtRQUNGLEdBQUcsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLEdBQUUsQ0FBQyxDQUFDLENBQUM7UUFDcEMsR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLENBQUM7S0FDakM7SUFBQyxPQUFPLEtBQUssRUFBRSxHQUFFO0FBQ3BCLENBQUMsQ0FBQyxDQUFDO0FBRUgsUUFBUSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRTtJQUNqQyxJQUFJO1FBQ0YsR0FBRyxDQUFDLGFBQWEsRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsR0FBRSxDQUFDLENBQUMsQ0FBQztRQUNwQyxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztLQUM1QjtJQUFDLE9BQU8sS0FBSyxFQUFFLEdBQUU7QUFDcEIsQ0FBQyxDQUFDLENBQUM7QUFFSCxrQkFBZSxRQUFRLENBQUMifQ==