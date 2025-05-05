"use client";

import { useEffect, useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogFooter,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function LinkDialog({
	open,
	onOpenChange,
	editor,
	initialText = "",
	initialUrl = "",
	mode = "create",
}) {
	const [text, setText] = useState("");
	const [url, setUrl] = useState("");

	useEffect(() => {
		if (open) {
			setText(initialText);
			setUrl(initialUrl);
		}
	}, [open, initialText, initialUrl]);

	const handleInsertOrUpdateLink = () => {
		if (!text || !url || !editor) return;

		editor
			.chain()
			.focus()
			.extendMarkRange("link")
			.insertContent([
				{
					type: "text",
					text,
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

	const isValidUrl = url.startsWith("http://") || url.startsWith("https://");

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>
						{mode === "edit" ? "Edit Link" : "Add Link"}
					</DialogTitle>
				</DialogHeader>

				<form
					onSubmit={(e) => {
						e.preventDefault();
						handleInsertOrUpdateLink();
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

					<DialogFooter className="flex justify-between">
						<div className="space-x-2">
							{mode === "edit" && isValidUrl && (
								<a
									href={url}
									target="_blank"
									rel="noopener noreferrer"
									className="text-sm text-blue-600 underline"
								>
									Visit Link
								</a>
							)}
						</div>
						<div className="space-x-2">
							<Button
								variant="ghost"
								type="button"
								onClick={() => onOpenChange(false)}
							>
								Cancel
							</Button>
							<Button type="submit">
								{mode === "edit" ? "Update" : "Insert"}
							</Button>
						</div>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
