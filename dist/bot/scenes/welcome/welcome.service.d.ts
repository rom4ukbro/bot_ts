import { CustomContext } from "../../custom-context";
declare class WelcomeService {
    enter(ctx: CustomContext): Promise<void>;
    statement(ctx: CustomContext): Promise<void>;
    schedule(ctx: CustomContext): Promise<unknown>;
    progress(ctx: CustomContext): Promise<true | void>;
}
declare const _default: WelcomeService;
export default _default;
