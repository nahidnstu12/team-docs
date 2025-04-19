"use client";

import { Suspense } from "react";
import CreateForm from "./Form";

export default function CreateWorkspacePage() {
	return (
		<div className="max-w-md mx-auto p-4">
			<h1 className="text-2xl font-bold mb-6">Create Workspace</h1>
			<Suspense fallback={<p>Loading...</p>}>
				<CreateForm />
			</Suspense>
		</div>
	);
}
