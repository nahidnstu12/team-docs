"use server";

import prisma from "@/app/lib/prisma";
import { BaseAuthGuard } from "./BaseAuthGuard";
import { notFound } from "next/navigation";

export class PageAuthGuard extends BaseAuthGuard {
  static async protectByPageId(pageId) {
    const session = await this.getSession();

    const page = await prisma.page.findUnique({
      where: { id: pageId },
      include: {
        section: {
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
        },
      },
    });

    if (!page) return notFound();

    const hasAccess = page.section.project.workspace.memberships.length > 0;
    if (!hasAccess) this.redirectUnauthorized();

    return page;
  }
}
