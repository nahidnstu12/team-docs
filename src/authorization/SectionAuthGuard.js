// app/lib/authorization/guards/SectionAuthGuard.js
"use server";

import prisma from "@/app/lib/prisma";
import { BaseAuthGuard } from "./BaseAuthGuard";
import { notFound } from "next/navigation";

export class SectionAuthGuard extends BaseAuthGuard {
  static async protectBySectionId(sectionId) {
    const session = await this.getSession();

    const section = await prisma.section.findUnique({
      where: { id: sectionId },
      include: {
        project: {
          include: {
            workspace: {
              include: {
                memberships: {
                  where: { userId: session.user.id },
                },
              },
            },
          },
        },
      },
    });

    if (!section) return notFound();

    const hasAccess = section.project.workspace.memberships.length > 0;
    if (!hasAccess) this.redirectUnauthorized();

    return section;
  }
}
