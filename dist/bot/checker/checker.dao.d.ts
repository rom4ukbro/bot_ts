import { UserDTO } from "../../db/user.schema";
declare class CheckerDao {
    getValues(): Promise<{
        value: string;
        mode: "group" | "teacher";
    }[]>;
    getUsersForNotification(value: string, mode: "group" | "teacher"): Promise<UserDTO[]>;
}
declare const _default: CheckerDao;
export default _default;
