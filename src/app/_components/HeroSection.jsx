"use client";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Image from "next/image";
import projectEditorUI from "./../../../assets/project-editor.png";
import Link from "next/link";

export default function HeroSection({ session }) {
  return (
    <section className="container px-4 py-16 mx-auto md:py-24">
      <div className="mx-auto max-w-4xl text-center">
        <motion.h1
          className="mb-6 text-4xl font-bold md:text-6xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Your team&apos;s knowledge base
        </motion.h1>
        <motion.p
          className="mx-auto mb-10 max-w-3xl text-xl md:text-2xl text-muted-foreground"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Lost in a mess of Docs? Never quite sure who has access? Colleagues requesting the same
          information repeatedly in chat? It&apos;s time to get your team&apos;s knowledge
          organized.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Button size="lg" asChild>
            <Link href="/auth/signup">Get Started for Free →</Link>
          </Button>
        </motion.div>
      </div>
      <motion.div
        className="relative mt-16"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.6 }}
      >
        <div className="overflow-hidden relative mx-auto max-w-5xl rounded-lg shadow-2xl">
          <Image
            src={projectEditorUI}
            alt="Team Docs Interface"
            width={1200}
            height={675}
            className="rounded-lg"
            priority
          />
        </div>
      </motion.div>
    </section>
  );
}
