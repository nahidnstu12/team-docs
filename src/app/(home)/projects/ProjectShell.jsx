"use client";

import { useState } from "react";
import ProjectDrawer from "./components/ProjectCreateDrawer";
import NoProjectUI from "./components/NoProjectUI";
import ProjectListings from "./components/ProjectListings";

export default function ProjectShell({ hasProjects }) {
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const [startFetchProjects, setStartFetchProjects] = useState(false);

	return (
		<>
			{isDrawerOpen && (
				<ProjectDrawer
					isDrawerOpen={isDrawerOpen}
					setIsDrawerOpen={setIsDrawerOpen}
					setStartFetchProjects={setStartFetchProjects}
				/>
			)}

			{hasProjects ? (
				<ProjectListings
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
