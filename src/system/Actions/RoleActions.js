"use server";

import { BaseAction } from "./BaseAction";
import { PrismaErrorFormatter } from "@/lib/PrismaErrorFormatter";
import Logger from "@/lib/Logger";
import { RoleSchema } from "@/lib/schemas/RoleSchema";
import { RoleModel } from "../Models/RoleModel";
import { Session } from "@/lib/Session";
import { revalidatePath } from "next/cache";
import { RoleService } from "../Services/RoleServices";

class RoleActions extends BaseAction {
  static get schema() {
    return RoleSchema;
  }

  static async create(formData) {
    const result = await this.execute(formData);

    if (!result.success) return result;

    try {
      const session = await Session.getCurrentUser();

      console.log(session.id, "session");

      await RoleModel.create({
        ...result.data,
        ownerId: session.id,
      });

      revalidatePath("/roles", "page");
      return {
        data: result.data,
        success: true,
        type: "success",
        redirectTo: "/roles",
      };
    } catch (error) {
      Logger.error(error.message, `Role Create fail`);
      if (error.code)
        return PrismaErrorFormatter.handle(error, result.data, ["name", "description"]);

      return {
        success: false,
        type: "fail",
        errors: { _form: ["Failed to create Role"] },
        data: result.data,
      };
    }
  }

  static async update(roleId, formData) {
    const result = await this.execute(formData);

    if (!result.success) return result;

    try {
      Logger.debug("Updating role", { roleId, data: result.data });
      await RoleService.updateResource(roleId, result.data);

      revalidatePath("/roles", "page");
      return {
        data: result.data,
        success: true,
        type: "success",
      };
    } catch (error) {
      Logger.error(error.message, "role update failed:");
      if (error.code)
        return PrismaErrorFormatter.handle(error, result.data, ["name", "description"]);

      return {
        success: false,
        type: "fail",
        errors: { _form: ["Failed to update role"] },
        data: result.data,
      };
    }
  }

  static async delete(roleId) {
    try {
      Logger.debug("Deleting role", { roleId });
      await RoleService.deleteResource(roleId);

      revalidatePath("/roles", "page");
      return {
        success: true,
        type: "success",
        message: "Role successfully deleted",
      };
    } catch (error) {
      Logger.error(error.message, "role deletion failed:");
      return {
        success: false,
        type: "fail",
        errors: { _form: ["Failed to delete role"] },
      };
    }
  }
}

export async function createRole(prevState, formData) {
  return await RoleActions.create(formData);
}

export async function updateRoleAction(prevState, { roleId, formData }) {
  return await RoleActions.update(roleId, formData);
}

export async function deleteRoleAction(prevState, roleId) {
  return await RoleActions.delete(roleId);
}
