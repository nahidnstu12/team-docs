import { useEffect, useState } from "react";

export const useLinkHandling = (editor) => {
	const [linkDialogOpen, setLinkDialogOpen] = useState(false);
	const [initialText, setInitialText] = useState("");
	const [initialUrl, setInitialUrl] = useState("");
	const [dialogMode, setDialogMode] = useState("create");

	useEffect(() => {
		if (!editor) return;

		const handler = (event) => {
			const target = event.target;
			if (target.dataset.type === "link") {
				event.preventDefault();
				const url = target.dataset.href;
				const text = target.textContent;
				setInitialText(text);
				setInitialUrl(url);
				setDialogMode("edit");
				setLinkDialogOpen(true);
			}
		};

		const dom = editor.view.dom;
		dom.addEventListener("click", handler);
		return () => dom.removeEventListener("click", handler);
	}, [editor]);

	return {
		linkDialogOpen,
		setLinkDialogOpen,
		initialText,
		setInitialText,
		initialUrl,
		setInitialUrl,
		dialogMode,
		setDialogMode,
	};
};
