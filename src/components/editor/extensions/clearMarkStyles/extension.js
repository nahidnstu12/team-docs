import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "prosemirror-state";

export const ClearMarksOnEnter = Extension.create({
	name: "clearMarksOnEnter",

	addProseMirrorPlugins() {
		return [
			new Plugin({
				key: new PluginKey("clear-marks-on-enter"),
				props: {
					handleKeyDown(view, event) {
						const { state, dispatch } = view;
						const { selection } = state;

						// Only intercept "Enter" key
						if (event.key !== "Enter") return false;

						const { $from } = selection;
						const parentNode = $from.parent;

						// Skip clearing in these blocks
						const skipNodeTypes = [
							"codeBlock",
							"blockquote",
							"details",
							"taskItem",
						];

						if (skipNodeTypes.includes(parentNode.type.name)) {
							return false;
						}

						// Clear inline marks (bold, italic, etc.)
						const transaction = state.tr;
						const storedMarks = state.storedMarks || $from.marks();
						if (storedMarks.length) {
							storedMarks.forEach((mark) => {
								transaction.removeStoredMark(mark.type);
							});
							dispatch(transaction);
						}

						return false; // allow Enter key to still insert newline
					},
				},
			}),
		];
	},
});
