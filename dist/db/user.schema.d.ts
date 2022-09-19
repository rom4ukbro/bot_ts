import mongoose from 'mongoose';
declare const Users: mongoose.Model<{
    _id: number;
    last_activity: Date;
    name?: string | undefined;
    last_name?: string | undefined;
    username?: string | undefined;
    default_value?: string | undefined;
    default_role?: string | undefined;
}, {}, {}, {}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any>, {}, {}, any, {}, "type", {
    _id: number;
    last_activity: Date;
    name?: string | undefined;
    last_name?: string | undefined;
    username?: string | undefined;
    default_value?: string | undefined;
    default_role?: string | undefined;
}>>;
export { Users };
