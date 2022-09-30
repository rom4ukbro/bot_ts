import { Telegraf } from "telegraf";
import "moment-timezone";
import { CustomContext } from "./custom-context";
declare const bot: Telegraf<CustomContext>;
export { bot };
