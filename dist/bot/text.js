"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultValueText = exports.errorLoginText = exports.errorProgressText = exports.errorPassText = exports.loadProgress = exports.hasDebtsText = exports.noDebtsText = exports.debtsTextButton = exports.progressTextButton = exports.progressHelpText = exports.progressWelcome = exports.choiceProgressText = exports.choiceScheduleText = exports.chooseWelcomeText = exports.floodText = exports.cantFindQuery = exports.toManyQueryFind = exports.findQuery = exports.noLessonsWeekText = exports.noLessonsText = exports.errorDateText = exports.enterDateText = exports.aboutBtnText = exports.allWeekBtnText = exports.changeQueryBtnText = exports.manualDateBtnEntry = exports.previousWeekText = exports.todayText = exports.nextWeekText = exports.errorText = exports.teacherWelcome = exports.studentWelcome = exports.helpText = exports.changeQueryText = exports.choiceTeacherText = exports.choiceStudentText = exports.aboutText = exports.welcomeText = exports.weekDaysBtn = exports.fullDays = exports.adminWelcome = exports.loadSchedule = exports.updateInfo = exports.clearHistory = exports.errorLoadText = exports.updateMail = exports.mailingText = exports.cbMail = exports.simpleMail = exports.mainMenu = void 0;
exports.choiceStatementText = exports.resetDefaultValueText = void 0;
const node_emoji_1 = __importDefault(require("node-emoji"));
const mainMenu = "Головне меню";
exports.mainMenu = mainMenu;
const choiceScheduleText = "Розклад";
exports.choiceScheduleText = choiceScheduleText;
const choiceProgressText = "Успішність";
exports.choiceProgressText = choiceProgressText;
const choiceStatementText = "Заяви";
exports.choiceStatementText = choiceStatementText;
const welcomeText = `Привіт! ${node_emoji_1.default.get(":wave:")}
Я — твоя права рука під час навчального року, адже в мене ти завжди можеш дізнатись, які в тебе пари протягом тижня ${node_emoji_1.default.get(":smiling_imp:")}, а також свої оцінки та борги зі всіх предметів
    
Слідуй вказівкам і знайдеш все потрібне!
    
Для початку, скажи мені що ти хочеш дізнатися:`;
exports.welcomeText = welcomeText;
const chooseWelcomeText = `Для початку, скажи мені хто ти${node_emoji_1.default.get(":smirk_cat:")}:`;
exports.chooseWelcomeText = chooseWelcomeText;
const aboutText = `Бот, що створений, щоб спростити життя студентам і не тільки ${node_emoji_1.default.get(":wink:")}

Більше не потрібно використовувати застарілий і незрозумілий сайт, щоб дізнатись, чи є завтра пари, доки можна поспати, а, можливо, й прогуляти ${node_emoji_1.default.get(":see_no_evil:")}

Щось не працює
або знаєш як покращити мене?${node_emoji_1.default.get(":sunglasses:")}
Не соромся, пиши йому @prpl_Roman
Він точно знає що з цим робити`;
exports.aboutText = aboutText;
const choiceStudentText = "Студент";
exports.choiceStudentText = choiceStudentText;
const choiceTeacherText = "Викладач";
exports.choiceTeacherText = choiceTeacherText;
const changeQueryText = "Вибери для кого шукати розклад цього разу:";
exports.changeQueryText = changeQueryText;
const helpText = `Допомога по командам:
    /start - Для початку спілкування з ботом
    
                      А далі інтуїтивно${node_emoji_1.default.get(":sweat_smile:")}
    
І нехай удача завжди буде з тобою`;
exports.helpText = helpText;
const studentWelcome = `Студент${node_emoji_1.default.get(":sunglasses:")}
\nНапиши мені шифр твоєї групи (або ж його частину)`;
exports.studentWelcome = studentWelcome;
const teacherWelcome = `Викладач${node_emoji_1.default.get(":sunglasses:")}
\nВідправ мені своє прізвище, цього буде достатньо`;
exports.teacherWelcome = teacherWelcome;
const errorText = `Виникла помилка, спробуй пізніше або звернись в підтримку @prpl_Roman`;
exports.errorText = errorText;
const errorLoadText = `Не вдалося завантажити розклад, спробуй пізніше ще раз\nМожливо сайт з розкладом впав${node_emoji_1.default.get("crying_cat_face")}\nАбо натисніть /start`;
exports.errorLoadText = errorLoadText;
const previousWeekText = "Попередній тиждень";
exports.previousWeekText = previousWeekText;
const todayText = "Сьогодні";
exports.todayText = todayText;
const nextWeekText = "Наступний тиждень";
exports.nextWeekText = nextWeekText;
const manualDateBtnEntry = "Ввести дату вручну";
exports.manualDateBtnEntry = manualDateBtnEntry;
const changeQueryBtnText = "Змінити запит";
exports.changeQueryBtnText = changeQueryBtnText;
const allWeekBtnText = "Весь тиждень";
exports.allWeekBtnText = allWeekBtnText;
const aboutBtnText = "Про бота";
exports.aboutBtnText = aboutBtnText;
const enterDateText = "Просто відправ мені дату в форматі `день.місяць.рік` (01.01.2021)";
exports.enterDateText = enterDateText;
const errorDateText = "Схоже формат дати не зовсім вірний, спробуй ще раз" +
    "Просто відправ мені дату в форматі `день.місяць.рік` (01.01.2021)";
exports.errorDateText = errorDateText;
const noLessonsText = "Вітаю, в тебе вихідний!";
exports.noLessonsText = noLessonsText;
const noLessonsWeekText = "Вітаю, цього тижня в тебе немає пар";
exports.noLessonsWeekText = noLessonsWeekText;
const findQuery = "Ось що вдалося знайти:";
exports.findQuery = findQuery;
const toManyQueryFind = "Мені довелось обмежити кількість результатів до 100";
exports.toManyQueryFind = toManyQueryFind;
const cantFindQuery = "Нічого не вдалось знайти, спробуй ще раз";
exports.cantFindQuery = cantFindQuery;
const loadSchedule = "Розклад завантажується. Зачекай, будь ласка!";
exports.loadSchedule = loadSchedule;
const floodText = "Ну нічого собі, можеш натиснути на кнопку двічі за 0.5 секунди.\n" +
    `В тебе, напевно, найшвидша рука на Дикому Заході${node_emoji_1.default.get(":smirk:")}`;
exports.floodText = floodText;
const clearHistory = "Схоже що ти користувався попередньою версією бота, " +
    "це чудово. Але щоб забезпечити зручне спілкування зі мною, " +
    "пропоную очистити історію та почати все з чистого листа.";
exports.clearHistory = clearHistory;
const updateInfo = "Привіт.\n" +
    `Зустрічай оновлену версію бота${node_emoji_1.default.get(":innocent:")} ` +
    "Тепер вона стала ще зручнішою для використання.\n" +
    "Отож, нічого серйозного, розклад пар як і завжди в тебе під руками, " +
    `твоя задача їх відвідувати${node_emoji_1.default.get(":sweat_smile:")}`;
exports.updateInfo = updateInfo;
const defaultValueText = "Одноразова процедура для того, щоб дізнатися твою групу чи ім'я\nВкажи цю інформацію для того, щоб використання бота стало зручніше\nЩоб змінити значення за замовчуванням використай команду /reset";
exports.defaultValueText = defaultValueText;
const resetDefaultValueText = "Ти дійсно хочеш оновити значення по замовчуванню?";
exports.resetDefaultValueText = resetDefaultValueText;
const progressWelcome = `
Для початку напиши свій логін та пароль через пробіл(\`Login Password\`)

Логін це ваша корпоративна пошта за якою ви входите в Moodle і пароль від неї`;
exports.progressWelcome = progressWelcome;
const progressHelpText = "Якщо тут видає помилку і ти впевнений, що ввів все правильно, то зайди на сайті, а потім спробуй ще раз.";
exports.progressHelpText = progressHelpText;
const progressTextButton = "Оцінки";
exports.progressTextButton = progressTextButton;
const debtsTextButton = "Борги(?)";
exports.debtsTextButton = debtsTextButton;
const noDebtsText = `Ти молодчинка!\nВ тебе жодного боргу. \nТак тримати${node_emoji_1.default.get(":+1:")}`;
exports.noDebtsText = noDebtsText;
const hasDebtsText = `Оййой, в тебе є кілька боргів, але не засмучуйся! Ти в все здаси!${node_emoji_1.default.get("ok_hand")}`;
exports.hasDebtsText = hasDebtsText;
const loadProgress = "Зачекай дані завантажуються";
exports.loadProgress = loadProgress;
const errorPassText = "Твій логін чи пароль написаний не правильно. \nСпробуй ще раз";
exports.errorPassText = errorPassText;
const errorLoginText = "Твій логін написаний не правильно. \nСпробуй ще раз";
exports.errorLoginText = errorLoginText;
const errorProgressText = "Сталася помилка, завантажити оцінки не вдалося. \nСпробуй пізніше";
exports.errorProgressText = errorProgressText;
const adminWelcome = "Вітаю!\nВи ввійшли в панель адміністратора\n\n";
exports.adminWelcome = adminWelcome;
const mailingText = "Вибери режим розсилки:";
exports.mailingText = mailingText;
const simpleMail = `Напиши повідомлення яке хочеш відправити всім користувачам бота
Ти можеш використовувати редагування тексту [Markdown](https://core.telegram.org/bots/api#formatting-options)`;
exports.simpleMail = simpleMail;
const cbMail = `Напиши повідомлення яке хочеш відправити всім користувачам бота і вони зможуть написати відгук
Ти можеш використовувати редагування тексту [Markdown](https://core.telegram.org/bots/api#formatting-options)`;
exports.cbMail = cbMail;
const updateMail = 'Сповістити всіх про оновлення бота?\nНапиши "ТАК" для підтвердження';
exports.updateMail = updateMail;
const weekDaysBtn = [
    { text: "Пн", callback_data: "Пн" },
    { text: "Вт", callback_data: "Вт" },
    { text: "Ср", callback_data: "Ср" },
    { text: "Чт", callback_data: "Чт" },
    { text: "Пт", callback_data: "Пт" },
    { text: "Сб", callback_data: "Сб" },
    { text: "Нд", callback_data: "Нд" },
];
exports.weekDaysBtn = weekDaysBtn;
const fullDays = {
    Пн: "Понеділок",
    Вт: "Вівторок",
    Ср: "Середа",
    Чт: "Четвер",
    Пт: "П'ятниця",
    Сб: "Субота",
    Нд: "Неділя",
};
exports.fullDays = fullDays;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGV4dC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ib3QvdGV4dC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUEsNERBQStCO0FBSS9CLE1BQU0sUUFBUSxHQUFHLGNBQWMsQ0FBQztBQW9LOUIsNEJBQVE7QUFuS1YsTUFBTSxrQkFBa0IsR0FBRyxTQUFTLENBQUM7QUF3TW5DLGdEQUFrQjtBQXZNcEIsTUFBTSxrQkFBa0IsR0FBRyxZQUFZLENBQUM7QUF3TXRDLGdEQUFrQjtBQXZNcEIsTUFBTSxtQkFBbUIsR0FBRyxPQUFPLENBQUM7QUFvTmxDLGtEQUFtQjtBQWxOckIsTUFBTSxXQUFXLEdBQUcsV0FBVyxvQkFBSyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUM7c0hBQ29FLG9CQUFLLENBQUMsR0FBRyxDQUM3SCxlQUFlLENBQ2hCOzs7OytDQUk4QyxDQUFDO0FBb0s5QyxrQ0FBVztBQWxLYixNQUFNLGlCQUFpQixHQUFHLGlDQUFpQyxvQkFBSyxDQUFDLEdBQUcsQ0FDbEUsYUFBYSxDQUNkLEdBQUcsQ0FBQztBQXdMSCw4Q0FBaUI7QUF0TG5CLE1BQU0sU0FBUyxHQUFHLGdFQUFnRSxvQkFBSyxDQUFDLEdBQUcsQ0FDekYsUUFBUSxDQUNUOztrSkFFaUosb0JBQUssQ0FBQyxHQUFHLENBQ3pKLGVBQWUsQ0FDaEI7Ozs4QkFHNkIsb0JBQUssQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDOzsrQkFFeEIsQ0FBQztBQW9KOUIsOEJBQVM7QUFsSlgsTUFBTSxpQkFBaUIsR0FBRyxTQUFTLENBQUM7QUFtSmxDLDhDQUFpQjtBQWxKbkIsTUFBTSxpQkFBaUIsR0FBRyxVQUFVLENBQUM7QUFtSm5DLDhDQUFpQjtBQWpKbkIsTUFBTSxlQUFlLEdBQUcsNENBQTRDLENBQUM7QUFrSm5FLDBDQUFlO0FBaEpqQixNQUFNLFFBQVEsR0FBRzs7O3lDQUd3QixvQkFBSyxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUM7O2tDQUVq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