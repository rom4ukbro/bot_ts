import { Scenes } from "telegraf";
import { CustomContext } from "../../custom-context";
import { choiceStudentText, choiceTeacherText } from "../../text";
import chooseService from "./choose.service";

// ===================   Welcome scene   =========================

const chooseScene = new Scenes.BaseScene<CustomContext>("chooseScene");

chooseScene.enter(chooseService.enter);

chooseScene.action(choiceStudentText, chooseService.student);

chooseScene.action(choiceTeacherText, chooseService.teacher);

chooseScene.action("back", chooseService.back);

export { chooseScene };
