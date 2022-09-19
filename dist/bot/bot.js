"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const telegraf_1 = require("telegraf");
const moment_1 = __importDefault(require("moment"));
require("moment-timezone");
moment_1.default.locale('uk');
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: './.env' });
const user_schema_1 = require("../db/user.schema");
const scenes_1 = __importDefault(require("./scenes"));
const mongoose_1 = __importDefault(require("mongoose"));
const composers_1 = require("./composers");
const server_1 = require("../server");
const MONGO_USER = process.env.MONGO_USER;
const MONGO_PASSWORD = process.env.MONGO_PASSWORD;
const MONGO_DB = process.env.MONGO_DB;
const uri = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@cluster.5pkto.mongodb.net/${MONGO_DB}?retryWrites=true&w=majority`;
const { BOT_DOMAIN, BOT_TOKEN: token } = process.env;
if (token === undefined) {
    throw new Error('BOT_TOKEN must be provided!');
}
server_1.http;
const bot = new telegraf_1.Telegraf(token);
const stage = new telegraf_1.Scenes.Stage([
    ...scenes_1.default,
]);
bot.use((0, telegraf_1.session)());
bot.use(stage.middleware());
bot.use(async (ctx, next) => {
    var _a;
    await user_schema_1.Users.updateOne({ _id: (_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id }, { last_activity: moment_1.default.tz("Europe/Zaporozhye").format() }).maxTimeMS(500);
    next();
});
bot.use(composers_1.command);
bot.use(composers_1.actionsDef);
bot.use(composers_1.actionsAdd);
bot.on('message', async (ctx) => {
    try {
        ctx.deleteMessage(ctx.message.message_id).catch((e) => { });
    }
    catch (error) { }
});
bot.on('callback_query', (ctx) => {
    var _a;
    try {
        ctx.session.oneMessageId = Number((_a = ctx.update.callback_query.message) === null || _a === void 0 ? void 0 : _a.message_id);
        ctx.scene.enter('welcomeScene');
    }
    catch (e) {
        ctx.answerCbQuery('Ой, щось пішло не так');
    }
});
mongoose_1.default.connect(uri).then(() => {
    console.log("Mongo connected");
    bot.launch({
        webhook: {
            hookPath: "/" + bot.secretPathComponent(),
            domain: String(BOT_DOMAIN),
            port: 3030
        },
    }).then(() => console.log("Bot start"));
});
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
module.exports = { bot };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm90LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2JvdC9ib3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSx1Q0FJa0I7QUFDbEIsb0RBQTRCO0FBQzVCLDJCQUF5QjtBQUN6QixnQkFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQTtBQUNuQixvREFBNEI7QUFDNUIsZ0JBQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQztBQUNsQyxtREFBMEM7QUFDMUMsc0RBQThCO0FBQzlCLHdEQUFnQztBQUNoQywyQ0FBOEQ7QUFFOUQsc0NBQWlDO0FBRWpDLE1BQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDO0FBQzFDLE1BQU0sY0FBYyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDO0FBQ2xELE1BQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDO0FBRXRDLE1BQU0sR0FBRyxHQUFHLGlCQUFpQixVQUFVLElBQUksY0FBYyw4QkFBOEIsUUFBUSw4QkFBOEIsQ0FBQztBQUU5SCxNQUFNLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDO0FBQ3JELElBQUksS0FBSyxLQUFLLFNBQVMsRUFBRTtJQUN2QixNQUFNLElBQUksS0FBSyxDQUFDLDZCQUE2QixDQUFDLENBQUM7Q0FDaEQ7QUFFRCxhQUFJLENBQUE7QUFHSixNQUFNLEdBQUcsR0FBRyxJQUFJLG1CQUFRLENBQWdCLEtBQUssQ0FBQyxDQUFDO0FBRy9DLE1BQU0sS0FBSyxHQUFHLElBQUksaUJBQU0sQ0FBQyxLQUFLLENBQWdCO0lBQzVDLEdBQUcsZ0JBQU07Q0FZVixDQUFDLENBQUM7QUFFSCxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUEsa0JBQU8sR0FBRSxDQUFDLENBQUM7QUFD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