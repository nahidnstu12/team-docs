"use client";

import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@heroui/card";
import Link from "next/link";
import { Edit, Trash } from "lucide-react";
import RenderCreateButton from "./RenderCreateButton";

export default function ProjectListings({ projects }) {
	return (
		<section className="space-y-8">
			{/* Header with Create Button */}
			<section className="flex items-start justify-between w-full pb-4 border-b max-h-14">
				<h1 className="text-3xl font-bold tracking-tight">Your Projects</h1>
				<div className="ml-auto">
					<RenderCreateButton />
				</div>
			</section>

			{/* Project List */}
			<section className="mt-8 space-y-4">
				{projects.map((project) => (
					<Card
						key={project.id}
						className="p-6 transition-all border shadow-md rounded-xl bg-background hover:shadow-lg"
					>
						<CardBody className="flex flex-row items-start justify-between gap-4 p-0">
							{/* Left: Project Info */}
							<div className="flex flex-col max-w-xl gap-1">
								<Link
									href={`/projects/${project.slug}`}
									className="text-xl font-semibold text-primary hover:underline"
								>
									{project.name}
								</Link>
								{project.description && (
									<p className="pt-2 text-sm font-light leading-normal text-muted-foreground">
										{project.description}
									</p>
								)}
							</div>

							{/* Right: Actions */}
							<div className="flex items-center gap-2">
								<Button
									variant="outline"
									size="sm"
									className="flex items-center gap-1"
								>
									<Edit className="w-4 h-4" /> Edit
								</Button>
								<Button
									variant="destructive"
									size="sm"
									className="flex items-center gap-1"
								>
									<Trash className="w-4 h-4" /> Delete
								</Button>
							</div>
						</CardBody>
					</Card>
				))}
			</section>
		</section>
	);
}
