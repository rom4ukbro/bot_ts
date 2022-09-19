import emoji from 'node-emoji';

// ===================   Text   =========================

const mainMenu = 'Головне меню';
const choiceScheduleText = 'Розклад';
const choiceProgressText = 'Успішність';
const choiceStatementText = 'Заяви';

const welcomeText = `Привіт! ${emoji.get(':wave:')}
Я — твоя права рука під час навчального року, адже в мене ти завжди можеш дізнатись, які в тебе пари протягом тижня ${emoji.get(
  ':smiling_imp:',
)}, а також свої оцінки та борги зі всіх предметів
    
Слідуй вказівкам і знайдеш все потрібне!
    
Для початку, скажи мені що ти хочеш дізнатися:`;

const chooseWelcomeText = `Для початку, скажи мені хто ти${emoji.get(':smirk_cat:')}:`;

const aboutText = `Бот, що створений, щоб спростити життя студентам і не тільки ${emoji.get(
  ':wink:',
)}

Більше не потрібно використовувати застарілий і незрозумілий сайт, щоб дізнатись, чи є завтра пари, доки можна поспати, а, можливо, й прогуляти ${emoji.get(
  ':see_no_evil:',
)}

Щось не працює
або знаєш як покращити мене?${emoji.get(':sunglasses:')}
Не соромся, пиши йому @prpl_Roman
Він точно знає що з цим робити`;

const choiceStudentText = 'Студент';
const choiceTeacherText = 'Викладач';

const changeQueryText = 'Вибери для кого шукати розклад цього разу:';

const helpText = `Допомога по командам:
    /start - Для початку спілкування з ботом
    
                      А далі інтуїтивно${emoji.get(':sweat_smile:')}
    
І нехай удача завжди буде з тобою`;

const studentWelcome = `Студент${emoji.get(':sunglasses:')}
\nНапиши мені шифр твоєї групи (або ж його частину)`;

const teacherWelcome = `Викладач${emoji.get(':sunglasses:')}
\nВідправ мені своє прізвище, цього буде достатньо`;

const errorText = `Виникла помилка, спробуй пізніше або звернись в підтримку @prpl_Roman`;
const errorLoadText = `Не вдалося завантажити розклад, спробуй пізніше ще раз\nМожливо сайт з розкладом впав${emoji.get(
  'crying_cat_face',
)}\nАбо натисніть /start`;
const previousWeekText = 'Попередній тиждень';
const todayText = 'Сьогодні';
const nextWeekText = 'Наступний тиждень';
const manualDateBtnEntry = 'Ввести дату вручну';
const changeQueryBtnText = 'Змінити запит';
const allWeekBtnText = 'Весь тиждень';
const aboutBtnText = 'Про бота';

const enterDateText = 'Просто відправ мені дату в форматі `день.місяць.рік` (01.01.2021)';
const errorDateText =
  'Схоже формат дати не зовсім вірний, спробуй ще раз' +
  'Просто відправ мені дату в форматі `день.місяць.рік` (01.01.2021)';

const noLessonsText = 'Вітаю, в тебе вихідний!';
const noLessonsWeekText = 'Вітаю, цього тижня в тебе немає пар';
const findQuery = 'Ось що вдалося знайти:';
const toManyQueryFind = 'Мені довелось обмежити кількість результатів до 100';
const cantFindQuery = 'Нічого не вдалось знайти, спробуй ще раз';
const loadSchedule = 'Розклад завантажується. Зачекай, будь ласка!';

const floodText =
  'Ну нічого собі, можеш натиснути на кнопку двічі за 0.5 секунди.\n' +
  `В тебе, напевно, найшвидша рука на Дикому Заході${emoji.get(':smirk:')}`;

const clearHistory =
  'Схоже що ти користувався попередньою версією бота, ' +
  'це чудово. Але щоб забезпечити зручне спілкування зі мною, ' +
  'пропоную очистити історію та почати все з чистого листа.';

const updateInfo =
  'Привіт.\n' +
  `Зустрічай оновлену версію бота${emoji.get(':innocent:')} ` +
  'Тепер вона стала ще зручнішою для використання.\n' +
  'Отож, нічого серйозного, розклад пар як і завжди в тебе під руками, ' +
  `твоя задача їх відвідувати${emoji.get(':sweat_smile:')}`;

const defaultValueText =
  "Одноразова процедура для того, щоб дізнатися твою групу чи ім'я\nВкажи цю інформацію для того, щоб використання бота стало зручніше\nЩоб змінити значення за замовчуванням використай команду /reset";

const resetDefaultValueText = 'Ти дійсно хочеш оновити значення по замовчуванню?';

// ===================   Progress scene   =========================

const progressWelcome = `
Для початку напиши свій логін та пароль через пробіл(\`Login Password\`)

Логін це ваша корпоративна пошта за якою ви входите в Moodle і пароль від неї`;

const progressHelpText =
  'Якщо тут видає помилку і ти впевнений, що ввів все правильно, то зайди на сайті, а потім спробуй ще раз.';

const progressTextButton = 'Оцінки';
const debtsTextButton = 'Борги(?)';
const noDebtsText = `Ти молодчинка!\nВ тебе жодного боргу. \nТак тримати${emoji.get(':+1:')}`;
const hasDebtsText = `Оййой, в тебе є кілька боргів, але не засмучуйся! Ти в все здаси!${emoji.get(
  'ok_hand',
)}`;
const loadProgress = 'Зачекай дані завантажуються';

const errorPassText = 'Твій логін чи пароль написаний не правильно. \nСпробуй ще раз';
const errorLoginText = 'Твій логін написаний не правильно. \nСпробуй ще раз';
const errorProgressText = 'Сталася помилка, завантажити оцінки не вдалося. \nСпробуй пізніше';

// ===================   Admin panel   =========================

const adminWelcome = 'Вітаю!\nВи ввійшли в панель адміністратора\n\n';

const mailingText = 'Вибери режим розсилки:';

// ===================   mailing   =========================

const simpleMail = `Напиши повідомлення яке хочеш відправити всім користувачам бота
Ти можеш використовувати редагування тексту [Markdown](https://core.telegram.org/bots/api#formatting-options)`;

const cbMail = `Напиши повідомлення яке хочеш відправити всім користувачам бота і вони зможуть написати відгук
Ти можеш використовувати редагування тексту [Markdown](https://core.telegram.org/bots/api#formatting-options)`;

const updateMail = 'Сповістити всіх про оновлення бота?\nНапиши "ТАК" для підтвердження';

// ===================   days   =========================

const weekDaysBtn = [
  { text: 'Пн', callback_data: 'Пн' },
  { text: 'Вт', callback_data: 'Вт' },
  { text: 'Ср', callback_data: 'Ср' },
  { text: 'Чт', callback_data: 'Чт' },
  { text: 'Пт', callback_data: 'Пт' },
  { text: 'Сб', callback_data: 'Сб' },
  { text: 'Нд', callback_data: 'Нд' },
];

const fullDays = {
  Пн: 'Понеділок',
  Вт: 'Вівторок',
  Ср: 'Середа',
  Чт: 'Четвер',
  Пт: "П'ятниця",
  Сб: 'Субота',
  Нд: 'Неділя',
};

// ===================   Заявки   =========================

export {
  mainMenu,
  simpleMail,
  cbMail,
  mailingText,
  updateMail,
  errorLoadText,
  clearHistory,
  updateInfo,
  loadSchedule,
  adminWelcome,
  fullDays,
  weekDaysBtn,
  welcomeText,
  aboutText,
  choiceStudentText,
  choiceTeacherText,
  changeQueryText,
  helpText,
  studentWelcome,
  teacherWelcome,
  errorText,
  nextWeekText,
  todayText,
  previousWeekText,
  manualDateBtnEntry,
  changeQueryBtnText,
  allWeekBtnText,
  aboutBtnText,
  enterDateText,
  errorDateText,
  noLessonsText,
  noLessonsWeekText,
  findQuery,
  toManyQueryFind,
  cantFindQuery,
  floodText,
  chooseWelcomeText,
  choiceScheduleText,
  choiceProgressText,
  progressWelcome,
  progressHelpText,
  progressTextButton,
  debtsTextButton,
  noDebtsText,
  hasDebtsText,
  loadProgress,
  errorPassText,
  errorProgressText,
  errorLoginText,
  defaultValueText,
  resetDefaultValueText,
  choiceStatementText,
};
