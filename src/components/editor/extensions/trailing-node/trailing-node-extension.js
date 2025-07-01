import { Extension } from "@tiptap/core";
import { Plugin, PluginKey, TextSelection } from "prosemirror-state";

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
        const { doc, tr, selection } = newState;
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
          const newTr = tr.insert(endPosition, newParagraph);

          // CRITICAL FIX: Preserve the original selection position to prevent cursor jumping
          // Only preserve if the selection is not intentionally at the very end
          // This maintains the escape mechanism while fixing cursor positioning
          if (selection.from < endPosition) {
            // Try to preserve the exact selection using mapping
            try {
              const mappedSelection = selection.map(newTr.doc, newTr.mapping);
              newTr.setSelection(mappedSelection);
            } catch (e) {
              // If mapping fails, try to set selection at the original position
              try {
                const resolvedPos = newTr.doc.resolve(
                  Math.min(selection.from, newTr.doc.content.size)
                );
                if (resolvedPos) {
                  newTr.setSelection(new TextSelection(resolvedPos));
                }
              } catch (mappingError) {
                // If selection mapping fails, let TipTap handle cursor positioning
                // This is a fallback case that rarely occurs in normal usage
              }
            }
          }

          return newTr;
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
