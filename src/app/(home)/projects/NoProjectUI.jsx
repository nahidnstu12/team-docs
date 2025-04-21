import { Card, CardBody } from "@heroui/card";
import CreateProjectButton from "./RenderCreateButton";
import { Sparkles } from "lucide-react";

export default function NoProjectUI() {
	return (
		<div className="flex items-center justify-center min-h-screen px-4 bg-muted">
			<Card className="w-full max-w-2xl h-[320px] border-none shadow-xl rounded-2xl bg-background flex flex-col">
				<CardBody className="flex flex-col justify-between flex-1 px-8 py-5 overflow-hidden">
					{/* Content Section */}
					<div className="flex flex-col items-center space-y-6">
						<div className="flex items-center gap-2 text-primary">
							<Sparkles className="w-6 h-6" />
							<h1 className="text-4xl font-bold tracking-tight">
								Start Your Project
							</h1>
						</div>

						<p className="max-w-xl text-lg text-center text-muted-foreground">
							Great! You’ve created a workspace. Next, create one or more
							projects inside it. You can organize your documents, users, and
							access control per project.
						</p>
					</div>

					{/* Button pinned at bottom */}
					<div className="flex justify-center pt-18">
						<CreateProjectButton />
					</div>
				</CardBody>
			</Card>
		</div>
	);
}
