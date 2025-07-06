import { ThemeProvider } from "@/provider/ThemeProvider";
import RouteChangeHandler from "@/components/layout/RouteChangeHandler";
import { SessionProvider } from "next-auth/react";
import ConditionalHomeLayout from "@/components/layout/ConditionalHomeLayout";
import { cookies } from "next/headers";
import { Session } from "@/lib/Session";
import { WorkspaceService } from "@/system/Services/WorkspaceService";

export default async function HomeLayout({ children }) {
  console.log(`[DEBUG] HomeLayout START - rendering server layout`);

  let workspace = null;
  let defaultOpen = false;

  try {
    const cookieStore = await cookies();
    defaultOpen = cookieStore.get("sidebar_state")?.value === "true";
    console.log(`[DEBUG] HomeLayout - defaultOpen: ${defaultOpen}`);

    // Fetch workspace data for the header
    const workspaceId = await Session.getWorkspaceIdForUser();
    console.log(`[DEBUG] HomeLayout - workspaceId: ${workspaceId}`);

    workspace = workspaceId
      ? await WorkspaceService.getResource({ where: { id: workspaceId } })
      : null;
    console.log(`[DEBUG] HomeLayout - workspace:`, workspace?.name || "null");
  } catch (error) {
    console.error(`[DEBUG] HomeLayout ERROR:`, error);
    // Continue with null workspace if there's an error
    workspace = null;
    defaultOpen = false;
  }

  console.log(`[DEBUG] HomeLayout - About to render ConditionalHomeLayout with:`, {
    defaultOpen,
    workspaceName: workspace?.name || "null",
  });

  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
        <RouteChangeHandler />
        <ConditionalHomeLayout defaultOpen={defaultOpen} workspace={workspace}>
          {children}
        </ConditionalHomeLayout>
      </ThemeProvider>
    </SessionProvider>
  );
}
