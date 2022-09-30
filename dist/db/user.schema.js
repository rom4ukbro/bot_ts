"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDTO = exports.UsersModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
class UserDTO {
}
exports.UserDTO = UserDTO;
const UserSchema = new mongoose_1.default.Schema({
    _id: { type: Number, required: true },
    name: { type: String, default: null },
    last_name: { type: String, default: null },
    username: { type: String, default: null },
    default_value: { type: String, default: null },
    default_role: { type: String, default: null },
    last_activity: { type: Date, default: new Date() },
    changeNotification: { type: Boolean, default: false },
    blocked: { type: Boolean, default: false },
}, { timestamps: true });
const UsersModel = mongoose_1.default.model("users", UserSchema);
exports.UsersModel = UsersModel;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci5zY2hlbWEuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZGIvdXNlci5zY2hlbWEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsd0RBQWdDO0FBRWhDLE1BQU0sT0FBTztDQVNaO0FBbUJvQiwwQkFBTztBQWpCNUIsTUFBTSxVQUFVLEdBQUcsSUFBSSxrQkFBUSxDQUFDLE1BQU0sQ0FDcEM7SUFDRSxHQUFHLEVBQUUsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7SUFDckMsSUFBSSxFQUFFLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFO0lBQ3JDLFNBQVMsRUFBRSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRTtJQUMxQyxRQUFRLEVBQUUsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUU7SUFDekMsYUFBYSxFQUFFLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFO0lBQzlDLFlBQVksRUFBRSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRTtJQUM3QyxhQUFhLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxJQUFJLElBQUksRUFBRSxFQUFFO0lBQ2xELGtCQUFrQixFQUFFLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFO0lBQ3JELE9BQU8sRUFBRSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRTtDQUMzQyxFQUNELEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxDQUNyQixDQUFDO0FBRUYsTUFBTSxVQUFVLEdBQUcsa0JBQVEsQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBRTlDLGdDQUFVIn0=