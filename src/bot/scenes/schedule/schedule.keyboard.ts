import {
  allWeekBtnText,
  changeQueryBtnText,
  mainMenu,
  manualDateBtnEntry,
  nextWeekText,
  previousWeekText,
  todayText,
  weekDaysBtn,
} from "../../text";

export const scheduleKeyboard = [
  weekDaysBtn,
  [
    { text: previousWeekText, callback_data: previousWeekText },
    { text: todayText, callback_data: todayText },
    { text: nextWeekText, callback_data: nextWeekText },
  ],
  [
    { text: manualDateBtnEntry, callback_data: manualDateBtnEntry },
    { text: allWeekBtnText, callback_data: allWeekBtnText },
  ],
  [
    { text: mainMenu, callback_data: mainMenu },
    { text: changeQueryBtnText, callback_data: changeQueryBtnText },
  ],
];
