import { Context } from "telegraf";
import { SceneContext, SceneContextScene, SceneSession } from "telegraf/typings/scenes";
declare type BaseBotContext = Context & SceneContext;
export interface SessionData extends SceneSession {
    oneMessageId: number;
    id: number;
    messages?: number[];
    value: string;
    mode: string;
    default_value?: string;
    default_role?: string;
    default_mode?: boolean;
    weekShift: number;
    weekMode: boolean;
    searchArr: string[];
    resultArr: string[];
    day: string;
    scheduleKeyboard: any;
    weekDaysBtn: any;
    fulDay: string;
    time: number;
    cbId: number;
    adId: number;
    delMess: number;
    text: string;
    users: number[];
    info: {
        usersCount?: number;
        weekCount?: number;
        teacherCount?: number;
        studentCount?: number;
        unknownCount?: number;
        activeCount?: number;
        blockCount?: number;
        notificationCount?: number;
    };
}
export interface CustomContext extends BaseBotContext {
    session: SessionData;
    match: RegExpExecArray;
    scene: SceneContextScene<SceneContext> & {
        state: Record<string, any>;
    };
}
export {};
