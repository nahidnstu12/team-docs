import { Session } from "@/lib/Session";
import { WorkspaceService } from "@/system/Services/WorkspaceService";
import { redirect } from "next/navigation";

export default async function MainPage() {
  // await new Promise(() => {}); // infinite pending
  // const workspaceId = await Session.getWorkspaceIdForUser();

  const workspaceId = await Session.getWorkspaceIdForUser();
  const workspaceStatus = workspaceId
    ? await WorkspaceService.getWorkspaceStatus(workspaceId)
    : null;

  if (workspaceStatus !== "ACTIVE") {
    return redirect("/");
  }

  return <div className="">HomePage</div>;
}
