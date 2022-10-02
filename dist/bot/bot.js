"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bot = void 0;
const telegraf_1 = require("telegraf");
const moment_1 = __importDefault(require("moment"));
require("moment-timezone");
moment_1.default.locale("uk");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: "./.env" });
const user_schema_1 = require("../db/user.schema");
const scenes_1 = __importDefault(require("./scenes"));
const mongoose_1 = __importDefault(require("mongoose"));
const composers_1 = require("./composers");
const MONGO_USER = process.env.MONGO_USER;
const MONGO_PASSWORD = process.env.MONGO_PASSWORD;
const MONGO_DB = process.env.MONGO_DB;
const uri = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@cluster.5pkto.mongodb.net/${MONGO_DB}?retryWrites=true&w=majority`;
const { BOT_DOMAIN, BOT_TOKEN: token, PORT } = process.env;
if (token === undefined) {
    throw new Error("BOT_TOKEN must be provided!");
}
const bot = new telegraf_1.Telegraf(token);
exports.bot = bot;
const stage = new telegraf_1.Scenes.Stage([
    ...scenes_1.default,
]);
bot.telegram.setMyCommands([
    { command: "start", description: "Почати спілкування з ботом" },
    { command: "reset", description: "Скинути значення за замовчуванням" },
    {
        command: "change_notification",
        description: "Керувати сповіщеннями про зміни в розкладі",
    },
]);
bot.use((0, telegraf_1.session)());
bot.use(stage.middleware());
bot.use(async (ctx, next) => {
    var _a;
    await user_schema_1.UsersModel.updateOne({ _id: (_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id }, { last_activity: moment_1.default.tz("Europe/Zaporozhye").format() }).maxTimeMS(500);
    next();
});
bot.use(composers_1.command);
bot.use(composers_1.actionsDef);
bot.use(composers_1.actionsAdd);
bot.on("message", async (ctx) => {
    try {
        ctx.deleteMessage(ctx.message.message_id).catch(() => { });
    }
    catch (error) { }
});
bot.on("callback_query", (ctx) => {
    var _a;
    try {
        ctx.session.oneMessageId = Number((_a = ctx.update.callback_query.message) === null || _a === void 0 ? void 0 : _a.message_id);
        ctx.scene.enter("welcomeScene");
    }
    catch (e) {
        ctx.answerCbQuery("Ой, щось пішло не так").catch(() => { });
    }
});
mongoose_1.default.connect(uri).then(() => {
    console.log("Mongo connected");
    bot
        .launch({
        webhook: {
            hookPath: "/" + bot.secretPathComponent(),
            domain: String(BOT_DOMAIN),
            port: Number(PORT),
        },
    })
        .then(() => {
        console.log("Bot started");
    });
});
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm90LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2JvdC9ib3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQ0EsdUNBQXFEO0FBQ3JELG9EQUE0QjtBQUM1QiwyQkFBeUI7QUFDekIsZ0JBQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDcEIsb0RBQTRCO0FBQzVCLGdCQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUM7QUFDbEMsbURBQStDO0FBQy9DLHNEQUE4QjtBQUM5Qix3REFBZ0M7QUFDaEMsMkNBQThEO0FBRzlELE1BQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDO0FBQzFDLE1BQU0sY0FBYyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDO0FBQ2xELE1BQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDO0FBRXRDLE1BQU0sR0FBRyxHQUFHLGlCQUFpQixVQUFVLElBQUksY0FBYyw4QkFBOEIsUUFBUSw4QkFBOEIsQ0FBQztBQUU5SCxNQUFNLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQztBQUMzRCxJQUFJLEtBQUssS0FBSyxTQUFTLEVBQUU7SUFDdkIsTUFBTSxJQUFJLEtBQUssQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO0NBQ2hEO0FBRUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxtQkFBUSxDQUFnQixLQUFLLENBQUMsQ0FBQztBQTRFdEMsa0JBQUc7QUF4RVosTUFBTSxLQUFLLEdBQUcsSUFBSSxpQkFBTSxDQUFDLEtBQUssQ0FBZ0I7SUFDNUMsR0FBRyxnQkFBTTtDQVlWLENBQUMsQ0FBQztBQUVILEdBQUcsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDO0lBQ3pCLEVBQUUsT0FBTyxFQUFFLE9B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