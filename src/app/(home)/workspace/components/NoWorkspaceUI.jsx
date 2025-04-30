"use client";

import { Button } from "@/components/ui/button";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Sparkles } from "lucide-react";

export default function NoWorkspaceUI({ setIsDrawerOpen }) {
	return (
		<div className="flex items-center justify-center px-4 mt-10">
			<Card className="w-full max-w-2xl h-[320px] border-none shadow-xl rounded-2xl bg-background flex flex-col">
				<CardBody className="flex flex-col justify-between flex-1 px-8 py-5 overflow-hidden">
					{/* Header & Text */}
					<div className="flex flex-col items-center space-y-4 text-center">
						<CardHeader className="flex flex-col items-center space-y-2">
							<div className="flex items-center gap-2 text-primary">
								<Sparkles className="w-6 h-6" />
								<h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
									No Workspace Found
								</h1>
							</div>
						</CardHeader>

						<CardBody className="p-0">
							<p className="max-w-xl text-base text-center sm:text-lg text-muted-foreground">
								You haven’t created any workspaces yet. Workspaces help you
								organize your projects, tasks, and teams in one centralized
								place.
							</p>
						</CardBody>
					</div>

					{/* Footer CTA Button */}
					<CardFooter className="flex justify-center pt-18">
						<Button size="lg" onClick={() => setIsDrawerOpen(true)}>
							Create Your First Workspace
						</Button>
					</CardFooter>
				</CardBody>
			</Card>
		</div>
	);
}
