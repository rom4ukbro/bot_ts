import { Markup } from "telegraf";
import { choiceStudentText, choiceTeacherText } from "../../text";

export const choiceKeyboard = Markup.inlineKeyboard([
  [
    Markup.button.callback(choiceStudentText, choiceStudentText),
    Markup.button.callback(choiceTeacherText, choiceTeacherText),
  ],
  [Markup.button.callback('Назад', 'back')],
]);