import { ThemeProvider } from "@/provider/ThemeProvider";
import MainHeader from "@/components/layout/MainHeader";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/sonner";
import { SidebarProvider } from "@/components/ui/sidebar";
import MainSidebar from "@/components/layout/mainSidebar";
import { cookies, headers } from "next/headers";

export default async function HomeLayout({ children }) {
  const cookieStore = await cookies();
  const headersList = await headers();
  const pathname = headersList.get("x-pathname");
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";
  const isEditorPage = pathname?.includes("/projects/") && pathname?.includes("/editor");

  if (isEditorPage) {
    return children; // Skip layout for editor
  }

  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
        <SidebarProvider defaultOpen={defaultOpen}>
          <div className="flex overflow-hidden w-screen h-screen">
            {/* <Sidebar /> */}
            <MainSidebar />
            <div className="flex overflow-hidden flex-col flex-1 pl-3 md:pl-6">
              <MainHeader />
              <Toaster position="top-right" richColors />
              <main className="flex-1 overflow-auto p-2 md:p-4 pl-0 md:pl-0 min-h-[80vh]">
                {children}
              </main>
            </div>
          </div>
        </SidebarProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
