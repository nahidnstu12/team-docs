import Sidebar from "@/components/layout/Sidebar";
import { ThemeProvider } from "@/provider/ThemeProvider";
import Header from "@/components/layout/Header";
import { SidebarToggleProvider } from "@/hook/useSidebarToggle";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/sonner";
import SidebarLayout from "@/components/layout/SidebarLayout";

export default function HomeLayout({ children }) {
	return (
		<section>
			<SessionProvider>
				<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
					<SidebarToggleProvider>
						<div className="flex h-screen w-screen overflow-hidden">
							{/* <Sidebar /> */}
							<SidebarLayout />
							<div className="flex flex-col flex-1 overflow-hidden">
								<Header />
								<Toaster position="top-right" richColors />
								<main className="flex-1 overflow-auto p-4 min-h-[80vh] px-4">
									{children}
								</main>
							</div>
						</div>
					</SidebarToggleProvider>
				</ThemeProvider>
			</SessionProvider>
		</section>
	);
}
