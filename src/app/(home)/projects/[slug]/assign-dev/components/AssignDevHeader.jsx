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

export default function AssignDevHeader({ projectName, projectId }) {
	const [selectedUsers, setSelectedUsers] = useState([]);
	const [selectedPermissions, setSelectedPermissions] = useState([]);
	const [search, setSearch] = useState("");
	const [users, setUsers] = useState([]);
	const [permissions, setPermissions] = useState([]);
	
	useEffect(() => {
		const fetchUsers = async () => {
			const users = await getUsersNotInProject(projectId);
			setUsers(users);
		};
		fetchUsers();
	}, [projectId]);

	useEffect(() => {
		const fetchPermissions = async () => {
			const permissions = await getProjectPermission("school-demo");
			setPermissions(permissions);
		};
		fetchPermissions();
	}, [projectId]);
	console.log("selectedPermissions>>", selectedPermissions, selectedUsers);
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

			// You can add a toast notification here if you want
			console.log("Developers assigned successfully:", result.data);
		} catch (error) {
			console.error("Failed to assign developers:", error);
			// You can add error toast notification here
		}
	};
	return (
		<div className="my-3">
			<h1 className="mb-3 text-xl ">
				Project: Name:{" "}
				<span className="text-3xl font-semibold">{projectName}</span>
			</h1>

			<section className="flex justify-between p-8 px-12 mb-10 bg-gray-600 gap-4">
				{/* left */}
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline" className="w-96">
							Select Dev&apos;s
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

						{filteredUsers.map((user) => (
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
						))}
					</DropdownMenuContent>
				</DropdownMenu>

				{/* right */}
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline" className="w-96">
							Project Permission
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

				<Button onClick={handleAssign}> Assign</Button>
			</section>
		</div>
	);
}
