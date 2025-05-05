"use client";

import { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogFooter,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function LinkDialog({ open, onOpenChange, editor }) {
	const [text, setText] = useState("");
	const [url, setUrl] = useState("");

	const handleInsertLink = () => {
		if (!text || !url || !editor) return;

		editor
			.chain()
			.focus()
			.insertContent([
				{
					type: "text",
					text: text,
					marks: [
						{
							type: "link",
							attrs: {
								href: url,
								target: "_blank",
								rel: "noopener noreferrer",
							},
						},
					],
				},
			])
			.run();

		setText("");
		setUrl("");
		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Add Link</DialogTitle>
				</DialogHeader>

				{/* Wrap inputs in a form */}
				<form
					onSubmit={(e) => {
						e.preventDefault(); // Prevent page reload
						handleInsertLink(); // Call submit logic
					}}
					className="grid gap-4 py-2"
				>
					<Input
						placeholder="Display text"
						value={text}
						onChange={(e) => setText(e.target.value)}
						required
					/>
					<Input
						placeholder="https://example.com"
						value={url}
						onChange={(e) => setUrl(e.target.value)}
						required
					/>

					<DialogFooter>
						<Button
							variant="ghost"
							type="button"
							onClick={() => onOpenChange(false)}
						>
							Cancel
						</Button>
						<Button type="submit">Insert</Button>{" "}
						{/* Triggers handleInsertLink */}
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
