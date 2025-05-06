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
					const { selection } = newState;
					const { $from } = selection;

					const parent = $from.parent;
					const parentNodeType = parent.type.name;

					const skipNodes = ["codeBlock", "blockquote", "details"];
					if (skipNodes.includes(parentNodeType)) {
						return null;
					}

					// Only handle transactions that delete content
					const deletionHappened = transactions.some((tx) =>
						tx.steps.some((step) => step.slice && !step.slice.content.size)
					);

					// Only trigger on actual deletions
					if (!deletionHappened) return null;

					const isEmptyLine =
						parentNodeType === "paragraph" && parent.content.size === 0;

					if (isEmptyLine && newState.storedMarks?.length) {
						newState.storedMarks.forEach((mark) => {
							tr.removeStoredMark(mark.type);
						});
						return tr;
					}

					return null;
				},
			}),
		];
	},
});
