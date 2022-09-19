"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getArrGroup = exports.getArrTeacher = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: './.env' });
const scheduleURL = process.env.SCHEDULE_URL || 'https://education.ugi.edu.ua/cgi-bin/timetable.cgi?';
let groupArr, teacherArr;
async function getArrTeacher() {
    const teacherUrl = `${scheduleURL}n=701&lev=141`;
    teacherArr = await getArr(teacherUrl);
    return teacherArr;
}
exports.getArrTeacher = getArrTeacher;
async function getArrGroup() {
    const groupUrl = `${scheduleURL}n=701&lev=142`;
    groupArr = await getArr(groupUrl);
    return groupArr;
}
exports.getArrGroup = getArrGroup;
async function getArr(url) {
    let arr = [];
    try {
        await (0, node_fetch_1.default)(url)
            .then((res) => res.textConverted())
            .then((response) => (arr = JSON.parse(response)['suggestions']))
            .catch((err) => {
            arr = ['error'];
        });
    }
    catch (e) {
        console.log(e);
    }
    return arr;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0R3JvdXBBbmRUZWFjaGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3BhcnNlci9nZXRHcm91cEFuZFRlYWNoZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsNERBQStCO0FBQy9CLG9EQUE0QjtBQUM1QixnQkFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDO0FBRWxDLE1BQU0sV0FBVyxHQUNmLE9BQU8sQ0FBQyxHQUFHLENBQUMsWUFBWSxJQUFJLHFEQUFxRCxDQUFDO0FBRXBGLElBQUksUUFBUSxFQUFFLFVBQVUsQ0FBQztBQUV6QixLQUFLLFVBQVUsYUFBYTtJQUMxQixNQUFNLFVBQVUsR0FBRyxHQUFHLFdBQVcsZUFBZSxDQUFDO0lBQ2pELFVBQVUsR0FBRyxNQUFNLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUN0QyxPQUFPLFVBQVUsQ0FBQztBQUNwQixDQUFDO0FBcUJRLHNDQUFhO0FBcEJ0QixLQUFLLFVBQVUsV0FBVztJQUN4QixNQUFNLFFBQVEsR0FBRyxHQUFHLFdBQVcsZUFBZSxDQUFDO0lBQy9DLFFBQVEsR0FBRyxNQUFNLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNsQyxPQUFPLFFBQVEsQ0FBQztBQUNsQixDQUFDO0FBZ0J1QixrQ0FBVztBQWRuQyxLQUFLLFVBQVUsTUFBTSxDQUFDLEdBQVc7SUFDL0IsSUFBSSxHQUFHLEdBQWEsRUFBRSxDQUFDO0lBQ3ZCLElBQUk7UUFDRixNQUFNLElBQUEsb0JBQUssRUFBQyxHQUFHLENBQUM7YUFDYixJQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsQ0FBQzthQUNsQyxJQUFJLENBQUMsQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQzthQUMvRCxLQUFLLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRTtZQUNiLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2xCLENBQUMsQ0FBQyxDQUFDO0tBQ047SUFBQyxPQUFPLENBQUMsRUFBRTtRQUNWLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDaEI7SUFDRCxPQUFPLEdBQUcsQ0FBQztBQUNiLENBQUMifQ==