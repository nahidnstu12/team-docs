"use client";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { getProjectUsers } from "../actions/getProjectPermission";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function DevListings({ projectId }) {
	const [users, setUsers] = useState([]);

	useEffect(() => {
		const fetchUsers = async () => {
			const users = await getProjectUsers(projectId);
			setUsers(users);
		};
		fetchUsers();
	}, [projectId]);

	console.log("assign dev>>", users);
	return (
		<section className="space-y-8">
			{/* Header with Create Button */}
			<section className="flex items-start justify-between w-full pb-4 border-b max-h-14">
				<h1 className="text-3xl font-bold tracking-tight">Assign Developer</h1>
			</section>

			{/* Project List */}
			<section className="mt-8 space-y-4">
				<Table>
					<TableHeader className="sticky top-0 z-10 bg-muted">
						<TableRow className="text-lg font-semibold tracking-wide">
							<TableHead className="w-[160px] px-6 py-4">Name</TableHead>
							<TableHead className="w-[300px] px-6 py-4">Permissions</TableHead>
							<TableHead className="w-[320px] text-center px-6 py-4">
								Actions
							</TableHead>
						</TableRow>
					</TableHeader>

					<TableBody>
						{/* If no roles exist */}
						{users.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={4}
									className="py-10 text-lg text-center text-muted-foreground"
								>
									No Developers found.
								</TableCell>
							</TableRow>
						) : (
							/* If roles are loaded */
							users.map((user) => (
								<TableRow
									key={user.id}
									className="transition-colors duration-200 hover:bg-muted"
								>
									{/* Your table cells content */}
									<TableCell className="px-6 py-5 text-base font-semibold">
										{user.username}
									</TableCell>
									<TableCell className="px-6 py-5 text-base text-muted-foreground">
										{user.projectPermissions
											.map((permission) => permission.permission.name)
											.join(", ")}
									</TableCell>

									<TableCell className="flex items-center justify-center gap-3 px-6 py-5">
										<Button variant="outline">Modify</Button>
										<Button variant="destructive">Remove</Button>
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
