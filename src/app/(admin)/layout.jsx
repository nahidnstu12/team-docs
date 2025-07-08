import { ThemeProvider } from "@/provider/ThemeProvider";
import { SessionProvider } from "next-auth/react";
import ConditionalAdminLayout from "@/components/layout/admin/ConditionalAdminLayout";
import { cookies } from "next/headers";
import { Session } from "@/lib/Session";
import { redirect } from "next/navigation";

/**
 * Admin Layout Component
 *
 * This layout wraps all admin routes and provides:
 * - Theme provider for consistent theming
 * - Session provider for authentication context
 * - Admin-specific layout with sidebar and header
 * - Server-side admin privilege check
 */
export default async function AdminLayout({ children }) {
  // Server-side admin check (since we can't use Prisma in middleware)
  const user = await Session.getCurrentUser();

  if (!user?.isSuperAdmin) {
    redirect("/");
  }

  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("admin_sidebar_state")?.value === "true";

  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
        <ConditionalAdminLayout defaultOpen={defaultOpen} user={user}>
          {children}
        </ConditionalAdminLayout>
      </ThemeProvider>
    </SessionProvider>
  );
}
