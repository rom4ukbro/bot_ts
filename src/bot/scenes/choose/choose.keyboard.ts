import { Markup } from "telegraf";
import { choiceStudentText, choiceTeacherText } from "../../text";

export const choiceKeyboard = () => {
  return Markup.inlineKeyboard([
    [
      { text: choiceStudentText, callback_data: choiceStudentText },
      { text: choiceTeacherText, callback_data: choiceTeacherText },
    ],
    [{ text: "Назад", callback_data: "back" }],
  ]);
};
