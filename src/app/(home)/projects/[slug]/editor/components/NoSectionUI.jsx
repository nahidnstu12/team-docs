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
import { useSectionDialogStore } from "@/app/(home)/projects/[slug]/editor/store/useSectionDialogStore";

export default function NoSectionUI() {
	const openSectionDialog = useSectionDialogStore((state) => state.openSectionDialog);
	return (
		<div className="flex items-center justify-center px-4 mt-10">
			<Card className="w-full max-w-2xl border shadow-xl rounded-2xl bg-background">
				<CardHeader className="items-center mb-12 space-y-4 text-center">
					<div className="flex items-center justify-center gap-2 text-primary">
						<Sparkles className="w-6 h-6" />
						<CardTitle className="text-4xl font-extrabold tracking-tight text-gray-900">
							No Section Found
						</CardTitle>
					</div>
					<CardDescription className="max-w-xl text-base text-muted-foreground">
						Section allows you to manage your project efficiently. Create a new
						section.
					</CardDescription>
				</CardHeader>

				<CardContent className="flex justify-center pt-4">
					<CreateButtonShared onClick={openSectionDialog}>
						Create Your First Section
					</CreateButtonShared>
				</CardContent>

				<CardFooter />
			</Card>
		</div>
	);
}
