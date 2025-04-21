"use client";

import { useDisclosure } from "@heroui/use-disclosure";
import { Button } from "@/components/ui/button";
import ProjectDrawer from "./ProjectDrawer";

export default function CreateProjectButton() {
	const { isOpen, onOpenChange } = useDisclosure();

	return (
		<>
			<Button onClick={() => onOpenChange(true)}>Create Project</Button>
			<ProjectDrawer isOpen={isOpen} onOpenChange={onOpenChange} />
		</>
	);
}
