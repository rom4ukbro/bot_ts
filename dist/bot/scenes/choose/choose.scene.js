"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chooseScene = void 0;
const telegraf_1 = require("telegraf");
const text_1 = require("../../text");
const choose_service_1 = __importDefault(require("./choose.service"));
const chooseScene = new telegraf_1.Scenes.BaseScene("chooseScene");
exports.chooseScene = chooseScene;
chooseScene.enter(choose_service_1.default.enter);
chooseScene.action(text_1.choiceStudentText, choose_service_1.default.student);
chooseScene.action(text_1.choiceTeacherText, choose_service_1.default.teacher);
chooseScene.action("back", choose_service_1.default.back);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hvb3NlLnNjZW5lLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2JvdC9zY2VuZXMvY2hvb3NlL2Nob29zZS5zY2VuZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSx1Q0FBa0M7QUFFbEMscUNBQWtFO0FBQ2xFLHNFQUE2QztBQUk3QyxNQUFNLFdBQVcsR0FBRyxJQUFJLGlCQUFNLENBQUMsU0FBUyxDQUFnQixhQUFhLENBQUMsQ0FBQztBQVU5RCxrQ0FBVztBQVJwQixXQUFXLENBQUMsS0FBSyxDQUFDLHdCQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7QUFFdkMsV0FBVyxDQUFDLE1BQU0sQ0FBQyx3QkFBaUIsRUFBRSx3QkFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBRTdELFdBQVcsQ0FBQyxNQUFNLENBQUMsd0JBQWlCLEVBQUUsd0JBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUU3RCxXQUFXLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSx3QkFBYSxDQUFDLElBQUksQ0FBQyxDQUFDIn0=