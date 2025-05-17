"use client";

import { useState } from "react";
import UserLisitngs from "./components/UserListing";
import dynamic from "next/dynamic";
import DrawerLoading from "@/components/loading/DrawerLoading";

const UserCreateDrawerLazy = dynamic(
	() => import("./components/UserCreateDrawer"),
	{
		ssr: false,
		loading: () => <DrawerLoading />,
	}
);

export default function UserShell({ userId }) {
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [shouldRefetch, setShouldRefetch] = useState(false);

	return (
		<>
			{isDialogOpen && (
				<UserCreateDrawerLazy
					isDialogOpen={isDialogOpen}
					setIsDialogOpen={setIsDialogOpen}
					onSuccess={() => setShouldRefetch(true)}
				/>
			)}

			<UserLisitngs
				userId={userId}
				setIsDialogOpen={setIsDialogOpen}
				shouldRefetch={shouldRefetch}
				setShouldRefetch={setShouldRefetch}
			/>
		</>
	);
}
