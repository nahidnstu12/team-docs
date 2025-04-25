"use client";

import { useState } from "react";
import ProjectDrawer from "./components/ProjectDrawer";
import NoProjectUI from "./components/NoProjectUI";
import ProjectListings from "./components/ProjectListings";

export default function ProjectShell({ hasProjects }) {
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);

	return (
		<>
			{isDrawerOpen && (
				<ProjectDrawer
					isDrawerOpen={isDrawerOpen}
					setIsDrawerOpen={setIsDrawerOpen}
				/>
			)}

			{hasProjects ? (
				<ProjectListings setIsDrawerOpen={setIsDrawerOpen} />
			) : (
				<NoProjectUI setIsDrawerOpen={setIsDrawerOpen} />
			)}
		</>
	);
}
