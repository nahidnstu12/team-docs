"use client";

import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@heroui/card";
import Link from "next/link";
import { Edit, Trash } from "lucide-react";
import CreateButtonShared from "@/components/shared/CreateButtonShared";
import { useEffect, useState, useTransition } from "react";
import { fetchAllProjectsFn } from "../actions/getAllProjects";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProjectListings({
	setIsDrawerOpen,
	startFetchProjects,
	setStartFetchProjects,
}) {
	const [projects, setProjects] = useState([]);
	const [fetchAllProjectsPending, startFetchAllProjectTransition] =
		useTransition();

	useEffect(() => {
		async function fetchAllProjects() {
			const res = await fetchAllProjectsFn();
			startFetchAllProjectTransition(() => {
				setProjects(res);
			});
		}

		if (startFetchProjects) {
			fetchAllProjects();
			setStartFetchProjects(false);
		}
	}, [startFetchProjects, setStartFetchProjects]);

	return (
		<section className="space-y-8">
			{/* Header with Create Button */}
			<section className="flex items-start justify-between w-full pb-4 border-b max-h-14">
				<h1 className="text-3xl font-bold tracking-tight">Your Projects</h1>
				<div className="ml-auto">
					<CreateButtonShared onClick={() => setIsDrawerOpen(true)}>
						Create project
					</CreateButtonShared>
				</div>
			</section>

			{/* Project List */}
			<section className="mt-8 space-y-4">
				{fetchAllProjectsPending
					? [...Array(5)].map((_, i) => (
							<Card
								key={`skeleton-project-${i}`}
								className="p-6 transition-all border shadow-md rounded-xl bg-background hover:shadow-lg"
							>
								<CardBody className="flex flex-row items-start justify-between gap-4 p-0">
									{/* Left Skeleton: Project Info */}
									<div className="flex flex-col max-w-xl gap-3">
										<Skeleton className="w-64 h-5 rounded-md " />
									</div>

									{/* Right Skeleton: Actions */}
									<div className="flex items-center gap-2">
										<Skeleton className="w-20 h-8 rounded-md bg-muted/30" />
									</div>
								</CardBody>
							</Card>
					  ))
					: projects.map((project) => (
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
											className="flex items-center gap-1 cursor-pointer"
										>
											<Edit className="w-4 h-4" /> Edit
										</Button>
										<Button
											variant="destructive"
											size="sm"
											className="flex items-center gap-1 cursor-pointer"
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
