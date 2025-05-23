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

class RegistrationAction extends BaseAction {
  static get schema() {
    return z.object({
      // User information
      username: RegistrationUserSchema.shape.username,
      email: RegistrationUserSchema.shape.email,
      password: RegistrationUserSchema.shape.password,
      
      // Workspace information
      workspaceName: RegistrationWorkspaceSchema.shape.name,
      workspaceDescription: RegistrationWorkspaceSchema.shape.description,
    });
  }

  static async register(formData) {
    const result = await this.execute(formData);
    
    if (!result.success) return result;
    
    try {
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(result.data.password, salt);
      
      // Create the user with inactive status
      const user = await UserModel.create({
        username: result.data.username,
        email: result.data.email,
        password: hashedPassword,
        status: "inactive",
      });

      // Create workspace with inactive status
      const workspace = await WorkspaceModel.create({
        name: result.data.workspaceName,
        slug: slugify(result.data.workspaceName, { lower: true }),
        description: result.data.workspaceDescription || "",
        status: "inactive",
        ownerId: user.id,
      });

      // In a real app, send confirmation email here
      // await sendConfirmationEmail(user.email);

      return {
        success: true,
        type: "success",
        message: "Registration submitted successfully. Please check your email for confirmation.",
        data: {
          userId: user.id,
          workspaceId: workspace.id,
        },
      };
    } catch (error) {
      Logger.error(error.message, `Registration failed`);
      
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
        errors: { _form: ["Registration failed. Please try again later."] },
        data: result.data,
      };
    }
  }
}

export async function registerNewUser(prevState, formData) {
  return await RegistrationAction.register(formData);
}
