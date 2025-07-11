"use server";

import { BaseAuthGuard } from "./BaseAuthGuard";

export class UserAuthGuard extends BaseAuthGuard {
  static async protect() {
    const session = await super.getSession();
    if (!session) return super.redirectUnauthorized();
  }
}

export async function protectUser() {
  await UserAuthGuard.protect();
}
