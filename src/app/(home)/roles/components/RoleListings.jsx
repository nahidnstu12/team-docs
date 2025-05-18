"use client";

import { useState } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Pencil } from "lucide-react";
import dynamic from "next/dynamic";
import CreateButtonShared from "@/components/shared/CreateButtonShared";
import { useRoles } from "../hooks/useRoles";
import TableLoading from "@/components/loading/TableLoading";
import DrawerLoading from "@/components/loading/DialogLoading";
import ClientErrorUI from "@/components/abstracts/clientErrorUI";
import RoleEditDialog from "./RoleEditDialog";
import DeleteRoleDialog from "./DeleteRoleDialog";
import Logger from "@/lib/Logger";

const LoadRolePermissionDialogLazy = dynamic(
	() => import("@/app/(home)/role-permission-assign/RolePermissionDialog"),
	{
		ssr: false,
		loading: () => <DrawerLoading />,
	}
);

export default function RoleListings({
	hasRoles,
	setIsDialogOpen,
	shouldStartFetchRoles,
	setShouldStartFetchRoles,
}) {
	const {
		data: allRoles,
		fetchError,
		showSkeleton,
		selectedRoleId,
		openPermissionAssignDialog,
		setOpenPermissionAssignDialog,
	} = useRoles(shouldStartFetchRoles, setShouldStartFetchRoles);

	// State for editing role
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
	const [selectedRole, setSelectedRole] = useState(null);

	const handleEditClick = (role) => {
		Logger.debug("Opening edit dialog for role", { roleId: role.id });
		setSelectedRole(role);
		setIsEditDialogOpen(true);
	};

	if (fetchError)
		return (
			<ClientErrorUI
				errorMessage={fetchError}
				retry={setShouldStartFetchRoles}
			/>
		);

	return (
		<>
			{/* Edit Role Dialog */}
			{selectedRole && (
				<RoleEditDialog
					isDialogOpen={isEditDialogOpen}
					setIsDialogOpen={setIsEditDialogOpen}
					setShouldStartFetchRoles={setShouldStartFetchRoles}
					role={selectedRole}
				/>
			)}

			<section className="flex items-start justify-between w-full mb-8 max-h-14">
				<h1 className="text-3xl font-bold">Roles</h1>
				<div className="ml-auto">
					<CreateButtonShared onClick={() => setIsDialogOpen(true)}>
						Create Role
					</CreateButtonShared>
				</div>
			</section>
			<div className="overflow-auto border shadow-lg rounded-2xl bg-background">
				<Table>
					<TableHeader className="sticky top-0 z-10 bg-muted">
						<TableRow className="text-lg font-semibold tracking-wide">
							<TableHead className="w-[160px] px-6 py-4">Name</TableHead>
							<TableHead className="w-[300px] px-6 py-4">Description</TableHead>
							<TableHead className="w-[100px] text-center px-6 py-4">
								System?
							</TableHead>
							<TableHead className="w-[320px] text-center px-6 py-4">
								Actions
							</TableHead>
						</TableRow>
					</TableHeader>

					<TableBody>
						{/* If no roles exist */}
						{!hasRoles ? (
							<TableRow>
								<TableCell
									colSpan={4}
									className="py-10 text-lg text-center text-muted-foreground"
								>
									No roles found.
								</TableCell>
							</TableRow>
						) : showSkeleton || allRoles.length === 0 ? (
							/* If still loading */
							<TableLoading />
						) : (
							/* If roles are loaded */
							allRoles.map((role) => (
								<TableRow
									key={role.id}
									className="transition-colors duration-200 hover:bg-muted"
								>
									{/* Your table cells content */}
									<TableCell className="px-6 py-5 text-base font-semibold">
										{role.name}
									</TableCell>
									<TableCell className="px-6 py-5 text-base text-muted-foreground">
										{role.description || (
											<span className="text-sm italic text-gray-400">
												No description
											</span>
										)}
									</TableCell>
									<TableCell className="px-6 py-5 text-center">
										{role.isSystem ? (
											<span className="font-medium text-green-600">Yes</span>
										) : (
											<span className="text-gray-500">No</span>
										)}
									</TableCell>
									<TableCell className="flex items-center justify-center gap-3 px-6 py-5">
										<Button
											onClick={() => {
												setOpenPermissionAssignDialog(true);
												selectedRoleId.current = role.id;
											}}
											size="sm"
											variant="outline"
											className="text-green-700 hover:text-green-500 border-green-500 hover:bg-green-100 hover:border-green-600 px-5 py-2.5 text-base cursor-pointer"
										>
											<ShieldCheck className="w-5 h-5 mr-2 text-green-600" />
											Assign
										</Button>

										{openPermissionAssignDialog &&
											selectedRoleId.current === role.id && (
												<LoadRolePermissionDialogLazy
													isOpen={openPermissionAssignDialog}
													onOpenChange={setOpenPermissionAssignDialog}
													roleId={selectedRoleId.current}
												/>
											)}

										<Button
											size="sm"
											variant="secondary"
											onClick={() => handleEditClick(role)}
											className="text-yellow-700 bg-yellow-50 hover:text-yellow-500 hover:bg-yellow-100 border border-yellow-200 px-5 py-2.5 text-base cursor-pointer"
										>
											<Pencil className="w-5 h-5 mr-2 text-yellow-600" />
											Edit
										</Button>

										<DeleteRoleDialog
											role={role}
											setShouldStartFetchRoles={setShouldStartFetchRoles}
										/>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>
		</>
	);
}
