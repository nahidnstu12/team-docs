import Header from "./_components/header";
import HeroSection from "./_components/HeroSection";
import FeaturedSection from "./_components/FeaturedSection";
import Footer from "./_components/Footer";
import { Session } from "@/lib/Session";
import { WorkspaceService } from "@/system/Services/WorkspaceService";
import Logger from "@/lib/Logger";

export const experimental_ppr = true;

export default async function LandingPage() {
  const session = await Session.getCurrentUser();
  const isAuthenticated = await Session.isAuthenticated();
  const workspaceId = await Session.getWorkspaceIdForUser();
  const workspaceStatus = workspaceId
    ? await WorkspaceService.getWorkspaceStatus(workspaceId)
    : null;

  return (
    <main className="min-h-screen bg-background">
      <Header session={session} />
      <HeroSection
        session={session}
        isAuthenticated={isAuthenticated}
        workspaceId={workspaceId}
        workspaceStatus={workspaceStatus}
      />
      <FeaturedSection
        isAuthenticated={isAuthenticated}
        workspaceId={workspaceId}
        workspaceStatus={workspaceStatus}
      />
      <Footer />
    </main>
  );
}
