import "./styles/globals.css";
import { Toaster } from "@/components/ui/sonner";

export const metadata = {
  title: "Documentation Collaboration System",
  description:
    "Company documentation collaboration system with workspace, projects, sections and pages",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
