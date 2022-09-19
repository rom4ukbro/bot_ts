import 'moment-timezone';
declare function parse(obj: any): Promise<{
    date?: string | undefined;
    day?: string | undefined;
    items?: {
        number: string;
        timeBounds: string;
        info: string;
    }[] | undefined;
    sDate?: string | undefined;
    eDate?: string | undefined;
    error?: boolean | undefined;
}>;
declare function toMessage(obj: any, day: string, value: string, space: string): string;
declare function toWeekMessage(obj: any, day: string, value: string): string;
export { parse, toMessage, toWeekMessage };
