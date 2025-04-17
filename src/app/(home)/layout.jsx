import Sidebar from "@/components/shell/Sidebar";
import { ThemeProvider } from "@/provider/ThemeProvider";
import Header from "@/components/shell/Header";
import { SidebarToggleProvider } from "@/hook/useSidebarToggle";
import { SessionProvider } from "next-auth/react";

export default function MainLayout({ children }) {
	return (
		<section>
			<SessionProvider>
				<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
					<SidebarToggleProvider>
						<div className="flex h-screen w-screen overflow-hidden">
							<Sidebar />
							<div className="flex flex-col flex-1 overflow-hidden">
								<Header />
								<main className="flex-1 overflow-auto p-4">{children}</main>
							</div>
						</div>
					</SidebarToggleProvider>
				</ThemeProvider>
			</SessionProvider>
		</section>
	);
}
