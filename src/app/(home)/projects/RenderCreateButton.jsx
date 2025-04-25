"use client";

import { useDisclosure } from "@heroui/use-disclosure";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import { Spinner } from "@/components/ui/spinner";

const LoadProjectDrawerLazy = dynamic(
	() => import("@/app/(home)/projects/ProjectDrawer"),
	{
		ssr: false,
		loading: () => (
			<div className="relative w-[450px] h-full z-[80] border-l bg-muted flex items-center justify-center">
				<Spinner size="medium">Opening drawer...</Spinner>
			</div>
		),
	}
);

export default function RenderCreateButton() {
	const { isOpen, onOpenChange } = useDisclosure();

	return (
		<>
			{!isOpen && (
				<Button onClick={() => onOpenChange(true)} className="cursor-pointer">
					Create Project
				</Button>
			)}
			{isOpen && (
				<LoadProjectDrawerLazy isOpen={isOpen} onOpenChange={onOpenChange} />
			)}
		</>
	);
}
