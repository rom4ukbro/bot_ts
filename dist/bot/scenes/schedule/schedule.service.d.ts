import { CustomContext } from "../../custom-context";
declare class ScheduleService {
    enter(ctx: CustomContext): Promise<true | (import("typegram").Update.Edited & import("typegram").Message.TextMessage) | undefined>;
    statement(ctx: CustomContext): Promise<void>;
    day(ctx: CustomContext): Promise<void>;
    previousWeek(ctx: CustomContext): Promise<void>;
    nextWeek(ctx: CustomContext): Promise<void>;
    today(ctx: CustomContext): Promise<void>;
    mainMenu(ctx: CustomContext): Promise<void>;
    changeQuery(ctx: CustomContext): Promise<void>;
    choiceStudent(ctx: CustomContext): Promise<void>;
    choiceTeacher(ctx: CustomContext): Promise<void>;
    manualDate(ctx: CustomContext): Promise<void>;
    about(ctx: CustomContext): Promise<void>;
    allWeek(ctx: CustomContext): Promise<void>;
    again(ctx: CustomContext): Promise<void>;
    daySchedule(day: string, ctx: CustomContext): Promise<unknown>;
}
declare const _default: ScheduleService;
export default _default;
