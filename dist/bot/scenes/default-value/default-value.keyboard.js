"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.choiceKeyboard = void 0;
const telegraf_1 = require("telegraf");
const text_1 = require("../../text");
exports.choiceKeyboard = telegraf_1.Markup.inlineKeyboard([
    [
        telegraf_1.Markup.button.callback(text_1.choiceStudentText, text_1.choiceStudentText),
        telegraf_1.Markup.button.callback(text_1.choiceTeacherText, text_1.choiceTeacherText),
    ],
    [telegraf_1.Markup.button.callback("Назад", "back")],
]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdC12YWx1ZS5rZXlib2FyZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9ib3Qvc2NlbmVzL2RlZmF1bHQtdmFsdWUvZGVmYXVsdC12YWx1ZS5rZXlib2FyZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSx1Q0FBa0M7QUFDbEMscUNBQWtFO0FBRXJELFFBQUEsY0FBYyxHQUFHLGlCQUFNLENBQUMsY0FBYyxDQUFDO0lBQ2xEO1FBQ0UsaUJBQU0sQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLHdCQUFpQixFQUFFLHdCQUFpQixDQUFDO1FBQzVELGlCQUFNLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyx3QkFBaUIsRUFBRSx3QkFBaUIsQ0FBQztLQUM3RDtJQUNELENBQUMsaUJBQU0sQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQztDQUMxQyxDQUFDLENBQUMifQ==