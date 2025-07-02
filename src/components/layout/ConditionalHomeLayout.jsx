"use client";

import { usePathname } from "next/navigation";
import { SidebarProvider } from "@/components/ui/sidebar";
import MainSidebar from "@/components/layout/mainSidebar";
import ConditionalMainHeader from "@/components/layout/ConditionalMainHeader";
import { Toaster } from "@/components/ui/sonner";

/**
 * Client-side conditional layout wrapper that handles layout switching
 * based on the current route. This fixes browser back button issues
 * by ensuring layout conditions are re-evaluated on client-side navigation.
 */
export default function ConditionalHomeLayout({ children, defaultOpen, workspace }) {
  const pathname = usePathname();

  // Check if current page is an editor page
  const isEditorPage = pathname?.includes("/projects/") && pathname?.includes("/editor");

  // For editor pages, return children without the home layout
  if (isEditorPage) {
    return children;
  }

  // For non-editor pages, render the full home layout
  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <div className="flex overflow-hidden w-screen h-screen">
        <MainSidebar />
        <div className="flex overflow-hidden flex-col flex-1 pl-3 md:pl-6">
          <ConditionalMainHeader workspace={workspace} />
          <Toaster position="top-right" richColors />
          <main className="flex-1 overflow-auto p-2 md:p-4 pl-0 md:pl-0 min-h-[80vh]">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
