"use client";

import { useState } from "react";
import NoProjectUI from "./components/NoProjectUI";
import dynamic from "next/dynamic";
import DrawerLoading from "@/components/loading/DrawerLoading";
import LazyPageLoading from "@/components/loading/LazyPageLoading";

const ProjectCreateDrawerLazy = dynamic(
	() => import("@/app/(home)/projects/components/ProjectCreateDrawer"),
	{
		ssr: false,
		loading: () => <DrawerLoading />,
	}
);

const ProjectListingsLazy = dynamic(
	() => import("@/app/(home)/projects/components/ProjectListings"),
	{
		loading: () => <LazyPageLoading>Loading Projects...</LazyPageLoading>,
	}
);

export default function ProjectShell({ hasProjects }) {
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const [startFetchProjects, setStartFetchProjects] = useState(
		hasProjects ? true : false
	);

	return (
		<>
			{isDrawerOpen && (
				<ProjectCreateDrawerLazy
					isDrawerOpen={isDrawerOpen}
					setIsDrawerOpen={setIsDrawerOpen}
					setStartFetchProjects={setStartFetchProjects}
				/>
			)}

			{hasProjects ? (
				<ProjectListingsLazy
					hasProjects={hasProjects}
					setIsDrawerOpen={setIsDrawerOpen}
					startFetchProjects={startFetchProjects}
					setStartFetchProjects={setStartFetchProjects}
				/>
			) : (
				<NoProjectUI setIsDrawerOpen={setIsDrawerOpen} />
			)}
		</>
	);
}
