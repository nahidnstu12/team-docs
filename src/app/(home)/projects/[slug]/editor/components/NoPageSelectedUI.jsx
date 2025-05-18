import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

export default function NoPageSelectedUI() {
	return (
		<div className="flex justify-center items-center px-4 mt-20">
			<Card className="w-full max-w-2xl border-none shadow-none bg-background">
				<CardHeader className="items-center mb-8 space-y-4 text-center">
					<div className="flex flex-col gap-2 justify-center items-center text-primary">
						<FileText className="w-24 h-24 text-muted-foreground/60" />
						<CardTitle className="text-4xl font-extralight tracking-wide text-gray-300">
							No Page Selected
						</CardTitle>
					</div>
				</CardHeader>
			</Card>
		</div>
	);
}
