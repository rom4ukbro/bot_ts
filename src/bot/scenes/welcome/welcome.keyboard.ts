import { Markup } from "telegraf";
import { choiceScheduleText } from "../../text";

export const choiceKeyboard = () => {
  return Markup.inlineKeyboard([
    Markup.button.callback(choiceScheduleText, choiceScheduleText),
    // Markup.button.callback(choiceProgressText, choiceProgressText),
    // Markup.button.callback(choiceStatementText, choiceStatementText)
  ]);
};
