"use client";

import { useState } from "react";
import NoWorkspaceUI from "./components/NoWorkspaceUI";
import WorkspaceForm from "./components/WorkspaceForm";

export default function WorkspaceShell() {
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);

	return (
		<>
			<NoWorkspaceUI setIsDrawerOpen={setIsDrawerOpen} />
			<WorkspaceForm
				isDrawerOpen={isDrawerOpen}
				setIsDrawerOpen={setIsDrawerOpen}
			/>
		</>
	);
}
