import { Node, mergeAttributes } from "@tiptap/core";
import { Plugin, PluginKey } from "prosemirror-state";

/**
 * Toggle Extension for TipTap
 * Notion-like collapsible content blocks
 * 
 * @fileoverview This extension provides toggle/collapsible functionality
 * similar to Notion's toggle blocks, with smooth animations and proper
 * keyboard navigation support.
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
        parseHTML: (element) => element.hasAttribute("open"),
        renderHTML: (attributes) => {
          if (attributes.open) {
            return { open: "" };
          }
          return {};
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
                  content: [{ type: "text", text: "Toggle" }],
                },
                {
                  type: "paragraph",
                  content: [{ type: "text", text: "Add your content here..." }],
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
              
              // Check if click is on the toggle arrow or summary
              if (
                target.closest(".toggle-arrow") ||
                target.closest(".toggle-summary")
              ) {
                this.editor.commands.toggleOpen();
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

  renderHTML({ HTMLAttributes }) {
    const attrs = mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
      "data-type": "toggle-summary",
      class: "toggle-summary",
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
