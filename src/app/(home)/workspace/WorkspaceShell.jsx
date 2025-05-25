"use client";

import { useState } from "react";
import NoWorkspaceUI from "./components/NoWorkspaceUI";
import WorkspaceForm from "./components/WorkspaceCreateDialog";

export default function WorkspaceShell({ hasWorkspace }) {
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);

	return (
		<>
			<WorkspaceForm
				isDrawerOpen={isDrawerOpen}
				setIsDrawerOpen={setIsDrawerOpen}
			/>
			{hasWorkspace ? (
				<h1>You already have a workspace</h1>
			) : (
				<NoWorkspaceUI setIsDrawerOpen={setIsDrawerOpen} />
			)}
		</>
	);
}
