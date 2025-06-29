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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [linkData, setLinkData] = useState({ text: "", href: "" });
  const [linkPosition, setLinkPosition] = useState(null);

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
  const handleLinkClick = useCallback((event) => {
    if (!editor) return;

    // Find the link element
    const linkElement = event.target.closest('a[href]');
    if (!linkElement) return;

    // Prevent default link behavior
    event.preventDefault();
    event.stopPropagation();

    // Get the link's position in the document
    const href = linkElement.getAttribute('href');
    const text = linkElement.textContent;

    // Find the link in the editor and select it
    const { state } = editor;
    const { doc } = state;
    let linkPos = null;

    doc.descendants((node, pos) => {
      if (node.marks) {
        const linkMark = node.marks.find(mark => mark.type.name === 'link' && mark.attrs.href === href);
        if (linkMark) {
          linkPos = { from: pos, to: pos + node.nodeSize };
          return false; // Stop searching
        }
      }
    });

    if (linkPos) {
      // Select the link
      editor.commands.setTextSelection({ from: linkPos.from, to: linkPos.to });
      
      // Set link data and open dialog
      setLinkData({ text, href });
      setLinkPosition(linkPos);
      setIsDialogOpen(true);
    }
  }, [editor]);

  /**
   * Set up click handler for links in the editor
   */
  useEffect(() => {
    if (!editor) return;

    const editorElement = editor.view.dom;
    
    // Add click event listener to the editor
    const handleClick = (event) => {
      // Check if clicked element is a link
      const linkElement = event.target.closest('a[href]');
      if (linkElement) {
        handleLinkClick(event);
      }
    };

    editorElement.addEventListener('click', handleClick);

    return () => {
      editorElement.removeEventListener('click', handleClick);
    };
  }, [editor, handleLinkClick]);

  /**
   * Open link dialog with current selection
   */
  const openLinkDialog = useCallback(() => {
    if (!editor) return;

    const data = extractLinkData();
    setLinkData(data);
    setIsDialogOpen(true);
  }, [editor, extractLinkData]);

  /**
   * Handle link update
   */
  const handleLinkUpdate = useCallback((newLinkData) => {
    if (!editor) return;

    try {
      // Update the link
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: newLinkData.href })
        .run();

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
  }, [editor, linkData.text]);

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
   * Close dialog
   */
  const closeDialog = useCallback(() => {
    setIsDialogOpen(false);
    setLinkData({ text: "", href: "" });
    setLinkPosition(null);
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
    isDialogOpen,
    linkData,
    linkPosition,
    
    // Functions
    openLinkDialog,
    closeDialog,
    handleLinkUpdate,
    handleLinkRemove,
    hasLink,
    extractLinkData,
    
    // Dialog props
    dialogProps: {
      open: isDialogOpen,
      onOpenChange: setIsDialogOpen,
      editor,
      linkData,
      onUpdate: handleLinkUpdate,
      onRemove: handleLinkRemove,
    },
  };
}
