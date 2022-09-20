"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scheduleKeyboard = void 0;
const text_1 = require("../../text");
exports.scheduleKeyboard = [
    text_1.weekDaysBtn,
    [
        { text: text_1.previousWeekText, callback_data: text_1.previousWeekText },
        { text: text_1.todayText, callback_data: text_1.todayText },
        { text: text_1.nextWeekText, callback_data: text_1.nextWeekText },
    ],
    [
        { text: text_1.manualDateBtnEntry, callback_data: text_1.manualDateBtnEntry },
        { text: text_1.allWeekBtnText, callback_data: text_1.allWeekBtnText },
    ],
    [
        { text: text_1.mainMenu, callback_data: text_1.mainMenu },
        { text: text_1.changeQueryBtnText, callback_data: text_1.changeQueryBtnText },
    ],
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NoZWR1bGUua2V5Ym9hcmQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvYm90L3NjZW5lcy9zY2hlZHVsZS9zY2hlZHVsZS5rZXlib2FyZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxxQ0FTb0I7QUFFUCxRQUFBLGdCQUFnQixHQUFHO0lBQzlCLGtCQUFXO0lBQ1g7UUFDRSxFQUFFLElBQUksRUFBRSx1QkFBZ0IsRUFBRSxhQUFhLEVBQUUsdUJBQWdCLEVBQUU7UUFDM0QsRUFBRSxJQUFJLEVBQUUsZ0JBQVMsRUFBRSxhQUFhLEVBQUUsZ0JBQVMsRUFBRTtRQUM3QyxFQUFFLElBQUksRUFBRSxtQkFBWSxFQUFFLGFBQWEsRUFBRSxtQkFBWSxFQUFFO0tBQ3BEO0lBQ0Q7UUFDRSxFQUFFLElBQUksRUFBRSx5QkFBa0IsRUFBRSxhQUFhLEVBQUUseUJBQWtCLEVBQUU7UUFDL0QsRUFBRSxJQUFJLEVBQUUscUJBQWMsRUFBRSxhQUFhLEVBQUUscUJBQWMsRUFBRTtLQUN4RDtJQUNEO1FBQ0UsRUFBRSxJQUFJLEVBQUUsZUFBUSxFQUFFLGFBQWEsRUFBRSxlQUFRLEVBQUU7UUFDM0MsRUFBRSxJQUFJLEVBQUUseUJBQWtCLEVBQUUsYUFBYSxFQUFFLHlCQUFrQixFQUFFO0tBQ2hFO0NBQ0YsQ0FBQyJ9