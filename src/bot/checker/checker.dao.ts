import { UserDTO, UsersModel } from "../../db/user.schema";

class CheckerDao {
  async getUsersForNotification(): Promise<
    { value: string; mode: "group" | "teacher" }[]
  > {
    const groups: any[] = await UsersModel.aggregate()
      .match({
        changeNotification: true,
        default_value: { $ne: null },
      })
      .group({ _id: { value: "$default_value", mode: "$default_role" } });

    return groups.map((value) => value._id);
  }

  async getUsers(value: string, mode: "group" | "teacher"): Promise<UserDTO[]> {
    return await UsersModel.aggregate().match({
      default_value: value,
      default_role: mode,
      changeNotification: true,
    });
  }
}

export default new CheckerDao();
