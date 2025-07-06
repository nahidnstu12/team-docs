"use client";

import { usePathname } from "next/navigation";
import { SidebarProvider } from "@/components/ui/sidebar";
import MainSidebar from "@/components/layout/mainSidebar";
import ConditionalMainHeader from "@/components/layout/ConditionalMainHeader";

/**
 * Client-side conditional layout wrapper that handles layout switching
 * based on the current route. This fixes browser back button issues
 * by ensuring layout conditions are re-evaluated on client-side navigation.
 */
export default function ConditionalHomeLayout({ children, defaultOpen, workspace }) {
  try {
    console.log(`[DEBUG] ConditionalHomeLayout START - props:`, {
      defaultOpen,
      workspace: workspace?.name,
    });

    const pathname = usePathname();
    console.log(`[DEBUG] ConditionalHomeLayout render - pathname: ${pathname}`);

    // Check if current page is an editor page
    const isEditorPage = pathname?.includes("/projects/") && pathname?.includes("/editor");
    console.log(`[DEBUG] ConditionalHomeLayout - isEditorPage: ${isEditorPage}`);

    // For editor pages, return children without the home layout
    if (isEditorPage) {
      console.log(`[DEBUG] ConditionalHomeLayout - Returning editor layout (no header)`);
      return children;
    }

    console.log(`[DEBUG] ConditionalHomeLayout - Rendering main layout with header`);
  } catch (error) {
    console.error(`[DEBUG] ConditionalHomeLayout ERROR:`, error);
    return <div>Layout Error: {error.message}</div>;
  }

  // For non-editor pages, render the full home layout
  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <div className="flex overflow-hidden w-screen h-screen">
        <MainSidebar />
        <div className="flex overflow-hidden flex-col flex-1 pl-3 md:pl-6">
          <ConditionalMainHeader workspace={workspace} />
          <main className="flex-1 overflow-auto p-2 md:p-4 pl-0 md:pl-0 min-h-[80vh]">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
