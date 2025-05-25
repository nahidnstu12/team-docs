"use server";

import { BaseAction } from "./BaseAction";
import { PrismaErrorFormatter } from "@/lib/PrismaErrorFormatter";
import Logger from "@/lib/Logger";
import { Session } from "@/lib/Session";
import { UserSchema } from "@/lib/schemas/UserSchema";
import { UserModel } from "../Models/UserModel";
import bcrypt from "bcryptjs";

class UserActions extends BaseAction {
  static get schema() {
    return UserSchema;
  }

  static async create(formData) {
    const result = await this.execute(formData);

    if (!result.success) return result;

    try {
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("password", salt);
      const session = await Session.getCurrentUser();
      await UserModel.create({
        ...result.data,
        password: hashedPassword,
        // ownerId: session.id,
      });

      return {
        data: result.data,
        success: true,
        type: "success",
        redirectTo: "/users",
      };
    } catch (error) {
      Logger.error(error.message, `User Create fail`);
      if (error.code)
        return PrismaErrorFormatter.handle(error, result.data, ["username", "email", "password"]);

      return {
        success: false,
        type: "fail",
        errors: { _form: ["Failed to create User"] },
        data: result.data,
      };
    }
  }

  static async update(userId, formData) {
    Logger.debug("updateUser", JSON.stringify(formData, null, 2));
    const result = await this.execute(formData);

    if (!result.success) return result;

    Logger.debug("updateUser2", JSON.stringify(result, null, 2));

    try {
      const session = await Session.getCurrentUser();
      // if user exist
      const user = await UserModel.findUnique({
        where: {
          id: userId,
        },
      });
      if (!user) {
        return {
          success: false,
          type: "fail",
          errors: { _form: ["User not found"] },
          data: result.data,
        };
      }
      await UserModel.update({
        where: { id: userId },
        data: result.data,
      });
      return {
        data: result.data,
        success: true,
        type: "success",
      };
    } catch (error) {
      Logger.error(error.message, `User Update fail`);
      if (error.code)
        return PrismaErrorFormatter.handle(error, result.data, ["username", "email", "password"]);
    }
  }

  static async delete(userId) {
    const userExists = await UserModel.findUnique({ where: { id: userId } });
    if (!userExists) {
      return {
        success: false,
        type: "fail",
        errors: { _form: ["User not found"] },
      };
    }
    await UserModel.delete({ where: { id: userId } });
    return {
      success: true,
      type: "success",
    };
  }
}

export async function createUser(prevState, formData) {
  return await UserActions.create(formData);
}

export async function updateUser(prevState, { userId, formData }) {
  return await UserActions.update(userId, formData);
}

export async function deleteUser(userId) {
  return await UserActions.delete(userId);
}
