"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_schema_1 = require("../../db/user.schema");
class CheckerDao {
    async getUsersForNotification() {
        const groups = await user_schema_1.UsersModel.aggregate()
            .match({
            changeNotification: true,
            default_value: { $ne: null },
        })
            .group({ _id: { value: "$default_value", mode: "$default_role" } });
        return groups.map((value) => value._id);
    }
    async getUsers(value, mode) {
        return await user_schema_1.UsersModel.aggregate().match({
            default_value: value,
            default_role: mode,
            changeNotification: true,
        });
    }
}
exports.default = new CheckerDao();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hlY2tlci5kYW8uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYm90L2NoZWNrZXIvY2hlY2tlci5kYW8udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzREFBMkQ7QUFFM0QsTUFBTSxVQUFVO0lBQ2QsS0FBSyxDQUFDLHVCQUF1QjtRQUczQixNQUFNLE1BQU0sR0FBVSxNQUFNLHdCQUFVLENBQUMsU0FBUyxFQUFFO2FBQy9DLEtBQUssQ0FBQztZQUNMLGtCQUFrQixFQUFFLElBQUk7WUFDeEIsYUFBYSxFQUFFLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRTtTQUM3QixDQUFDO2FBQ0QsS0FBSyxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQUUsS0FBSyxFQUFFLGdCQUFnQixFQUFFLElBQUksRUFBRSxlQUFlLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFdEUsT0FBTyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDMUMsQ0FBQztJQUVELEtBQUssQ0FBQyxRQUFRLENBQUMsS0FBYSxFQUFFLElBQXlCO1FBQ3JELE9BQU8sTUFBTSx3QkFBVSxDQUFDLFNBQVMsRUFBRSxDQUFDLEtBQUssQ0FBQztZQUN4QyxhQUFhLEVBQUUsS0FBSztZQUNwQixZQUFZLEVBQUUsSUFBSTtZQUNsQixrQkFBa0IsRUFBRSxJQUFJO1NBQ3pCLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRjtBQUVELGtCQUFlLElBQUksVUFBVSxFQUFFLENBQUMifQ==