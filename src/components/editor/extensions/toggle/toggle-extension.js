import { Node, mergeAttributes } from "@tiptap/core";
import { Plugin, PluginKey, TextSelection } from "prosemirror-state";

/**
 * 🔽 Toggle Extension - Notion-Like Collapsible Blocks
 *
 * This extension creates collapsible content blocks just like in Notion.
 * Users can click to expand/collapse sections, perfect for organizing content.
 *
 * 🎯 What this extension provides:
 * - Collapsible content blocks with headers
 * - Click to expand/collapse functionality
 * - Smooth animations for open/close states
 * - Keyboard navigation support
 * - Nested content support (any content can go inside)
 * - Persistent state (remembers if expanded or collapsed)
 *
 * 💡 How users interact with it:
 * - Type "/" and select "Toggle" to create one
 * - Click the arrow icon to expand/collapse
 * - Type in the header area to set the title
 * - Type in the content area when expanded
 * - Use backspace at beginning of header to convert to normal text
 *
 * 🔧 Technical details:
 * - Uses ProseMirror plugins for advanced functionality
 * - Stores open/closed state in node attributes
 * - Supports keyboard navigation and accessibility
 * - Integrates with editor's undo/redo system
 * - Handles focus management and cursor positioning
 */
export const Toggle = Node.create({
  name: "toggle",

  group: "block",

  content: "toggleSummary block+",

  defining: true,

  isolating: true,

  addOptions() {
    return {
      HTMLAttributes: {
        class: "toggle-block",
      },
      defaultOpen: true,
    };
  },

  addAttributes() {
    return {
      open: {
        default: this.options.defaultOpen,
        parseHTML: (element) => element.hasAttribute("open") || element.hasAttribute("data-open"),
        renderHTML: (attributes) => {
          if (attributes.open) {
            return {
              open: "",
              "data-open": "true",
            };
          }
          return {
            "data-open": "false",
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "div[data-type='toggle']",
        getAttrs: (element) => ({
          open: element.hasAttribute("data-open") || element.classList.contains("is-open"),
        }),
      },
    ];
  },

  renderHTML({ HTMLAttributes, node }) {
    const attrs = mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
      "data-type": "toggle",
      "data-open": node.attrs.open ? "" : null,
      class: `toggle-block ${node.attrs.open ? "is-open" : "is-closed"}`,
    });

    return ["div", attrs, 0];
  },

  addCommands() {
    return {
      setToggle:
        (attributes = {}) =>
        ({ commands }) => {
          return commands.setNode(this.name, attributes);
        },

      toggleToggle:
        () =>
        ({ commands }) => {
          return commands.toggleNode(this.name, "paragraph");
        },

      insertToggle:
        (attributes = {}) =>
        ({ chain }) => {
          const toggleAttrs = { open: true, ...attributes };

          return chain()
            .insertContent({
              type: this.name,
              attrs: toggleAttrs,
              content: [
                {
                  type: "toggleSummary",
                  content: [], // Empty content for placeholder
                },
                {
                  type: "paragraph",
                  content: [], // Empty content for placeholder
                },
              ],
            })
            .focus()
            .run();
        },

      toggleOpen:
        () =>
        ({ tr, state, dispatch }) => {
          const { selection } = state;
          const { $from } = selection;

          // Find the toggle node
          let toggleNode = null;
          let togglePos = null;

          for (let depth = $from.depth; depth >= 0; depth--) {
            const node = $from.node(depth);
            if (node.type.name === this.name) {
              toggleNode = node;
              togglePos = $from.start(depth) - 1;
              break;
            }
          }

          if (toggleNode && togglePos !== null) {
            const newAttrs = {
              ...toggleNode.attrs,
              open: !toggleNode.attrs.open,
            };

            tr.setNodeMarkup(togglePos, undefined, newAttrs);

            if (dispatch) {
              dispatch(tr);
            }

            return true;
          }

          return false;
        },
    };
  },

  addKeyboardShortcuts() {
    return {
      "Mod-Shift-t": () => this.editor.commands.insertToggle(),

      Enter: ({ editor }) => {
        const { selection } = editor.state;
        const { $from } = selection;

        // Check if we're in a toggle summary
        if ($from.parent.type.name === "toggleSummary") {
          // Move to the content area
          const togglePos = $from.start($from.depth - 1);
          const contentPos = togglePos + $from.parent.nodeSize;

          editor.commands.focus(contentPos);
          return true;
        }

        // Allow unlimited Enter presses inside toggle content
        // No auto-escape behavior - users can press Enter as many times as they want

        return false;
      },

      Backspace: ({ editor }) => {
        const { selection, doc } = editor.state;
        const { $from } = selection;

        // Check if we're at the start of a toggle summary
        if ($from.parent.type.name === "toggleSummary" && $from.parentOffset === 0) {
          // If summary is empty, delete the entire toggle
          if ($from.parent.textContent === "") {
            for (let depth = $from.depth; depth >= 0; depth--) {
              const node = $from.node(depth);
              if (node.type.name === this.name) {
                const togglePos = $from.start(depth) - 1;
                editor.commands.deleteRange({
                  from: togglePos,
                  to: togglePos + node.nodeSize,
                });
                return true;
              }
            }
          } else {
            // If summary has content and cursor is at start, convert to paragraph
            for (let depth = $from.depth; depth >= 0; depth--) {
              const node = $from.node(depth);
              if (node.type.name === this.name) {
                const togglePos = $from.start(depth) - 1;
                const summaryContent = $from.parent.textContent;

                // Replace toggle with paragraph containing the summary text
                editor.commands.deleteRange({
                  from: togglePos,
                  to: togglePos + node.nodeSize,
                });
                editor.commands.insertContent(`<p>${summaryContent}</p>`);
                return true;
              }
            }
          }
        }

        // Check if we're at the start of toggle content and it's empty
        if (
          $from.parent.type.name === "paragraph" &&
          $from.parentOffset === 0 &&
          $from.parent.textContent === ""
        ) {
          // Check if this paragraph is inside a toggle
          for (let depth = $from.depth; depth >= 0; depth--) {
            const node = $from.node(depth);
            if (node.type.name === this.name) {
              // Check if this is the only content paragraph
              const toggleNode = node;
              let contentParagraphs = 0;

              toggleNode.forEach((child) => {
                if (child.type.name === "paragraph") {
                  contentParagraphs++;
                }
              });

              // If this is the only paragraph and it's empty, delete the toggle
              if (contentParagraphs === 1) {
                const togglePos = $from.start(depth) - 1;
                editor.commands.deleteRange({
                  from: togglePos,
                  to: togglePos + toggleNode.nodeSize,
                });
                return true;
              }
            }
          }
        }

        return false;
      },
    };
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("toggleClick"),
        props: {
          handleClickOn: (view, pos, node, nodePos, event) => {
            if (node.type.name === this.name) {
              const target = event.target;
              const summary = target.closest(".toggle-summary");

              if (summary) {
                // Get the position of the click relative to the summary element
                const rect = summary.getBoundingClientRect();
                const clickX = event.clientX - rect.left;

                // Only toggle if clicked on the arrow area (first 32px for bigger icon)
                if (clickX <= 32) {
                  this.editor.commands.toggleOpen();
                  return true;
                } else {
                  // If clicked in text area, position cursor at end of content
                  const summaryNode = node.firstChild;
                  if (summaryNode && summaryNode.type.name === "toggleSummary") {
                    // Calculate the position at the end of the summary content
                    const summaryStart = nodePos + 1;
                    const summaryContentEnd = summaryStart + summaryNode.content.size;

                    // Create selection at the end of summary content
                    try {
                      const selection = TextSelection.create(view.state.doc, summaryContentEnd);
                      view.dispatch(view.state.tr.setSelection(selection));
                      view.focus();
                      return true;
                    } catch (error) {
                      // Fallback: use editor command to focus at end
                      this.editor.commands.focus();
                      return true;
                    }
                  }
                }
              }
            }
            return false;
          },
        },
      }),
    ];
  },
});

/**
 * Toggle Summary Extension
 * The clickable header part of the toggle
 */
export const ToggleSummary = Node.create({
  name: "toggleSummary",

  content: "inline*",

  defining: true,

  isolating: false,

  addOptions() {
    return {
      HTMLAttributes: {
        class: "toggle-summary",
      },
      placeholder: "Toggle",
    };
  },

  addAttributes() {
    return {
      placeholder: {
        default: this.options.placeholder,
        renderHTML: (attributes) => {
          return {
            "data-placeholder": attributes.placeholder,
          };
        },
        parseHTML: (element) => element.getAttribute("data-placeholder"),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "div[data-type='toggle-summary']",
      },
      {
        tag: ".toggle-summary",
      },
    ];
  },

  renderHTML({ HTMLAttributes, node }) {
    const attrs = mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
      "data-type": "toggle-summary",
      class: "toggle-summary",
      "data-placeholder": node.attrs.placeholder || this.options.placeholder,
    });

    return ["div", attrs, 0];
  },

  addKeyboardShortcuts() {
    return {
      Enter: ({ editor }) => {
        const { selection } = editor.state;
        const { $from } = selection;

        if ($from.parent.type.name === this.name) {
          // Move to the content area of the toggle
          const toggleDepth = $from.depth - 1;
          const toggleNode = $from.node(toggleDepth);
          const togglePos = $from.start(toggleDepth);

          // Find the first content block after the summary
          let contentPos = togglePos + $from.parent.nodeSize;

          editor.commands.focus(contentPos);
          return true;
        }

        return false;
      },
    };
  },
});
