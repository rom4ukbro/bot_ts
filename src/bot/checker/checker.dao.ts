import { UserDTO, UsersModel } from "../../db/user.schema";

class CheckerDao {
  async getValues(): Promise<{ value: string; mode: "group" | "teacher" }[]> {
    const groups: any[] = await UsersModel.aggregate()
      .match({
        changeNotification: true,
        default_value: { $ne: null },
        blocked: false,
      })
      .group({ _id: { value: "$default_value", mode: "$default_role" } });

    return groups.map((value) => value._id);
  }

  async getUsersForNotification(
    value: string,
    mode: "group" | "teacher"
  ): Promise<UserDTO[]> {
    return await UsersModel.aggregate().match({
      default_value: value,
      default_role: mode,
      changeNotification: true,
      blocked: false,
    });
  }
}

export default new CheckerDao();
