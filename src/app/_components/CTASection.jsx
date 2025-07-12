import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CTASection() {
  return (
    <section className="py-20 bg-primary text-primary-foreground">
      <div className="container px-4 mx-auto text-center">
        <h2 className="mb-6 text-3xl font-bold md:text-4xl">On the same page as us?</h2>
        <p className="mx-auto mb-10 max-w-2xl text-xl opacity-90">
          Sign up in just a couple of clicks and start organizing your team&apos;s knowledge today.
        </p>
        <Button variant="secondary" size="lg" asChild>
          <Link href="/auth/signup">Get Started for Free →</Link>
        </Button>
        <p className="mt-3 opacity-70">30-day trial, no credit card required</p>
      </div>
    </section>
  );
}
