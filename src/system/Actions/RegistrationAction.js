"use server";

import { z } from "zod";
import { RegistrationUserSchema } from "@/lib/schemas/UserSchema";
import { RegistrationWorkspaceSchema } from "@/lib/schemas/workspaceSchema";
import { UserModel } from "../Models/UserModel";
import { BaseAction } from "./BaseAction";
import { PrismaErrorFormatter } from "@/lib/PrismaErrorFormatter";
import Logger from "@/lib/Logger";
import slugify from "slugify";
import { WorkspaceModel } from "../Models/WorkspaceModel";
import bcrypt from "bcryptjs";
import { Session } from "@/lib/Session";

class RegistrationAction extends BaseAction {
  static get schema() {
    return z
      .object({
        username: RegistrationUserSchema.shape.username.optional(),
        email: RegistrationUserSchema.shape.email.optional(),
        password: RegistrationUserSchema.shape.password.optional(),
        workspaceName: RegistrationWorkspaceSchema.shape.name,
        workspaceDescription: RegistrationWorkspaceSchema.shape.description,
      })
      .refine(
        (data) =>
          (data.username && data.email && data.password) ||
          (!data.username && !data.email && !data.password),
        {
          message: "User fields must be either all provided or all omitted",
          path: ["username"],
        }
      );
  }

  static async register(formData, session = null) {
    const result = await this.execute(formData);

    if (!result.success) return result;

    try {
      const { username, email, password, workspaceName, workspaceDescription } = result.data;

      let userId;

      if (username && email && password) {
        // Case 1: User is registering (unauthenticated)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await UserModel.create({
          username,
          email,
          password: hashedPassword,
          status: "inactive",
        });
        userId = user.id;
      } else if (session) {
        // Case 2: Authenticated user is creating a workspace
        userId = session.id;
      } else {
        return {
          success: false,
          type: "error",
          errors: {
            _form: ["Missing user information or not authenticated."],
          },
        };
      }

      // Create the workspace
      const workspace = await WorkspaceModel.create({
        name: workspaceName,
        slug: slugify(workspaceName, { lower: true }),
        description: workspaceDescription || "",
        status: "inactive",
        ownerId: userId,
      });

      // Update user with newly created workspace ID
      await UserModel.update({
        where: { id: userId },
        data: { workspaceId: workspace.id },
      });

      return {
        success: true,
        type: "success",
        message: "Registration submitted successfully. Please check your email for confirmation.",
        data: {
          userId,
          workspaceId: workspace.id,
        },
      };
    } catch (error) {
      Logger.error(error.message, "Registration failed");

      if (error.code) {
        return PrismaErrorFormatter.handle(error, result.data, [
          "username",
          "email",
          "password",
          "workspaceName",
          "workspaceDescription",
        ]);
      }

      return {
        success: false,
        type: "error",
        errors: {
          _form: ["Registration failed. Please try again later."],
        },
        data: result.data,
      };
    }
  }
}

export async function registerNewUser(prevState, formData) {
  const session = await Session.getCurrentUser();
  return await RegistrationAction.register(formData, session);
}
