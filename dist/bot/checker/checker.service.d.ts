declare class CheckerService {
    hasScheduleChanges(value: string, mode?: "group" | "teacher"): Promise<false | {
        date: string;
        day: string;
        items: {
            number: string;
            timeBounds: string;
            info: string;
        }[];
    }[]>;
}
declare const _default: CheckerService;
export default _default;
