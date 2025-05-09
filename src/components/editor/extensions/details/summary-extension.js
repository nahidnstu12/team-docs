import { Node } from "@tiptap/core";

export const DetailsSummary = Node.create({
	name: "detailsSummary",

	content: "inline*",

	defining: true,

	parseHTML() {
		return [{ tag: "summary" }];
	},

	renderHTML() {
		return ["summary", 0];
	},
});
