import { CustomContext } from "../../custom-context";
declare class ChooseService {
    enter(ctx: CustomContext): Promise<void>;
    student(ctx: CustomContext): Promise<void>;
    teacher(ctx: CustomContext): Promise<void>;
    back(ctx: CustomContext): Promise<void>;
}
declare const _default: ChooseService;
export default _default;
