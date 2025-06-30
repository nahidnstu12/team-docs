import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "prosemirror-state";

/**
 * Trailing Node Extension
 * Ensures there's always a paragraph at the end of the document
 * Similar to Notion's behavior where you can always escape any block
 */
export const TrailingNode = Extension.create({
  name: "trailingNode",

  addOptions() {
    return {
      node: "paragraph",
      notAfter: [], // Always add trailing node, regardless of last node type
    };
  },

  addProseMirrorPlugins() {
    const plugin = new Plugin({
      key: new PluginKey("trailingNode"),
      appendTransaction: (transactions, oldState, newState) => {
        const { doc, tr } = newState;
        const endPosition = doc.content.size;
        const lastNode = doc.lastChild;

        // Don't add trailing node if document is empty
        if (endPosition === 0) {
          return;
        }

        // Always ensure there's a trailing paragraph for escape mechanism
        // Check if last node is an empty paragraph
        if (lastNode && lastNode.type.name === this.options.node && lastNode.content.size === 0) {
          // Already have an empty trailing paragraph
          return;
        }

        // Insert a new empty paragraph at the end for escape mechanism
        const nodeType = newState.schema.nodes[this.options.node];
        if (nodeType) {
          const newParagraph = nodeType.create();
          return tr.insert(endPosition, newParagraph);
        }
      },
      state: {
        init: () => true,
        apply: (tr, value) => {
          if (!tr.docChanged) {
            return value;
          }

          const { doc } = tr;
          const lastNode = doc.lastChild;

          // Always try to maintain a trailing node unless last node is empty paragraph
          return !(
            lastNode &&
            lastNode.type.name === this.options.node &&
            lastNode.content.size === 0
          );
        },
      },
    });

    return [plugin];
  },
});
