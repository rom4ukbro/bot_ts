import "moment-timezone";
declare function parse(obj: any): Promise<any>;
declare function toMessage(obj: any, day: string, value: string): string;
declare function toWeekMessage(obj: any, value: string): string;
export { parse, toMessage, toWeekMessage };
