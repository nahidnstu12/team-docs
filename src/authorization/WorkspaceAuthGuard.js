"use server";

import prisma from "@/app/lib/prisma";
import { BaseAuthGuard } from "./BaseAuthGuard";

export class WorkspaceAuthGuard extends BaseAuthGuard {
  static async protect(workspaceId) {
    const session = await this.getSession();

    const membership = await prisma.workspaceMembership.findFirst({
      where: {
        userId: session.user.id,
        workspaceId,
      },
    });

    if (!membership) this.redirectUnauthorized();

    return membership;
  }
}
