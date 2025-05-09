"use client";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { getUsersNotInProject } from "../actions/getUsers";
import { getProjectPermission } from "../actions/getProjectPermission";
import { assignDevAction } from "@/system/Actions/ProjectPermissionAction";

export default function AssignDevHeader({ projectName, projectId, onAssignSuccess }) {
	const [selectedUsers, setSelectedUsers] = useState([]);
	const [selectedPermissions, setSelectedPermissions] = useState([]);
	const [search, setSearch] = useState("");
	const [users, setUsers] = useState([]);
	const [permissions, setPermissions] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isAssigning, setIsAssigning] = useState(false);
	
	const fetchUsers = async () => {
		try {
			setIsLoading(true);
			const users = await getUsersNotInProject(projectId);
			setUsers(users);
		} catch (error) {
			console.error("Failed to fetch users:", error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchUsers();
	}, [projectId]);

	useEffect(() => {
		const fetchPermissions = async () => {
			try {
				const permissions = await getProjectPermission("school-demo");
				setPermissions(permissions);
			} catch (error) {
				console.error("Failed to fetch permissions:", error);
			}
		};
		fetchPermissions();
	}, [projectId]);

	console.log("permissions", {permissions, users, projectId, projectName});

	// Filter users by name or email
	const filteredUsers =
		users?.length > 0
			? users?.filter((user) =>
					`${user.username} ${user.email}`
						.toLowerCase()
						.includes(search.toLowerCase())
			  )
			: [];

	// Toggle selection
	const toggleUser = (userId) => {
		setSelectedUsers((prev) =>
			prev.includes(userId)
				? prev.filter((id) => id !== userId)
				: [...prev, userId]
		);
	};

	const handlePermissionChange = (permissionId, checked) => {
		setSelectedPermissions((prev) =>
			checked
				? [...prev, permissionId]
				: prev.filter((id) => id !== permissionId)
		);
	};

	const handleAssign = async () => {
		try {
			setIsAssigning(true);
			const result = await assignDevAction({
				selectedPermissions,
				selectedUsers,
				projectId,
			});

			if (!result.success) {
				throw new Error(result.error);
			}

			// Clear selections after successful assignment
			setSelectedUsers([]);
			setSelectedPermissions([]);
			setSearch("");

			// Refetch the developer list
			await fetchUsers();

			// Notify parent component about successful assignment
			if (onAssignSuccess) {
				onAssignSuccess();
			}

			// You can add a toast notification here if you want
			console.log("Developers assigned successfully:", result.data);
		} catch (error) {
			console.error("Failed to assign developers:", error);
			// You can add error toast notification here
		} finally {
			setIsAssigning(false);
		}
	};

	// Get selected user names for display
	const getSelectedUserNames = () => {
		if (selectedUsers.length === 0) return "Select Dev's";
		const selectedUserObjects = users.filter(user => selectedUsers.includes(user.id));
		return `${selectedUserObjects.length} Developer${selectedUserObjects.length > 1 ? 's' : ''} selected`;
	};

	// Get selected permission names for display
	const getSelectedPermissionNames = () => {
		if (selectedPermissions.length === 0) return "Project Permission";
		const selectedPermissionObjects = permissions.filter(permission => selectedPermissions.includes(permission.id));
		return `${selectedPermissionObjects.length} Permission${selectedPermissionObjects.length > 1 ? 's' : ''} selected`;
	};

	return (
		<div className="my-3">
			<h1 className="mb-3 text-xl ">
				Project: Name:{" "}
				<span className="text-3xl font-semibold">{projectName}</span>
			</h1>

			<section className="flex justify-center p-8 px-12 mb-10 bg-gray-600 gap-4">
				{/* left */}
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button 
							variant="outline" 
							className="w-96"
							disabled={isLoading}
						>
							{isLoading ? "Loading..." : getSelectedUserNames()}
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent className="w-96 max-h-[400px] overflow-y-auto">
						<DropdownMenuLabel className="flex flex-col gap-2">
							<span className="text-base font-medium">
								Select Developer&apos;s
							</span>
							<Input
								placeholder="Search name or email..."
								className="h-8"
								value={search}
								onChange={(e) => setSearch(e.target.value)}
							/>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />

						{isLoading ? (
							<div className="p-4 text-center text-muted-foreground">
								Loading developers...
							</div>
						) : (
							filteredUsers.map((user) => (
								<DropdownMenuCheckboxItem
									key={user.id}
									checked={selectedUsers.includes(user.id)}
									onCheckedChange={() => toggleUser(user.id)}
									onSelect={(e) => e.preventDefault()}
									className="py-2"
								>
									<div className="flex flex-col gap-0.5">
										<span className="text-sm font-semibold">{user.username}</span>
										<span className="text-xs text-muted-foreground">
											{user.email}
										</span>
									</div>
								</DropdownMenuCheckboxItem>
							))
						)}
					</DropdownMenuContent>
				</DropdownMenu>

				{/* right */}
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button 
							variant="outline" 
							className="w-96"
							disabled={isLoading}
						>
							{getSelectedPermissionNames()}
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent className="w-96">
						{permissions?.map((permission) => (
							<DropdownMenuCheckboxItem
								key={permission.id}
								checked={selectedPermissions.includes(permission.id)}
								onCheckedChange={(checked) =>
									handlePermissionChange(permission.id, checked)
								}
								onSelect={(e) => e.preventDefault()}
							>
								{permission.name}
							</DropdownMenuCheckboxItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>

				<Button 
					onClick={handleAssign}
					disabled={isAssigning || selectedUsers.length === 0 || selectedPermissions.length === 0}
				>
					{isAssigning ? "Assigning..." : "Assign"}
				</Button>
			</section>
		</div>
	);
}
