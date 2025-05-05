import { useEffect } from "react";
import { useLinkContext } from "../ctx/LinkProvider";

export const useLinkHandling = (editor) => {
	const {
		setInitialText,
		setInitialUrl,
		setDialogMode,
		setLinkDialogOpen, // this replaces the local useState
	} = useLinkContext();

	useEffect(() => {
		if (!editor) return;

		const handler = (event) => {
			const target = event.target;
			if (target.dataset?.type === "link") {
				event.preventDefault();
				const url = target.dataset.href;
				const text = target.textContent;

				setInitialText(text);
				setInitialUrl(url);
				setDialogMode("edit");
				setLinkDialogOpen(true); // now uses context, not local state
			}
		};

		const dom = editor.view.dom;
		dom.addEventListener("click", handler);
		return () => dom.removeEventListener("click", handler);
	}, [editor, setInitialText, setInitialUrl, setDialogMode, setLinkDialogOpen]);
};
