import { UserDTO } from "../../db/user.schema";
declare class CheckerDao {
    getUsersForNotification(): Promise<{
        value: string;
        mode: "group" | "teacher";
    }[]>;
    getUsers(value: string, mode: "group" | "teacher"): Promise<UserDTO[]>;
}
declare const _default: CheckerDao;
export default _default;
