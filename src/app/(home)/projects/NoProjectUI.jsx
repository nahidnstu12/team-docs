"use client";

import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Sparkles } from "lucide-react";
import RenderCreateButton from "./RenderCreateButton";

export default function NoProjectUI() {
	return (
		<div className="flex items-center justify-center px-4 mt-10 bg-muted">
			<Card className="w-full max-w-2xl h-[320px] border-none shadow-xl rounded-2xl bg-background flex flex-col">
				<CardBody className="flex flex-col justify-between flex-1 px-8 py-5 overflow-hidden">
					{/* Content Section */}
					<div className="flex flex-col items-center space-y-4 text-center">
						<CardHeader className="flex flex-col items-center space-y-2">
							<div className="flex items-center gap-2 text-primary">
								<Sparkles className="w-6 h-6" />
								<h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
									Start Your Project
								</h1>
							</div>
						</CardHeader>

						<CardBody className="p-0">
							<p className="max-w-xl text-base text-center sm:text-lg text-muted-foreground">
								Great! You’ve created a workspace. Now, create one or more
								projects to organize your documents, users, and access control
								with ease and clarity.
							</p>
						</CardBody>
					</div>

					{/* Button pinned at bottom */}
					<CardFooter className="flex justify-center pt-18">
						<RenderCreateButton />
					</CardFooter>
				</CardBody>
			</Card>
		</div>
	);
}
