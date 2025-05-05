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
import { useLinkContext } from "../../ctx/LinkProvider";

export function LinkDialog({ editor }) {
	const [text, setText] = useState("");
	const [url, setUrl] = useState("");

	const {
		linkDialogOpen: open,
		setLinkDialogOpen: onOpenChange,
		initialText,
		initialUrl,
		dialogMode: mode,
	} = useLinkContext();

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

	const handleKeyDown = (e) => {
		// Prevent default Enter behavior (which might open the link)
		if (e.key === "Enter") {
			e.preventDefault();
			handleInsertOrUpdateLink();
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent
				onKeyDown={handleKeyDown} // Handle Enter at dialog level
				className="sm:max-w-md"
			>
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
								<Button
									variant="outline"
									type="button"
									onClick={() => window.open(initialUrl, "_blank")}
								>
									Visit Link
								</Button>
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
