import { Markup } from "telegraf";
import { choiceProgressText, choiceScheduleText, choiceStatementText } from "../../text";

export const choiceKeyboard = () => {
  return Markup.inlineKeyboard([
    Markup.button.callback(choiceScheduleText, choiceScheduleText),
    // Markup.button.callback(choiceProgressText, choiceProgressText),
    // Markup.button.callback(choiceStatementText, choiceStatementText)
  ]);
};
