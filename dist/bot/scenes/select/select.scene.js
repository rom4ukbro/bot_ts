"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.teacherScene = exports.studentScene = void 0;
const telegraf_1 = require("telegraf");
const select_service_1 = __importDefault(require("./select.service"));
const studentScene = new telegraf_1.Scenes.BaseScene('studentScene');
exports.studentScene = studentScene;
studentScene.enter(select_service_1.default.enterStudent);
studentScene.command('start', select_service_1.default.startCommand);
studentScene.on('text', select_service_1.default.textStudent);
const teacherScene = new telegraf_1.Scenes.BaseScene('teacherScene');
exports.teacherScene = teacherScene;
teacherScene.enter(select_service_1.default.enterTeacher);
teacherScene.command('start', select_service_1.default.startCommand);
teacherScene.on('text', select_service_1.default.textTeacher);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0LnNjZW5lLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2JvdC9zY2VuZXMvc2VsZWN0L3NlbGVjdC5zY2VuZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSx1Q0FBa0M7QUFHbEMsc0VBQTZDO0FBSTdDLE1BQU0sWUFBWSxHQUFHLElBQUksaUJBQU0sQ0FBQyxTQUFTLENBQWdCLGNBQWMsQ0FBQyxDQUFDO0FBa0JoRSxvQ0FBWTtBQWhCckIsWUFBWSxDQUFDLEtBQUssQ0FBQyx3QkFBYSxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBRS9DLFlBQVksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLHdCQUFhLENBQUMsWUFBWSxDQUFDLENBQUM7QUFFMUQsWUFBWSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsd0JBQWEsQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUluRCxNQUFNLFlBQVksR0FBRyxJQUFJLGlCQUFNLENBQUMsU0FBUyxDQUFnQixjQUFjLENBQUMsQ0FBQztBQVFsRCxvQ0FBWTtBQU5uQyxZQUFZLENBQUMsS0FBSyxDQUFDLHdCQUFhLENBQUMsWUFBWSxDQUFDLENBQUM7QUFFL0MsWUFBWSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsd0JBQWEsQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUUxRCxZQUFZLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSx3QkFBYSxDQUFDLFdBQVcsQ0FBQyxDQUFDIn0=