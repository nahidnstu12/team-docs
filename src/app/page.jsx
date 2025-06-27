import Header from "./_components/header";
import HeroSection from "./_components/HeroSection";
import FeaturedSection from "./_components/FeaturedSection";
// import CTASection from "./_components/CTASection";
import Footer from "./_components/Footer";
import { Session } from "@/lib/Session";

export default async function LandingPage() {
  const session = await Session.getCurrentUser();
  const isAuthenticated = await Session.isAuthenticated();
  const workspaceId = await Session.getWorkspaceIdForUser();
  return (
    <main className="min-h-screen bg-background">
      <Header session={session} />
      <HeroSection isAuthenticated={isAuthenticated} workspaceId={workspaceId} />
      <FeaturedSection />
      {/* <CTASection /> */}
      <Footer />
    </main>
  );
}
