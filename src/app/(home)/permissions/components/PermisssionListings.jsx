"use client";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import CreateButtonShared from "@/components/shared/CreateButtonShared";

export default function PermissionLisitngs({ permissions, setIsDialogOpen }) {
	return (
		<>
			<section className="flex items-start justify-between w-full mb-8 max-h-14">
				<h1 className="text-3xl font-bold">Permissions</h1>
				<div className="ml-auto">
					<CreateButtonShared onClick={() => setIsDialogOpen(true)}>
						Create Permission
					</CreateButtonShared>
				</div>
			</section>
			<div className="overflow-auto border shadow-lg rounded-2xl bg-background">
				<Table>
					<TableHeader className="sticky top-0 z-10 bg-muted">
						<TableRow className="text-lg font-semibold tracking-wide">
							<TableHead className="w-[160px] px-6 py-4">Name</TableHead>
							<TableHead className="w-[160px] px-6 py-4">Scope</TableHead>
							<TableHead className="w-[480px] px-6 py-4">Description</TableHead>
							<TableHead className="w-[320px] text-center px-6 py-4">
								Actions
							</TableHead>
						</TableRow>
					</TableHeader>

					<TableBody>
						{permissions?.length > 0 ? (
							permissions.map((permission) => (
								<TableRow
									key={permission.id}
									className="transition-colors duration-200 hover:bg-muted"
								>
									<TableCell className="px-6 py-5 text-base font-semibold">
										{permission.name}
									</TableCell>

									<TableCell className="px-6 py-5 text-base font-semibold">
										{permission.scope}
									</TableCell>

									<TableCell className="px-6 py-5 text-base text-muted-foreground">
										{permission.description || (
											<span className="text-sm italic text-gray-400">
												No description
											</span>
										)}
									</TableCell>

									<TableCell className="flex items-center justify-center gap-3 px-6 py-5">
										{/* Assign – primary outline with green accent */}

										{/* Edit – secondary with neutral accent */}
										<Button
											size="sm"
											variant="secondary"
											className="text-yellow-700 bg-yellow-50 hover:text-yellow-500 hover:bg-yellow-100 border border-yellow-200 px-5 py-2.5 text-base cursor-pointer"
										>
											<Pencil className="w-5 h-5 mr-2 text-yellow-600" />
											Edit
										</Button>

										{/* Delete – strong red signal for danger */}
										<Button
											size="sm"
											variant="destructive"
											className="cursor-pointer bg-red-600 hover:text-white-500 hover:bg-red-500 text-white px-5 py-2.5 text-base"
										>
											<Trash2 className="w-5 h-5 mr-2 text-white" />
											Delete
										</Button>
									</TableCell>
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={4}
									className="py-10 text-lg text-center text-muted-foreground"
								>
									No permission found.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
		</>
	);
}
