"use server";

import prisma from "@/app/lib/prisma";
import { BaseAuthGuard } from "./BaseAuthGuard";
import { notFound } from "next/navigation";

export class ProjectAuthGuard extends BaseAuthGuard {
  static async protectBySlug(slug) {
    const session = await this.getSession();

    const project = await prisma.project.findUnique({
      where: { slug },
      include: {
        workspace: {
          include: {
            memberships: {
              where: { userId: session.user.id },
            },
          },
        },
      },
    });

    if (!project) return notFound();

    const hasAccess = project.workspace.memberships.length > 0;
    if (!hasAccess) this.redirectUnauthorized();

    return project;
  }

  static async protectEditor(slug) {
    const session = await this.getSession();

    const project = await prisma.project.findUnique({
      where: { slug },
      include: {
        workspace: {
          include: {
            memberships: {
              where: {
                userId: session.user.id,
                role: { in: ["OWNER", "EDITOR"] },
              },
            },
          },
        },
      },
    });

    if (!project) return notFound();

    const hasAccess = project.workspace.memberships.length > 0;
    if (!hasAccess) this.redirectUnauthorized();

    return project;
  }
}
