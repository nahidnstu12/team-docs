import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "prosemirror-state";

export const ResetMarksOnDelete = Extension.create({
	name: "resetMarksOnDelete",

	addProseMirrorPlugins() {
		return [
			new Plugin({
				key: new PluginKey("reset-marks-on-delete"),
				appendTransaction: (transactions, oldState, newState) => {
					const tr = newState.tr;
					const { doc, selection } = newState;
					const { $from } = selection;

					// Check if selection is in a paragraph
					const parent = $from.parent;
					const parentNodeType = parent.type.name;

					// Skip clearing inside blocks like codeBlock, etc.
					const skipNodes = ["codeBlock", "blockquote", "details"];
					if (skipNodes.includes(parentNodeType)) {
						return null;
					}

					// Detect if line was cleared (i.e., now empty paragraph)
					const isEmptyLine =
						parentNodeType === "paragraph" && parent.content.size === 0;

					if (isEmptyLine) {
						// Clear all stored marks
						if (newState.storedMarks) {
							newState.storedMarks.forEach((mark) => {
								tr.removeStoredMark(mark.type);
							});
							return tr;
						}
					}

					return null;
				},
			}),
		];
	},
});
