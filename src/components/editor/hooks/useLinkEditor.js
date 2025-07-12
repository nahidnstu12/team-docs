"use client";

import { useState, useCallback, useEffect } from "react";

/**
 * useLinkEditor Hook
 * Manages link editing functionality for TipTap editor
 *
 * @param {Object} editor - TipTap editor instance
 * @returns {Object} Link editing state and functions
 */
export function useLinkEditor(editor) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [linkData, setLinkData] = useState({ text: "", href: "" });
  const [linkPosition, setLinkPosition] = useState(null);
  const [selectedText, setSelectedText] = useState("");

  /**
   * Extract link data from current selection or cursor position
   */
  const extractLinkData = useCallback(() => {
    if (!editor) return { text: "", href: "" };

    const { from, to } = editor.state.selection;
    const text = editor.state.doc.textBetween(from, to);
    const attrs = editor.getAttributes("link");

    return {
      text: text || "",
      href: attrs.href || "",
    };
  }, [editor]);

  /**
   * Handle clicking on a link in the editor
   */
  const handleLinkClick = useCallback(
    (event) => {
      if (!editor) return;

      // Find the link element
      const linkElement = event.target.closest("a[href]");
      if (!linkElement) return;

      // Prevent default link behavior
      event.preventDefault();
      event.stopPropagation();

      // Get the link's position in the document
      const href = linkElement.getAttribute("href");
      const text = linkElement.textContent;

      // Find the link in the editor and select it
      const { state } = editor;
      const { doc } = state;
      let linkPos = null;

      doc.descendants((node, pos) => {
        if (node.marks) {
          const linkMark = node.marks.find(
            (mark) => mark.type.name === "link" && mark.attrs.href === href
          );
          if (linkMark) {
            linkPos = { from: pos, to: pos + node.nodeSize };
            return false; // Stop searching
          }
        }
      });

      if (linkPos) {
        // Select the link
        editor.commands.setTextSelection({ from: linkPos.from, to: linkPos.to });

        // Set link data and open edit dialog
        setLinkData({ text, href });
        setLinkPosition(linkPos);
        setIsEditDialogOpen(true);
      }
    },
    [editor]
  );

  /**
   * Set up click handler for links in the editor
   */
  useEffect(() => {
    if (!editor) return;

    const editorElement = editor.view.dom;

    // Add click event listener to the editor
    const handleClick = (event) => {
      // Check if clicked element is a link
      const linkElement = event.target.closest("a[href]");
      if (linkElement) {
        handleLinkClick(event);
      }
    };

    editorElement.addEventListener("click", handleClick);

    return () => {
      editorElement.removeEventListener("click", handleClick);
    };
  }, [editor, handleLinkClick]);

  /**
   * Open link edit dialog with current selection
   */
  const openLinkEditDialog = useCallback(() => {
    if (!editor) return;

    const data = extractLinkData();
    setLinkData(data);
    setIsEditDialogOpen(true);
  }, [editor, extractLinkData]);

  /**
   * Open link create dialog with current selection
   */
  const openLinkCreateDialog = useCallback(() => {
    if (!editor) return;

    // Get currently selected text
    const { from, to } = editor.state.selection;
    const text = editor.state.doc.textBetween(from, to);

    setSelectedText(text);
    setIsCreateDialogOpen(true);
  }, [editor]);

  /**
   * Handle link update
   */
  const handleLinkUpdate = useCallback(
    (newLinkData) => {
      if (!editor) return;

      try {
        // Extend selection to cover entire link mark
        editor.chain().focus().extendMarkRange("link").run();

        // Replace text content if it has changed
        if (newLinkData.text && newLinkData.text !== linkData.text) {
          editor.chain().focus().insertContent(newLinkData.text).run();
        }

        // Update the link URL while preserving text selection
        editor.chain().focus().extendMarkRange("link").toggleLink({ href: newLinkData.href }).run();
      } catch (error) {
        // Silently handle link update errors - user can retry
      }
    },
    [editor, linkData.text]
  );

  /**
   * Handle link creation
   */
  const handleLinkCreate = useCallback(
    (newLinkData) => {
      if (!editor) return;

      // Clean up the URL first - fix the double colon issue
      let cleanUrl = newLinkData.href.trim();
      if (cleanUrl.includes("https:://")) {
        cleanUrl = cleanUrl.replace("https:://", "https://");
      }
      if (cleanUrl.includes("http:://")) {
        cleanUrl = cleanUrl.replace("http:://", "http://");
      }

      // Create link with cleaned URL data
      try {
        // Create link using standard TipTap link commands

        if (selectedText) {
          // Apply link to selected text
          const { from, to } = editor.state.selection;

          // Find and select the target text, then apply link
          const result = editor
            .chain()
            .focus()
            .command(({ tr, state }) => {
              // Search for the selected text in the document
              const doc = state.doc;
              let textFound = false;
              let textFrom = 0;
              let textTo = 0;

              doc.descendants((node, pos) => {
                if (node.isText && node.text === selectedText) {
                  textFrom = pos;
                  textTo = pos + node.text.length;
                  textFound = true;
                  return false; // Stop searching
                }
              });

              // Set selection to found text position
              if (textFound) {
                tr.setSelection(state.selection.constructor.create(state.doc, textFrom, textTo));
                return true;
              }
              return false;
            })
            .setLink({ href: cleanUrl })
            .run();

          // Replace text content if it differs from selected text
          if (newLinkData.text !== selectedText) {
            editor.chain().focus().insertContent(newLinkData.text).run();
          }
        } else {
          // No selected text - insert new text with link
          const currentPos = editor.state.selection.from;

          // Insert text and apply link in one operation
          const result = editor
            .chain()
            .focus()
            .insertContent(newLinkData.text)
            .setTextSelection({
              from: currentPos,
              to: currentPos + newLinkData.text.length,
            })
            .toggleLink({ href: cleanUrl })
            .run();

          // Position cursor after the newly created link
          editor.commands.setTextSelection(currentPos + newLinkData.text.length);
        }
      } catch (error) {
        // Silently handle link creation errors - user can retry
      }
    },
    [editor, selectedText]
  );

  /**
   * Handle link removal
   */
  const handleLinkRemove = useCallback(() => {
    if (!editor) return;

    try {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } catch (error) {
      console.error("Error removing link:", error);
    }
  }, [editor]);

  /**
   * Close dialogs
   */
  const closeEditDialog = useCallback(() => {
    setIsEditDialogOpen(false);
    setLinkData({ text: "", href: "" });
    setLinkPosition(null);
  }, []);

  const closeCreateDialog = useCallback(() => {
    setIsCreateDialogOpen(false);
    setSelectedText("");
  }, []);

  /**
   * Check if current selection has a link
   */
  const hasLink = useCallback(() => {
    if (!editor) return false;
    return editor.isActive("link");
  }, [editor]);

  return {
    // State
    isEditDialogOpen,
    isCreateDialogOpen,
    linkData,
    linkPosition,
    selectedText,

    // Functions
    openLinkEditDialog,
    openLinkCreateDialog,
    closeEditDialog,
    closeCreateDialog,
    handleLinkUpdate,
    handleLinkCreate,
    handleLinkRemove,
    hasLink,
    extractLinkData,

    // Dialog props
    editDialogProps: {
      open: isEditDialogOpen,
      onOpenChange: setIsEditDialogOpen,
      editor,
      linkData,
      onUpdate: handleLinkUpdate,
      onRemove: handleLinkRemove,
    },
    createDialogProps: {
      open: isCreateDialogOpen,
      onOpenChange: setIsCreateDialogOpen,
      editor,
      selectedText,
      onCreate: handleLinkCreate,
    },
  };
}
