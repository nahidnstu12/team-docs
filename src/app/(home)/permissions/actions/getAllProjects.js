"use server";

import { Session } from "@/lib/Session";
import { ProjectService } from "@/system/Services/ProjectServices";

export async function getAllProjectsFn() {
  const session = await Session.getCurrentUser();
  const projects = await ProjectService.getAllResources({ where: { ownerId: session.id } });
  return projects;
}
