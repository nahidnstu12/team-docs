"use client";

import { useState } from "react";
import NoRolesUI from "./components/NoRolesUI";
import dynamic from "next/dynamic";
import DrawerLoading from "@/components/laoding/DawerLoading";
import LazyPageLoading from "@/components/laoding/LazyPageLoading";

const RoleCreateDrawerLazy = dynamic(
	() => import("@/app/(home)/roles/components/RoleCreateDrawer"),
	{
		ssr: false,
		loading: () => <DrawerLoading />,
	}
);

const RoleListingsLazy = dynamic(
	() => import("@/app/(home)/roles/components/RoleListings"),
	{
		loading: () => <LazyPageLoading>Loading Roles...</LazyPageLoading>,
	}
);

export default function RoleShell({ hasRoles }) {
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [shouldStartFetchRoles, setShouldStartFetchRoles] = useState(
		hasRoles ? true : false
	);

	return (
		<>
			{isDialogOpen && (
				<RoleCreateDrawerLazy
					setShouldStartFetchRoles={setShouldStartFetchRoles}
					isDialogOpen={isDialogOpen}
					setIsDialogOpen={setIsDialogOpen}
				/>
			)}

			{hasRoles ? (
				<RoleListingsLazy
					hasRoles={hasRoles}
					setIsDialogOpen={setIsDialogOpen}
					shouldStartFetchRoles={shouldStartFetchRoles}
					setShouldStartFetchRoles={setShouldStartFetchRoles}
				/>
			) : (
				<NoRolesUI setIsDialogOpen={setIsDialogOpen} />
			)}
		</>
	);
}
