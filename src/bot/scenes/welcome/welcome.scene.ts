import { CustomContext } from "../../custom-context";
import { Scenes } from "telegraf";

import {
  choiceScheduleText,
  choiceProgressText,
  choiceStatementText,
} from "../../text";
import welcomeService from "./welcome.service";

const welcomeScene = new Scenes.BaseScene<CustomContext>("welcomeScene");

welcomeScene.enter(welcomeService.enter);

welcomeScene.action(choiceStatementText, welcomeService.statement);

welcomeScene.action(choiceScheduleText, welcomeService.schedule);

welcomeScene.action(choiceProgressText, welcomeService.progress);

export { welcomeScene };
