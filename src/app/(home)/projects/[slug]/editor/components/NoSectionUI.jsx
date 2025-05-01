import CreateButtonShared from "@/components/shared/CreateButtonShared";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { ShieldCheck } from "lucide-react";

export default function NoSectionUI({ setIsDialogOpen }) {
	return (
		<div className="flex items-center justify-center w-full px-4 mt-10 rounded-lg">
			<Card className="w-full max-w-2xl h-[320px] border-none shadow-xl rounded-2xl bg-background flex flex-col">
				<CardBody className="flex flex-col justify-between flex-1 px-8 py-5 overflow-hidden">
					{/* Header & Text */}
					<div className="flex flex-col items-center space-y-4 text-center">
						<CardHeader className="flex flex-col items-center space-y-2">
							<div className="flex items-center gap-2 text-primary">
								<ShieldCheck className="w-6 h-6" />
								<h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
									No Section Found
								</h1>
							</div>
						</CardHeader>

						<CardBody className="p-0">
							<p className="max-w-xl text-base text-center sm:text-lg text-muted-foreground">
								Section allows you to manage your project efficiently. Create a
								new section.
							</p>
						</CardBody>
					</div>

					{/* Footer CTA Button */}
					<CardFooter className="flex justify-center pt-18">
						<CreateButtonShared onClick={() => setIsDialogOpen(true)}>
							Create Section
						</CreateButtonShared>
					</CardFooter>
				</CardBody>
			</Card>
		</div>
	);
}
