import mongoose from "mongoose";
declare class UserDTO {
    _id: number;
    name: string;
    last_name: string;
    username: string;
    default_value: string;
    default_role: string;
    last_activity: Date;
    changeNotification: boolean;
}
declare const UsersModel: mongoose.Model<{
    _id: number;
    last_activity: Date;
    changeNotification: boolean;
    blocked: boolean;
    name?: string | undefined;
    last_name?: string | undefined;
    username?: string | undefined;
    default_value?: string | undefined;
    default_role?: string | undefined;
}, {}, {}, {}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any>, {}, {}, any, {}, "type", {
    _id: number;
    last_activity: Date;
    changeNotification: boolean;
    blocked: boolean;
    name?: string | undefined;
    last_name?: string | undefined;
    username?: string | undefined;
    default_value?: string | undefined;
    default_role?: string | undefined;
}>>;
export { UsersModel, UserDTO };
