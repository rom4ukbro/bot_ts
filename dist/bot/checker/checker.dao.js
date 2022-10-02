"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_schema_1 = require("../../db/user.schema");
class CheckerDao {
    async getValues() {
        const groups = await user_schema_1.UsersModel.aggregate()
            .match({
            changeNotification: true,
            default_value: { $ne: null },
            blocked: false,
        })
            .group({ _id: { value: "$default_value", mode: "$default_role" } });
        return groups.map((value) => value._id);
    }
    async getUsersForNotification(value, mode) {
        return await user_schema_1.UsersModel.aggregate().match({
            default_value: value,
            default_role: mode,
            changeNotification: true,
            blocked: false,
        });
    }
}
exports.default = new CheckerDao();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hlY2tlci5kYW8uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYm90L2NoZWNrZXIvY2hlY2tlci5kYW8udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzREFBMkQ7QUFFM0QsTUFBTSxVQUFVO0lBQ2QsS0FBSyxDQUFDLFNBQVM7UUFDYixNQUFNLE1BQU0sR0FBVSxNQUFNLHdCQUFVLENBQUMsU0FBUyxFQUFFO2FBQy9DLEtBQUssQ0FBQztZQUNMLGtCQUFrQixFQUFFLElBQUk7WUFDeEIsYUFBYSxFQUFFLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRTtZQUM1QixPQUFPLEVBQUUsS0FBSztTQUNmLENBQUM7YUFDRCxLQUFLLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFBRSxLQUFLLEVBQUUsZ0JBQWdCLEVBQUUsSUFBSSxFQUFFLGVBQWUsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUV0RSxPQUFPLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUMxQyxDQUFDO0lBRUQsS0FBSyxDQUFDLHVCQUF1QixDQUMzQixLQUFhLEVBQ2IsSUFBeUI7UUFFekIsT0FBTyxNQUFNLHdCQUFVLENBQUMsU0FBUyxFQUFFLENBQUMsS0FBSyxDQUFDO1lBQ3hDLGFBQWEsRUFBRSxLQUFLO1lBQ3BCLFlBQVksRUFBRSxJQUFJO1lBQ2xCLGtCQUFrQixFQUFFLElBQUk7WUFDeEIsT0FBTyxFQUFFLEtBQUs7U0FDZixDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0Y7QUFFRCxrQkFBZSxJQUFJLFVBQVUsRUFBRSxDQUFDIn0=