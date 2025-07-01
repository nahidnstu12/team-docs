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

      console.log("Updating link with data:", newLinkData);
      console.log("Current link data:", linkData);

      try {
        // Use simpler approach for updates too
        editor.chain().focus().extendMarkRange("link").run();

        // If text changed, replace it
        if (newLinkData.text && newLinkData.text !== linkData.text) {
          console.log("Updating link text");
          editor.chain().focus().insertContent(newLinkData.text).run();
        }

        // Update the URL using toggleLink (this will update existing link)
        console.log("Updating link URL");
        editor.chain().focus().extendMarkRange("link").toggleLink({ href: newLinkData.href }).run();
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

      // Clean up the URL first - fix the double colon issue
      let cleanUrl = newLinkData.href.trim();
      if (cleanUrl.includes("https:://")) {
        cleanUrl = cleanUrl.replace("https:://", "https://");
      }
      if (cleanUrl.includes("http:://")) {
        cleanUrl = cleanUrl.replace("http:://", "http://");
      }

      console.log("Creating link with data:", { ...newLinkData, href: cleanUrl });
      console.log("Selected text:", selectedText);
      console.log("Editor state:", editor.state.selection);

      try {
        // COMPREHENSIVE DEBUGGING - Let's see what's actually happening
        console.log("=== LINK CREATION DEBUG START ===");
        console.log(
          "Editor extensions:",
          editor.extensionManager.extensions.map((ext) => ext.name)
        );
        console.log("Schema marks:", Object.keys(editor.schema.marks));
        console.log("Has link mark in schema:", !!editor.schema.marks.link);
        console.log("Available commands:", Object.keys(editor.commands));
        console.log("Can set link:", typeof editor.commands.setLink === "function");
        console.log("Current HTML before link:", editor.getHTML());
        console.log("Current document JSON:", JSON.stringify(editor.getJSON(), null, 2));

        // Use standard TipTap commands now that CustomLink is removed
        console.log("Using standard TipTap link commands");

        if (selectedText) {
          // We have selected text - apply the link to it
          console.log("Applying link to selected text");
          console.log("Current selection before link:", editor.state.selection);

          // First, ensure we have the right selection
          const { from, to } = editor.state.selection;
          console.log("Selection positions:", { from, to });
          console.log("Selected text from positions:", editor.state.doc.textBetween(from, to));

          // Try a different approach - select the text first, then apply link
          const result = editor
            .chain()
            .focus()
            .command(({ tr, state }) => {
              // Find the text "test" in the document and select it
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

              console.log("Found text at positions:", { textFrom, textTo, textFound });

              if (textFound) {
                tr.setSelection(state.selection.constructor.create(state.doc, textFrom, textTo));
                return true;
              }
              return false;
            })
            .setLink({ href: cleanUrl })
            .run();

          console.log("Link application result:", result);
          console.log("Is link active after application:", editor.isActive("link"));
          console.log("Link attributes after application:", editor.getAttributes("link"));

          // If text is different, replace it
          if (newLinkData.text !== selectedText) {
            console.log("Replacing text content");
            editor.chain().focus().insertContent(newLinkData.text).run();
          }
        } else {
          // No selected text - insert new text with link
          console.log("Inserting new link text");
          const currentPos = editor.state.selection.from;

          // Insert the text and immediately apply link
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

          console.log("Link creation result:", result);

          // Move cursor after the link
          editor.commands.setTextSelection(currentPos + newLinkData.text.length);
        }

        // Check the final HTML output immediately
        console.log("Immediate HTML after link creation:", editor.getHTML());
        console.log(
          "Immediate JSON after link creation:",
          JSON.stringify(editor.getJSON(), null, 2)
        );

        // Also check after a short delay
        setTimeout(() => {
          console.log("Final editor HTML after delay:", editor.getHTML());
          console.log("Final JSON after delay:", JSON.stringify(editor.getJSON(), null, 2));
        }, 100);
      } catch (error) {
        console.error("Error creating link:", error);
        console.error("Error details:", error.stack);
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
