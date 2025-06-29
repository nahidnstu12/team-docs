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
        // Update the link
        editor.chain().focus().extendMarkRange("link").setLink({ href: newLinkData.href }).run();

        // If text changed, update it too
        if (newLinkData.text && newLinkData.text !== linkData.text) {
          editor
            .chain()
            .focus()
            .extendMarkRange("link")
            .insertContent(newLinkData.text)
            .setLink({ href: newLinkData.href })
            .run();
        }
      } catch (error) {
        console.error("Error updating link:", error);
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

      try {
        // Create the link
        if (selectedText) {
          // Replace selected text with link
          editor
            .chain()
            .focus()
            .insertContent(newLinkData.text)
            .setTextSelection({
              from: editor.state.selection.from,
              to: editor.state.selection.from + newLinkData.text.length,
            })
            .setLink({ href: newLinkData.href })
            .run();
        } else {
          // Insert new link
          editor
            .chain()
            .focus()
            .insertContent(`<a href="${newLinkData.href}">${newLinkData.text}</a>`)
            .run();
        }
      } catch (error) {
        console.error("Error creating link:", error);
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
