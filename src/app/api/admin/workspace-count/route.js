import { NextResponse } from "next/server";
import { Session } from "@/lib/Session";
import { WorkspaceService } from "@/system/Services/WorkspaceService";
import Logger from "@/lib/Logger";

/**
 * GET /api/admin/workspace-count
 * 
 * Returns the count of pending workspaces for admin sidebar badge
 * Requires admin authentication
 */
export async function GET() {
  try {
    // Ensure user is authenticated and has admin privileges
    await Session.requireAuth();
    
    // Get the pending workspace count
    const count = await WorkspaceService.getPendingWorkspacesCount();
    
    return NextResponse.json({ 
      count,
      success: true 
    });
    
  } catch (error) {
    Logger.error(error.message, "Failed to get pending workspace count");
    
    return NextResponse.json(
      { 
        error: "Failed to get pending workspace count",
        count: 0,
        success: false 
      },
      { status: 500 }
    );
  }
}
