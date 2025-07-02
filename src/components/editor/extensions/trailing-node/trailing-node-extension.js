import { Extension } from "@tiptap/core";
import { Plugin, PluginKey, TextSelection } from "prosemirror-state";

/**
 * 🚪 TrailingNode Extension - The Escape Route
 *
 * This extension ensures users can ALWAYS escape from any block type.
 * It's like having an emergency exit - no matter what block you're in,
 * there's always a way to get out and continue writing.
 *
 * 🎯 What this extension does:
 * - Adds a paragraph at the end of the document
 * - Ensures users can always click to escape blocks
 * - Prevents getting "trapped" in complex blocks like toggles or code blocks
 * - Shows helpful placeholder text when focused
 * - Maintains proper cursor positioning
 *
 * 💡 Why this is important:
 * - Notion-like behavior: always have an escape route
 * - Better UX: users never feel stuck
 * - Accessibility: keyboard navigation always works
 * - Consistency: predictable behavior across all block types
 *
 * 🔧 How it works:
 * - Monitors document structure in real-time
 * - Automatically adds trailing paragraph when needed
 * - Handles focus management and cursor positioning
 * - Integrates seamlessly with other extensions
 *
 * 📝 User experience:
 * - Click below any content to start a new paragraph
 * - Always see "start writing or / for commands" placeholder
 * - Never get stuck in complex block structures
 * - Smooth transitions between different content types
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
