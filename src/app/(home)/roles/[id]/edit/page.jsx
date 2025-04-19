import prisma from "@/lib/prisma";
import EditForm from "./Form";
import { Suspense } from "react";

export default async function EditWorkspacePage({ params }) {
	const { id } = await params;
	const workspace = await prisma.workspace.findUnique({
		where: {
			id,
		},
	});

	return (
		<div className="max-w-md mx-auto p-4">
			<h1 className="text-2xl font-bold mb-6">Edit Workspace</h1>
			<Suspense fallback={<p>Loading...</p>}>
				<EditForm workspace={workspace} />
			</Suspense>
		</div>
	);
}
