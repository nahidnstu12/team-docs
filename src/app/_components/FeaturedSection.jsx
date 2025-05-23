"use client";

import { motion } from "framer-motion";

export default function FeaturedSection() {
  return (
    <section id="features" className="py-20 bg-secondary/50">
      <div className="container px-4 mx-auto">
        <h2 className="mb-16 text-3xl font-bold text-center md:text-4xl">
          Why you&apos;ll love using Team Docs
        </h2>
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="p-6 rounded-lg shadow-sm bg-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="mb-3 text-xl font-semibold">{feature.title}</div>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

const features = [
  {
    title: "Blazing fast",
    description:
      "Team Docs is fast, really fast. We've worked hard to ensure millisecond response times – documents load instantly, search is speedy and navigating the UI is snappy.",
  },
  {
    title: "Collaborative",
    description:
      "Team Docs has been designed from the ground up to be powerful, realtime, and easy to use. Reading and writing docs should be enjoyable.",
  },
  {
    title: "Dark mode",
    description:
      "For the night owls, we've got you covered. Team Docs has a beautiful dark mode that's easy on the eyes and looks great.",
  },
  {
    title: "Security & permissions",
    description:
      "Manage the knowledge base with read & write permissions, user groups, guest users, public sharing, and more…",
  },
  {
    title: "20+ Integrations",
    description:
      "Simple integrations into tools you use every day like Slack, Figma, Loom and many more. Can't find the integration you need? There is an open API too.",
  },
  {
    title: "In your language",
    description:
      "Team Docs has RTL support and includes translations for 20 languages including French, Spanish, German, Korean, and Chinese.",
  },
  {
    title: "Built in public",
    description:
      "Team Docs is updated with new features and fixes regularly, checkout our public changelog to see how things are progressing!",
  },
  {
    title: "Open source",
    description:
      "Team Docs' source code is public, and development is completed in the open. Prefer to host on your own infrastructure? No problem.",
  },
  {
    title: "Customizable",
    description:
      "Custom domains allow you to have docs.yourteam.com. White label with your own brand and colors.",
  },
];
