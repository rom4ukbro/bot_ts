import mongoose from "mongoose";

class UserDTO {
  _id: number;
  name: string;
  last_name: string;
  username: string;
  default_value: string;
  default_role: string;
  last_activity: Date;
  changeNotification: boolean;
}

const UserSchema = new mongoose.Schema(
  {
    _id: { type: Number, required: true },
    name: { type: String, default: null },
    last_name: { type: String, default: null },
    username: { type: String, default: null },
    default_value: { type: String, default: null },
    default_role: { type: String, default: null },
    last_activity: { type: Date, default: new Date() },
    changeNotification: { type: Boolean, default: false },
    blocked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const UsersModel = mongoose.model("users", UserSchema);

export { UsersModel, UserDTO };
