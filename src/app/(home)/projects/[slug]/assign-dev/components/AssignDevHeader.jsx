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
import { useState } from "react";

const mockUsers = [
	{ id: 1, name: "Alice Johnson", email: "alice@example.com" },
	{ id: 2, name: "Bob Smith", email: "bob@example.com" },
	{ id: 3, name: "Carol White", email: "carol@example.com" },
	{ id: 4, name: "David Lee", email: "david@example.com" },
	{ id: 5, name: "Eva Black", email: "eva@example.com" },
	{ id: 6, name: "Frank Jones", email: "frank@example.com" },
	{ id: 7, name: "Grace Kim", email: "grace@example.com" },
	{ id: 8, name: "Henry Scott", email: "henry@example.com" },
	{ id: 9, name: "Ivy Brown", email: "ivy@example.com" },
	{ id: 10, name: "Jack Green", email: "jack@example.com" },
];

export default function AssignDevHeader({ projectName }) {
	const [selectedUsers, setSelectedUsers] = useState([]);
	const [search, setSearch] = useState("");

	// Filter users by name or email
	const filteredUsers = mockUsers.filter((user) =>
		`${user.name} ${user.email}`.toLowerCase().includes(search.toLowerCase())
	);

	// Toggle selection
	const toggleUser = (userId) => {
		setSelectedUsers((prev) =>
			prev.includes(userId)
				? prev.filter((id) => id !== userId)
				: [...prev, userId]
		);
	};
	return (
		<div className="my-3">
			<h1 className="mb-3 text-xl ">
				Project: Name:{" "}
				<span className="text-3xl font-semibold">{projectName}</span>
			</h1>

			<section className="flex justify-between p-8 px-12 mb-10 bg-gray-100">
				{/* left */}
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline" className="w-120">
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
									<span className="text-sm font-semibold">{user.name}</span>
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
						<Button variant="outline" className="w-120">
							Project Permission
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent className="w-100">
						<DropdownMenuLabel>Appearance</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuCheckboxItem>Status Bar</DropdownMenuCheckboxItem>
						<DropdownMenuCheckboxItem>Activity Bar</DropdownMenuCheckboxItem>
						<DropdownMenuCheckboxItem>Panel</DropdownMenuCheckboxItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</section>
		</div>
	);
}
