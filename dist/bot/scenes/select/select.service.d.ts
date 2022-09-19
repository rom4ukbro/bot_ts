import { CustomContext } from "../../custom-context";
declare class SelectService {
    enterStudent(ctx: CustomContext): Promise<void>;
    enterTeacher(ctx: CustomContext): Promise<void>;
    startCommand(ctx: CustomContext): Promise<void>;
    textStudent(ctx: CustomContext): Promise<void>;
    textTeacher(ctx: CustomContext): Promise<void>;
    searchFnc(mode: string, ctx: CustomContext): Promise<unknown> | undefined;
}
declare const _default: SelectService;
export default _default;
