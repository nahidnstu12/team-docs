import { ThemeProvider } from "@/provider/ThemeProvider";
import Header from "@/components/layout/Header";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/sonner";
import { SidebarProvider } from "@/components/ui/sidebar";
import MainSidebar from "@/components/layout/MainSidebar";
import { cookies } from "next/headers";

export default async function HomeLayout({ children }) {
	const cookieStore = await cookies();
	const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

	return (
		<SessionProvider>
			<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
				<SidebarProvider defaultOpen={defaultOpen}>
					<div className="flex w-screen h-screen overflow-hidden">
						{/* <Sidebar /> */}
						<MainSidebar />
						<div className="flex flex-col flex-1 pl-6 overflow-hidden">
							<Header />
							<Toaster position="top-right" richColors />
							<main className="flex-1 overflow-auto p-4 min-h-[80vh]">
								{children}
							</main>
						</div>
					</div>
				</SidebarProvider>
			</ThemeProvider>
		</SessionProvider>
	);
}
