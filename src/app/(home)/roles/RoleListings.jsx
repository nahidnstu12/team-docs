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
import { ShieldCheck, Pencil, Trash2 } from "lucide-react";
import RenderCreateButton from "./RenderCreateButton";
import { useState, useEffect, useTransition } from "react";
import dynamic from "next/dynamic";
import { getAllPermissions } from "../role-permission-assign/loader/getAllPermissions";
import { Spinner } from "@/components/ui/spinner";
import { hasPermissionsFn } from "./actions/hasPermissions";
import { getAllRolesFn } from "./actions/getAllRoles";
import { Skeleton } from "@/components/ui/skeleton";

const LoadRolePermissionDialogLazy = dynamic(
	() => import("@/app/(home)/role-permission-assign/RolePermissionDialog"),
	{
		ssr: false,
		loading: () => (
			<div className="fixed inset-0 z-[9999] bg-black/40 flex items-center justify-center">
				<div className="relative w-[900px] h-[580px] bg-muted border rounded-lg shadow-lg flex items-center justify-center">
					<Spinner size="medium">Opening drawer...</Spinner>
				</div>
			</div>
		),
	}
);

export default function RoleLisitngs({ setIsOpen }) {
	const [openDialog, setOpenDialog] = useState(false);
	const [selectedRoleId, setSelectedRoleId] = useState(null);

	const [hasFetchedRoles, setHasFetchedRoles] = useState(false);
	const [allRoles, setAllRoles] = useState([]);
	const [fetchAllRolesPending, startAllRolesTransition] = useTransition();
	const [permissions, setPermissions] = useState([]);
	const [hasPermissions, setHasPermissions] = useState(false);
	const [fetchingHasPermissionsPending, startHasPermissionTransitions] =
		useTransition();

	useEffect(() => {
		async function fetchHasPermissions() {
			const res = await hasPermissionsFn();
			startHasPermissionTransitions(() => setHasPermissions(res));
		}

		if (!hasPermissions) {
			fetchHasPermissions();
		}
	}, [hasPermissions]);

	useEffect(() => {
		const fetchAllRoles = async () => {
			const roles = await getAllRolesFn();
			startAllRolesTransition(() => {
				setAllRoles(roles);
				setHasFetchedRoles(true);
			});
		};

		if (!hasFetchedRoles) {
			fetchAllRoles();
		}
	}, [hasFetchedRoles]);

	// Fetch permissions for a selected role
	useEffect(() => {
		if (selectedRoleId && permissions.length === 0) {
			// Fetch permissions when a role is selected
			const fetchPermissions = async () => {
				try {
					const perms = await getAllPermissions(selectedRoleId);
					setPermissions(perms);
				} catch (error) {
					console.error("Failed to fetch permissions", error);
				}
			};
			fetchPermissions();
		}
	}, [selectedRoleId, permissions.length]);

	useEffect(() => {
		if (!openDialog) {
			setPermissions([]);
			setSelectedRoleId(null);
		}
	}, [openDialog]);

	return (
		<>
			<section className="flex items-start justify-between w-full mb-8 max-h-14">
				<h1 className="text-3xl font-bold">Roles</h1>
				<div className="ml-auto">
					<RenderCreateButton onClick={() => setIsOpen(true)} />
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
						{!hasFetchedRoles || fetchAllRolesPending ? (
							[...Array(5)].map((_, i) => (
								<TableRow key={`skeleton-${i}`} className="animate-pulse">
									<TableCell className="px-6 py-5">
										<Skeleton className="w-3/4 h-4 rounded-md" />
									</TableCell>
									<TableCell className="px-6 py-5">
										<Skeleton className="w-5/6 h-4 rounded-md" />
									</TableCell>
									<TableCell className="px-6 py-5 text-center">
										<Skeleton className="w-10 h-4 mx-auto rounded-md" />
									</TableCell>
									<TableCell className="px-6 py-5 text-center">
										<Skeleton className="w-1/2 h-10 mx-auto rounded-md" />
									</TableCell>
								</TableRow>
							))
						) : allRoles?.length > 0 ? (
							allRoles.map((role) => (
								<TableRow
									key={role.id}
									className="transition-colors duration-200 hover:bg-muted"
								>
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
										{!hasPermissions && fetchingHasPermissionsPending && (
											<Spinner size="medium">
												Loading has permission state...
											</Spinner>
										)}
										{hasPermissions && !fetchingHasPermissionsPending && (
											<>
												<Button
													onClick={() => {
														setSelectedRoleId(role.id);
														setOpenDialog(true);
													}}
													size="sm"
													variant="outline"
													className="text-green-700 hover:text-green-500 border-green-500 hover:bg-green-100 hover:border-green-600 px-5 py-2.5 text-base cursor-pointer"
												>
													<ShieldCheck className="w-5 h-5 mr-2 text-green-600" />
													Assign
												</Button>

												{openDialog && selectedRoleId === role.id && (
													<LoadRolePermissionDialogLazy
														isOpen={openDialog}
														onOpenChange={setOpenDialog}
														roleId={selectedRoleId}
														permissions={permissions}
													/>
												)}
											</>
										)}

										<Button
											size="sm"
											variant="secondary"
											className="text-yellow-700 bg-yellow-50 hover:text-yellow-500 hover:bg-yellow-100 border border-yellow-200 px-5 py-2.5 text-base cursor-pointer"
										>
											<Pencil className="w-5 h-5 mr-2 text-yellow-600" />
											Edit
										</Button>

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
									No roles found.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
		</>
	);
}
