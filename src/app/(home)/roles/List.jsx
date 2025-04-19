"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { deleteWorkspace } from "./actions";
import {
	AlertDialog,
	AlertDialogTrigger,
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogFooter,
	AlertDialogTitle,
	AlertDialogDescription,
	AlertDialogCancel,
	AlertDialogAction,
} from "@/components/ui/alert-dialog";

export default function WorkspaceList({ workspaces }) {
	const [isPending, startTransition] = useTransition();
	const [selectedId, setSelectedId] = useState(null); // currently selected workspace
	const router = useRouter();

	const handleDelete = (id) => {
		startTransition(async () => {
			await deleteWorkspace(id);
			router.refresh();
		});
	};

	return (
		<div className="max-w-3xl mx-auto p-4 space-y-4">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-2xl font-bold">Workspaces</h1>
				<Link
					href="/roles/create"
					className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
				>
					Create Workspace
				</Link>
			</div>

			{workspaces.map((workspace) => (
				<div
					key={workspace.id}
					className="flex justify-between items-center p-4 border rounded-lg bg-white shadow-sm"
				>
					<div>
						<h3 className="font-medium text-lg">{workspace.name}</h3>
						{workspace.description && (
							<p className="text-gray-600 text-sm mt-1">
								{workspace.description}
							</p>
						)}
					</div>

					<div className="flex space-x-2">
						<Link
							href={`/roles/${workspace.id}/edit`}
							className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
						>
							Edit
						</Link>

						<AlertDialog>
							<AlertDialogTrigger asChild>
								<button
									onClick={() => setSelectedId(workspace.id)}
									className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
								>
									Delete
								</button>
							</AlertDialogTrigger>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
									<AlertDialogDescription>
										Are you sure you want to delete{" "}
										<strong>{workspace.name}</strong>? This action cannot be
										undone.
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel>Cancel</AlertDialogCancel>
									<AlertDialogAction
										disabled={isPending}
										onClick={() => handleDelete(selectedId)}
									>
										{isPending ? "Deleting..." : "Yes, Delete"}
									</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					</div>
				</div>
			))}
		</div>
	);
}
