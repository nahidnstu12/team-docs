"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

import projectEditorUI from "./../../assets/project-editor.png";

export default function LandingPage() {
	return (
		<div className="min-h-screen bg-background">
			{/* Header */}
			<header className="container flex justify-between items-center px-4 py-6 mx-auto">
				<div className="flex items-center">
					<Image
						src="/logo.svg"
						alt="Team Docs Logo"
						width={36}
						height={36}
						className="mr-2"
					/>
					<span className="text-xl font-bold">Team Docs</span>
				</div>
				<nav className="hidden space-x-8 md:flex">
					<Link
						href="#features"
						className="transition-colors text-muted-foreground hover:text-foreground"
					>
						Features
					</Link>
					<Link
						href="#pricing"
						className="transition-colors text-muted-foreground hover:text-foreground"
					>
						Pricing
					</Link>
					<Link
						href="#download"
						className="transition-colors text-muted-foreground hover:text-foreground"
					>
						Download
					</Link>
					<Link
						href="#changelog"
						className="transition-colors text-muted-foreground hover:text-foreground"
					>
						Changelog
					</Link>
				</nav>
				<div className="flex items-center space-x-4">
					<Link
						href="/auth/signin"
						className="font-medium text-muted-foreground hover:text-foreground"
					>
						Sign In
					</Link>
					<Button asChild>
						<Link href="/auth/signup">Sign Up</Link>
					</Button>
				</div>
			</header>

			{/* Hero Section */}
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
						Lost in a mess of Docs? Never quite sure who has access? Colleagues
						requesting the same information repeatedly in chat? It&apos;s time
						to get your team&apos;s knowledge organized.
					</motion.p>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.4 }}
					>
						<Button size="lg" asChild>
							<Link href="/auth/signup">Get Started for Free →</Link>
						</Button>
						<p className="mt-3 text-muted-foreground">
							30-day trial, no credit card required
						</p>
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

			{/* Features Section */}
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
								<div className="mb-3 text-xl font-semibold">
									{feature.title}
								</div>
								<p className="text-muted-foreground">{feature.description}</p>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-20 bg-primary text-primary-foreground">
				<div className="container px-4 mx-auto text-center">
					<h2 className="mb-6 text-3xl font-bold md:text-4xl">
						On the same page as us?
					</h2>
					<p className="mx-auto mb-10 max-w-2xl text-xl opacity-90">
						Sign up in just a couple of clicks and start organizing your
						team&apos;s knowledge today.
					</p>
					<Button variant="secondary" size="lg" asChild>
						<Link href="/auth/signup">Get Started for Free →</Link>
					</Button>
					<p className="mt-3 opacity-70">
						30-day trial, no credit card required
					</p>
				</div>
			</section>

			{/* Footer */}
			<footer className="py-16 border-t bg-background">
				<div className="container px-4 mx-auto">
					<div className="flex flex-col justify-between md:flex-row">
						<div className="mb-10 md:mb-0">
							<div className="flex items-center mb-4">
								<Image
									src="/logo.svg"
									alt="Team Docs Logo"
									width={32}
									height={32}
									className="mr-2"
								/>
								<span className="text-xl font-bold">Team Docs</span>
							</div>
						</div>
						<div className="grid grid-cols-2 gap-10 md:grid-cols-4">
							<div>
								<h3 className="mb-4 font-semibold">Product</h3>
								<ul className="space-y-2">
									{productLinks.map((link, index) => (
										<li key={index}>
											<Link
												href={link.href}
												className="transition-colors text-muted-foreground hover:text-foreground"
											>
												{link.text}
											</Link>
										</li>
									))}
								</ul>
							</div>
							<div>
								<h3 className="mb-4 font-semibold">Community</h3>
								<ul className="space-y-2">
									{communityLinks.map((link, index) => (
										<li key={index}>
											<Link
												href={link.href}
												className="transition-colors text-muted-foreground hover:text-foreground"
											>
												{link.text}
											</Link>
										</li>
									))}
								</ul>
							</div>
							<div>
								<h3 className="mb-4 font-semibold">Company</h3>
								<ul className="space-y-2">
									{companyLinks.map((link, index) => (
										<li key={index}>
											<Link
												href={link.href}
												className="transition-colors text-muted-foreground hover:text-foreground"
											>
												{link.text}
											</Link>
										</li>
									))}
								</ul>
							</div>
							<div>
								<h3 className="mb-4 font-semibold">Compare</h3>
								<ul className="space-y-2">
									{compareLinks.map((link, index) => (
										<li key={index}>
											<Link
												href={link.href}
												className="transition-colors text-muted-foreground hover:text-foreground"
											>
												{link.text}
											</Link>
										</li>
									))}
								</ul>
							</div>
						</div>
					</div>
					<div className="pt-8 mt-16 text-sm border-t border-muted text-muted-foreground">
						© {new Date().getFullYear()} Team Docs, Inc.
					</div>
				</div>
			</footer>
		</div>
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

const productLinks = [
	{ text: "Guide", href: "/guide" },
	{ text: "Changelog", href: "/changelog" },
	{ text: "Integrations", href: "/integrations" },
	{ text: "Download", href: "/download" },
	{ text: "Pricing", href: "/pricing" },
	{ text: "Status", href: "/status" },
];

const communityLinks = [
	{ text: "Contact Us", href: "/contact" },
	{ text: "GitHub", href: "https://github.com/teamdocs" },
	{ text: "Discuss", href: "/discuss" },
	{ text: "Twitter", href: "https://twitter.com/teamdocs" },
];

const companyLinks = [
	{ text: "About", href: "/about" },
	{ text: "Privacy", href: "/privacy" },
	{ text: "Terms of Use", href: "/terms" },
	{ text: "DPA", href: "/dpa" },
	{ text: "Climate Impact", href: "/climate" },
];

const compareLinks = [
	{ text: "Confluence", href: "/compare/confluence" },
	{ text: "Google Docs", href: "/compare/google-docs" },
];
