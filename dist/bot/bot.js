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
const MONGO_USER = process.env.MONGO_USER;
const MONGO_PASSWORD = process.env.MONGO_PASSWORD;
const MONGO_DB = process.env.MONGO_DB;
const uri = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@cluster.5pkto.mongodb.net/${MONGO_DB}?retryWrites=true&w=majority`;
const { BOT_DOMAIN, BOT_TOKEN: token } = process.env;
if (token === undefined) {
    throw new Error('BOT_TOKEN must be provided!');
}
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm90LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2JvdC9ib3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSx1Q0FJa0I7QUFDbEIsb0RBQTRCO0FBQzVCLDJCQUF5QjtBQUN6QixnQkFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQTtBQUNuQixvREFBNEI7QUFDNUIsZ0JBQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQztBQUNsQyxtREFBMEM7QUFDMUMsc0RBQThCO0FBQzlCLHdEQUFnQztBQUNoQywyQ0FBOEQ7QUFHOUQsTUFBTSxVQUFVLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUM7QUFDMUMsTUFBTSxjQUFjLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUM7QUFDbEQsTUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUM7QUFFdEMsTUFBTSxHQUFHLEdBQUcsaUJBQWlCLFVBQVUsSUFBSSxjQUFjLDhCQUE4QixRQUFRLDhCQUE4QixDQUFDO0FBRTlILE1BQU0sRUFBRSxVQUFVLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUM7QUFDckQsSUFBSSxLQUFLLEtBQUssU0FBUyxFQUFFO0lBQ3ZCLE1BQU0sSUFBSSxLQUFLLENBQUMsNkJBQTZCLENBQUMsQ0FBQztDQUNoRDtBQUdELE1BQU0sR0FBRyxHQUFHLElBQUksbUJBQVEsQ0FBZ0IsS0FBSyxDQUFDLENBQUM7QUFHL0MsTUFBTSxLQUFLLEdBQUcsSUFBSSxpQkFBTSxDQUFDLEtBQUssQ0FBZ0I7SUFDNUMsR0FBRyxnQkFBTTtDQVlWLENBQUMsQ0FBQztBQUVILEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBQSxrQkFBTyxHQUFFLENBQUMsQ0FBQztBQUNuQixHQUFHLENBQUMsR0FBRyxDQUFDLEtBQUss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