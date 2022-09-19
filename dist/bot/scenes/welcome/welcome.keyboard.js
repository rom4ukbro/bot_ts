"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.choiceKeyboard = void 0;
const telegraf_1 = require("telegraf");
const text_1 = require("../../text");
const choiceKeyboard = () => {
    return telegraf_1.Markup.inlineKeyboard([
        telegraf_1.Markup.button.callback(text_1.choiceScheduleText, text_1.choiceScheduleText),
    ]);
};
exports.choiceKeyboard = choiceKeyboard;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2VsY29tZS5rZXlib2FyZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9ib3Qvc2NlbmVzL3dlbGNvbWUvd2VsY29tZS5rZXlib2FyZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSx1Q0FBa0M7QUFDbEMscUNBQXlGO0FBRWxGLE1BQU0sY0FBYyxHQUFHLEdBQUcsRUFBRTtJQUNqQyxPQUFPLGlCQUFNLENBQUMsY0FBYyxDQUFDO1FBQzNCLGlCQUFNLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyx5QkFBa0IsRUFBRSx5QkFBa0IsQ0FBQztLQUcvRCxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUM7QUFOVyxRQUFBLGNBQWMsa0JBTXpCIn0=