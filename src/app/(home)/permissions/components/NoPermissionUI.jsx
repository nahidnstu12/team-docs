"use client";

import CreateButtonShared from "@/components/shared/CreateButtonShared";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import { Sparkles } from "lucide-react";

export default function NoPermissionUI({ setIsDialogOpen }) {
	return (
		<div className="flex items-center justify-center px-4 mt-10">
			<Card className="w-full max-w-2xl border shadow-xl rounded-2xl bg-background">
				<CardHeader className="items-center mb-12 space-y-4 text-center">
					<div className="flex items-center justify-center gap-2 text-primary">
						<Sparkles className="w-6 h-6" />
						<CardTitle className="text-4xl font-extrabold tracking-tight text-gray-900">
							No Permissions Found
						</CardTitle>
					</div>
					<CardDescription className="max-w-xl text-base text-muted-foreground">
						Create your first permissions to manage access control within your
						system.
					</CardDescription>
				</CardHeader>

				<CardContent className="flex justify-center pt-4">
					<CreateButtonShared onClick={() => setIsDialogOpen(true)}>
						Create Your First Permission
					</CreateButtonShared>
				</CardContent>

				<CardFooter />
			</Card>
		</div>
	);
}
