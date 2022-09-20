"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.choiceKeyboard = void 0;
const telegraf_1 = require("telegraf");
const text_1 = require("../../text");
const choiceKeyboard = () => {
    return telegraf_1.Markup.inlineKeyboard([
        [
            { text: text_1.choiceStudentText, callback_data: text_1.choiceStudentText },
            { text: text_1.choiceTeacherText, callback_data: text_1.choiceTeacherText },
        ],
        [{ text: "Назад", callback_data: "back" }],
    ]);
};
exports.choiceKeyboard = choiceKeyboard;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hvb3NlLmtleWJvYXJkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2JvdC9zY2VuZXMvY2hvb3NlL2Nob29zZS5rZXlib2FyZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSx1Q0FBa0M7QUFDbEMscUNBQWtFO0FBRTNELE1BQU0sY0FBYyxHQUFHLEdBQUcsRUFBRTtJQUNqQyxPQUFPLGlCQUFNLENBQUMsY0FBYyxDQUFDO1FBQzNCO1lBQ0UsRUFBRSxJQUFJLEVBQUUsd0JBQWlCLEVBQUUsYUFBYSxFQUFFLHdCQUFpQixFQUFFO1lBQzdELEVBQUUsSUFBSSxFQUFFLHdCQUFpQixFQUFFLGFBQWEsRUFBRSx3QkFBaUIsRUFBRTtTQUM5RDtRQUNELENBQUMsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLEVBQUUsQ0FBQztLQUMzQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUM7QUFSVyxRQUFBLGNBQWMsa0JBUXpCIn0=