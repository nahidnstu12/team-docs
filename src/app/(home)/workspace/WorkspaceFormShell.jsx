"use client";

import { useState } from "react";
import NoWorkspaceUI from "./NoWorkspaceUI";
import WorkspaceForm from "./WorkspaceForm";

export default function WorkspaceFormShell() {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div className="">
			<NoWorkspaceUI onOpenChange={setIsOpen} />
			<WorkspaceForm isOpen={isOpen} onOpenChange={setIsOpen} />
		</div>
	);
}
