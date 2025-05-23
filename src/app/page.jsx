import Header from "./_components/header";
import HeroSection from "./_components/HeroSection";
import FeaturedSection from "./_components/FeaturedSection";
import CTASection from "./_components/CTASection";
import Footer from "./_components/Footer";
import { Session } from "@/lib/Session";

export default async function LandingPage() {
  const session = await Session.getCurrentUser();
  return (
    <main className="min-h-screen bg-background">
      <Header session={session} />
      <HeroSection session={session} />
      <FeaturedSection />
      <CTASection />
      <Footer />
    </main>
  );
}
