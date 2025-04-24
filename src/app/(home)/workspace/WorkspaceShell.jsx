"use client";

import { useState } from "react";
import NoWorkspaceUI from "./NoWorkspaceUI";
import WorkspaceForm from "./WorkspaceForm";

export default function WorkspaceShell() {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			<NoWorkspaceUI onOpenChange={setIsOpen} />
			<WorkspaceForm isOpen={isOpen} onOpenChange={setIsOpen} />
		</>
	);
}
