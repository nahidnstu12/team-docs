import Logger from "@/lib/Logger";
import { BaseService } from "./BaseService";
import { UserModel } from "../Models/UserModel";
import { UserDTO } from "../DTOs/UserDTO";

export class UserServices extends BaseService {
  static modelName = "user";
  static dto = UserDTO;

  /**
   * fetch workspace Members for assign-dev
   * @param {*} workspaceId
   * @returns
   */
  static async getMembers(workspaceId) {
    try {
      const users = await UserModel.findMany({
        where: {
          workspaceId: workspaceId,
          isWorkspaceOwner: false,
        },
        select: {
          id: true,
          username: true,
          email: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      return users;
    } catch (error) {
      Logger.error(error.message, `Get user list for project failed`);
    }
  }

  // static async getUsersNotInProject(projectId) {
  //   if (!projectId) throw new Error("projectId is missing");

  //   try {
  //     const users = await UserModel.findMany({
  //       where: {
  //         NOT: {
  //           projectPermissions: {
  //             some: {
  //               projectId: projectId,
  //             },
  //           },
  //         },
  //         isSuperAdmin: false,
  //       },
  //       select: {
  //         id: true,
  //         username: true,
  //         email: true,
  //         status: true,
  //         createdAt: true,
  //         updatedAt: true,
  //       },
  //       orderBy: {
  //         createdAt: "desc",
  //       },
  //     });
  //     return users;
  //   } catch (error) {
  //     Logger.error(error.message, `Get user list for project failed`);
  //   }
  // }
}
