import { Context } from "telegraf";
import {
  SceneContext,
  SceneContextScene,
  SceneSession,
} from "telegraf/typings/scenes";

type BaseBotContext = Context & SceneContext;

export interface SessionData extends SceneSession {
  // message id for update
  oneMessageId: number;
  // message ids for delete
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
  // admin trash
  adId: number;
  delMess: number;
  text: string;

  // admin
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
