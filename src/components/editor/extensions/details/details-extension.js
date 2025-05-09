import { Node } from "@tiptap/core";
import { Plugin, PluginKey } from "prosemirror-state";

export const Details = Node.create({
	name: "details",
	group: "block",
	content: "detailsSummary paragraph+", // Requires summary followed by content
	defining: true,

	addOptions() {
		return {
			HTMLAttributes: {},
		};
	},

	renderHTML({ HTMLAttributes }) {
		return ["details", HTMLAttributes, 0];
	},

	parseHTML() {
		return [{ tag: "details" }];
	},

	addGlobalAttributes() {
		return [
			{
				types: ["details"],
				attributes: {
					open: {
						default: false,
						renderHTML: (attributes) => ({
							open: attributes.open ? "" : null,
						}),
					},
				},
			},
		];
	},

	addKeyboardShortcuts() {
		return {
			"Mod-Shift-d": () => this.editor.commands.toggleDetails(),
		};
	},

	addCommands() {
		return {
			insertDetails:
				() =>
				({ chain }) => {
					return chain()
						.insertContent({
							type: this.name,
							attrs: { open: false },
							content: [
								{
									type: "detailsSummary",
									content: [{ type: "text", text: "Summary" }],
								},
								{
									type: "paragraph",
									content: [{ type: "text", text: "Content" }],
								},
							],
						})
						.focus()
						.run();
				},
			toggleDetails:
				() =>
				({ commands }) => {
					return commands.toggleWrap(this.name);
				},
		};
	},

	addProseMirrorPlugins() {
		return [
			new Plugin({
				key: new PluginKey("detailsHandle"),
				props: {
					handleClickOn: (view, pos, node, nodePos, event) => {
						if (
							node.type.name === "details" &&
							event.target instanceof HTMLElement
						) {
							const summary = event.target.closest("summary");
							if (summary) {
								this.editor.commands.command(({ tr }) => {
									tr.setNodeMarkup(nodePos, undefined, {
										...node.attrs,
										open: !node.attrs.open,
									});
									return true;
								});
								return true;
							}
						}
						return false;
					},
				},
			}),
		];
	},
});
