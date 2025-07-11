"use server";

import { BaseAuthGuard } from "./BaseAuthGuard";

class AdminAuthGuard extends BaseAuthGuard {
  static async protect() {
    const session = await super.getSession();
    if (!session.isSuperAdmin) return super.redirectUnauthorized();
  }
}

export async function protectAdmin() {
  await AdminAuthGuard.protect();
}
