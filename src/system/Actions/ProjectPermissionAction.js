"use server";
import { BaseAction } from "./BaseAction";
import { ProjectUserPermissionService } from "../Services/ProjectUserPermissionService";
import { revalidatePath } from "next/cache";
import Logger from "@/lib/Logger";

class ProjectPermissionAction extends BaseAction {
  static async assignDev(formData) {
    const result = await ProjectUserPermissionService.assignDev(formData);

    return {
      data: result.data,
      success: true,
      type: "success",
    };
  }

  static async removeDevFromProject(formData) {
    try {
      await ProjectUserPermissionService.removeDevFromProject(formData);

      revalidatePath("/projects/[slug]/assign-dev");

      return {
        success: true,
        type: "success",
        message: "Developer & permission successfully deleted",
      };
    } catch (error) {
      Logger.error(error.message, "developer & permission deletion failed:");
      return {
        success: false,
        type: "fail",
        errors: { _form: ["Failed to delete developer & permission"] },
      };
    }
  }

  static async modifyDevPermissions(formData) {
    const result = await ProjectUserPermissionService.modifyDevPermissions(formData);

    return {
      data: result.data,
      success: true,
    };
  }
}

export async function assignDevAction(formData) {
  return ProjectPermissionAction.assignDev(formData);
}

export async function removeDevFromProjectAction(formData) {
  return ProjectPermissionAction.removeDevFromProject(formData);
}

export async function modifyDevPermissionsAction(formData) {
  return ProjectPermissionAction.modifyDevPermissions(formData);
}
