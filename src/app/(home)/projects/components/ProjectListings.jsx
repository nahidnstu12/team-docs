"use client";

import { Button } from "@/components/ui/button";
import { Edit, LayoutTemplate, Trash, UsersRound } from "lucide-react";
import CreateButtonShared from "@/components/shared/CreateButtonShared";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import TableLoading from "@/components/laoding/TableLoading";
import { useProjects } from "../hooks/useProjects";
import ClientErrorUI from "@/components/abstracts/clientErrorUI";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProjectListings({
	hasProjects,
	setIsDrawerOpen,
	startFetchProjects,
	setStartFetchProjects,
}) {
	const router = useRouter();
	const {
		data: projects,
		fetchError,
		showSkeleton,
	} = useProjects(startFetchProjects, setStartFetchProjects);

	if (fetchError)
		return (
			<ClientErrorUI errorMessage={fetchError} retry={setStartFetchProjects} />
		);

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
				<Table>
					<TableHeader className="sticky top-0 z-10 bg-muted">
						<TableRow className="text-lg font-semibold tracking-wide">
							<TableHead className="w-[160px] px-6 py-4">Name</TableHead>
							<TableHead className="w-[300px] px-6 py-4">Description</TableHead>
							<TableHead className="w-[320px] text-center px-6 py-4">
								Actions
							</TableHead>
						</TableRow>
					</TableHeader>

					<TableBody>
						{/* If no roles exist */}
						{!hasProjects ? (
							<TableRow>
								<TableCell
									colSpan={4}
									className="py-10 text-lg text-center text-muted-foreground"
								>
									No projects found.
								</TableCell>
							</TableRow>
						) : showSkeleton || projects.length === 0 ? (
							/* If still loading */
							<TableLoading />
						) : (
							/* If roles are loaded */
							projects.map((project) => (
								<TableRow
									key={project.id}
									className="transition-colors duration-200 hover:bg-muted"
								>
									{/* Your table cells content */}
									<TableCell className="px-6 py-5 text-base font-semibold">
										{project.name}
									</TableCell>
									<TableCell className="px-6 py-5 text-base text-muted-foreground">
										{project.description || (
											<span className="text-sm italic text-gray-400">
												No description
											</span>
										)}
									</TableCell>

									<TableCell className="flex items-center justify-center gap-3 px-6 py-5">
										<Button
											variant="outline"
											size="sm"
											className="flex items-center gap-1 cursor-pointer"
											onClick={() => {
												router.push(`/projects/${project.slug}/editor`);
												router.refresh();
											}}
										>
											<LayoutTemplate className="w-4 h-4" /> View
										</Button>
										<Button
											size="sm"
											variant="outline"
											className="flex items-center gap-1 bg-yellow-100 cursor-pointer"
										>
											<Edit className="w-4 h-4" /> Edit
										</Button>
										<Link href={`/projects/${project.slug}/assign-dev`}>
											<Button
												variant="outline"
												size="sm"
												className="flex items-center gap-1 bg-green-100 cursor-pointer"
											>
												<UsersRound className="w-4 h-4" /> Assign Dev
											</Button>
										</Link>
										<Button
											variant="destructive"
											size="sm"
											className="flex items-center gap-1 cursor-pointer"
										>
											<Trash className="w-4 h-4" /> Delete
										</Button>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</section>
		</section>
	);
}
