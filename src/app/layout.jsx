import "./globals.css";
import { Inter } from "next/font/google";

export const metadata = {
	title: "Documentation Collaboration System",
	description:
		"Company documentation collaboration system with workspace, projects, sections and pages",
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${inter.className} bg-background text-foreground`}>
				{children}
			</body>
		</html>
	);
}
