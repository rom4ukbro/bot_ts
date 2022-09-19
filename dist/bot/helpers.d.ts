import 'moment-timezone';
import { CustomContext } from './custom-context';
declare function deleteMessage(ctx: CustomContext, messageId: number, oneMessageId?: number): void;
declare function activity(ctx: CustomContext): Promise<void>;
declare function switchDay(day: string, date: string): number;
export { deleteMessage, switchDay, activity };
