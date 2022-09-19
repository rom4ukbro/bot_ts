"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.welcomeScene = void 0;
const telegraf_1 = require("telegraf");
const text_1 = require("../../text");
const welcome_service_1 = __importDefault(require("./welcome.service"));
const welcomeScene = new telegraf_1.Scenes.BaseScene('welcomeScene');
exports.welcomeScene = welcomeScene;
welcomeScene.enter(welcome_service_1.default.enter);
welcomeScene.action(text_1.choiceStatementText, welcome_service_1.default.statement);
welcomeScene.action(text_1.choiceScheduleText, welcome_service_1.default.schedule);
welcomeScene.action(text_1.choiceProgressText, welcome_service_1.default.progress);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2VsY29tZS5zY2VuZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9ib3Qvc2NlbmVzL3dlbGNvbWUvd2VsY29tZS5zY2VuZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFDQSx1Q0FBa0M7QUFFbEMscUNBQXlGO0FBQ3pGLHdFQUErQztBQUcvQyxNQUFNLFlBQVksR0FBRyxJQUFJLGlCQUFNLENBQUMsU0FBUyxDQUFnQixjQUFjLENBQUMsQ0FBQztBQVVoRSxvQ0FBWTtBQVJyQixZQUFZLENBQUMsS0FBSyxDQUFDLHlCQUFjLENBQUMsS0FBSyxDQUFDLENBQUM7QUFFekMsWUFBWSxDQUFDLE1BQU0sQ0FBQywwQkFBbUIsRUFBRSx5QkFBYyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBRW5FLFlBQVksQ0FBQyxNQUFNLENBQUMseUJBQWtCLEVBQUUseUJBQWMsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUVqRSxZQUFZLENBQUMsTUFBTSxDQUFDLHlCQUFrQixFQUFFLHlCQUFjLENBQUMsUUFBUSxDQUFDLENBQUMifQ==