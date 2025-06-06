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
import { Skeleton } from "@/components/ui/skeleton";
import { removeDevFromProjectAction } from "@/system/Actions/ProjectPermissionAction";
import ModifyPermissionsDrawer from "./ModifyPermissionsDrawer";

export default function DevListings({
	projectId,
	refetchTrigger,
	onRemoveDevSuccess,
}) {
	const [users, setUsers] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const [selectedDeveloper, setSelectedDeveloper] = useState(null);
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				setIsLoading(true);
				setError(null);
				const users = await getProjectUsers(projectId);
				setUsers(users);
			} catch (err) {
				setError(err.message || "Failed to fetch developers");
				console.error("Error fetching developers:", err);
			} finally {
				setIsLoading(false);
			}
		};
		fetchUsers();
	}, [projectId, refetchTrigger]);

	const LoadingSkeleton = () => (
		<>
			{[1, 2, 3].map((i) => (
				<TableRow key={i}>
					<TableCell className="px-6 py-5">
						<Skeleton className="h-6 w-[200px]" />
					</TableCell>
					<TableCell className="px-6 py-5">
						<Skeleton className="h-6 w-[300px]" />
					</TableCell>
					<TableCell className="px-6 py-5">
						<div className="flex items-center justify-center gap-3">
							<Skeleton className="h-10 w-[100px]" />
							<Skeleton className="h-10 w-[100px]" />
						</div>
					</TableCell>
				</TableRow>
			))}
		</>
	);

	const handleRemoveDev = async (userId) => {
		const result = await removeDevFromProjectAction({
			selectedUser: userId,
			projectId: projectId,
		});

		if (result.success) {
			onRemoveDevSuccess();
		}
	};

	const handleModifyClick = (developer) => {
		setSelectedDeveloper(developer);
		setIsDrawerOpen(true);
	};

	const handleDrawerClose = () => {
		setIsDrawerOpen(false);
		setSelectedDeveloper(null);
	};

	return (
		<section className="mt-8">
			{/* Header with Create Button */}
			<section className="flex items-start justify-between w-full pb-2 border-b max-h-14">
				<h1 className="text-3xl font-bold tracking-tight">
					Assigned Developers
				</h1>
			</section>
			{/* Project List */}
			<section className="mt-6 overflow-auto border shadow-lg rounded-2xl bg-background">
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
						{isLoading ? (
							<LoadingSkeleton />
						) : error ? (
							<TableRow>
								<TableCell
									colSpan={4}
									className="py-10 text-lg text-center text-destructive"
								>
									{error}
								</TableCell>
							</TableRow>
						) : users.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={4}
									className="py-10 text-lg text-center text-muted-foreground"
								>
									No Developers found.
								</TableCell>
							</TableRow>
						) : (
							users.map((user) => (
								<TableRow
									key={user.id}
									className="transition-colors duration-200 hover:bg-muted"
								>
									<TableCell className="px-6 py-5 text-base font-semibold">
										{user.username}
									</TableCell>
									<TableCell className="px-6 py-5 text-base text-muted-foreground">
										{user.projectPermissions
											.map((permission) => permission.permission.name)
											.join(", ")}
									</TableCell>

									<TableCell className="flex items-center justify-center gap-3 px-6 py-5">
										<Button
											variant="outline"
											onClick={() => handleModifyClick(user)}
										>
											Modify
										</Button>
										<Button
											variant="destructive"
											onClick={() => handleRemoveDev(user.id)}
										>
											Remove
										</Button>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</section>
			<ModifyPermissionsDrawer
				isOpen={isDrawerOpen}
				onClose={handleDrawerClose}
				developer={selectedDeveloper}
				projectId={projectId}
				onSuccess={onRemoveDevSuccess}
			/>
		</section>
	);
}
