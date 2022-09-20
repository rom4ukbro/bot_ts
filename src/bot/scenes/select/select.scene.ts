import { Scenes } from "telegraf";
import { CustomContext } from "../../custom-context";

import SelectService from "./select.service";

// ===================   Student scene   =========================

const studentScene = new Scenes.BaseScene<CustomContext>("studentScene");

studentScene.enter(SelectService.enterStudent);

studentScene.command("start", SelectService.startCommand);

studentScene.on("text", SelectService.textStudent);

// ===================   Teacher scene   =========================

const teacherScene = new Scenes.BaseScene<CustomContext>("teacherScene");

teacherScene.enter(SelectService.enterTeacher);

teacherScene.command("start", SelectService.startCommand);

teacherScene.on("text", SelectService.textTeacher);

export { studentScene, teacherScene };
