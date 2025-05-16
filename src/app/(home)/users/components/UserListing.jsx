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
import { getAllUsersFn } from "../actions/getAllUsers";
import TableLoading from "@/components/laoding/TableLoading";
import { useEffect, useState } from "react";
import ClientErrorUI from "@/components/abstracts/clientErrorUI";
import ComingSoonWrapper from "@/components/abstracts/ComingSoonWrapper";

export default function UserLisitngs({
	userId,
	setIsDialogOpen,
	shouldRefetch,
	setShouldRefetch,
}) {
	const [users, setUsers] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);

	const fetchUsers = async () => {
		try {
			setIsLoading(true);
			setError(null);
			const data = await getAllUsersFn();
			setUsers(data || []);
		} catch (err) {
			setError(err.message || "Failed to fetch users");
		} finally {
			setIsLoading(false);
			setShouldRefetch(false);
		}
	};

	useEffect(() => {
		fetchUsers();
	}, [shouldRefetch]);

	if (error) {
		return (
			<ClientErrorUI
				errorMessage={error}
				retry={() => setShouldRefetch(true)}
			/>
		);
	}

	return (
		<>
			<section className="flex items-start justify-between w-full mb-8 max-h-14">
				<h1 className="text-3xl font-bold">Users</h1>
				<div className="ml-auto">
					<ComingSoonWrapper enabled>
						<CreateButtonShared onClick={() => setIsDialogOpen(true)}>
							Create User
						</CreateButtonShared>
					</ComingSoonWrapper>
				</div>
			</section>
			<div className="overflow-auto border shadow-lg rounded-2xl bg-background">
				<Table>
					<TableHeader className="sticky top-0 z-10 bg-muted">
						<TableRow className="text-lg font-semibold tracking-wide">
							<TableHead className="w-[160px] px-6 py-4">Name</TableHead>
							<TableHead className="w-[160px] px-6 py-4">Email</TableHead>
							<TableHead className="w-[480px] px-6 py-4">Role</TableHead>
							<TableHead className="w-[320px] text-center px-6 py-4">
								Actions
							</TableHead>
						</TableRow>
					</TableHeader>

					<TableBody>
						{isLoading ? (
							<TableLoading />
						) : users.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={4}
									className="py-10 text-lg text-center text-muted-foreground"
								>
									No Users found.
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

									<TableCell className="px-6 py-5 text-base font-semibold">
										{user.email}
									</TableCell>

									<TableCell className="px-6 py-5 text-base text-muted-foreground">
										{user.role}
									</TableCell>

									<TableCell className="px-6 py-5 text-center">
										<div className="flex items-center justify-center gap-2">
											<ComingSoonWrapper enabled>
												<Button
													size="sm"
													variant="secondary"
													className="text-yellow-700 bg-yellow-50 hover:text-yellow-500 hover:bg-yellow-100 border border-yellow-200 px-5 py-2.5 text-base cursor-pointer"
												>
													<Pencil className="w-5 h-5 mr-2 text-yellow-600" />
													Edit
												</Button>
											</ComingSoonWrapper>
											<ComingSoonWrapper enabled>
												<Button
													size="sm"
													variant="destructive"
													className="cursor-pointer bg-red-600 hover:text-white-500 hover:bg-red-500 text-white px-5 py-2.5 text-base"
												>
													<Trash2 className="w-5 h-5 mr-2 text-white" />
													Delete
												</Button>
											</ComingSoonWrapper>
										</div>
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
