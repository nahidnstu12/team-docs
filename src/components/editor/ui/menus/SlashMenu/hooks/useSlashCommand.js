/**
 * useSlashCommand Hook
 * Manages slash command menu state and behavior
 *
 * @fileoverview This hook handles the logic for the slash command menu,
 * including positioning, keyboard navigation, search filtering, and command execution.
 */

import { useState, useEffect, useMemo, useCallback } from "react";
import { useFloating, autoUpdate, offset, flip, shift, size } from "@floating-ui/react";
import { SLASH_COMMAND_CONFIG } from "../../../../core/EditorConfig";
import { getBaseCommands } from "../../../commands";

/**
 * useSlashCommand Hook
 *
 * @param {Object} editor - TipTap editor instance
 * @param {Function} onOpenChange - External dialog state change handler
 * @param {boolean} open - External dialog open state
 * @param {Function} setInitialText - Set initial text for link dialog
 * @param {Function} setInitialUrl - Set initial URL for link dialog
 * @param {Function} setDialogMode - Set dialog mode (create/edit)
 * @param {Object} config - Configuration overrides
 * @returns {Object} Hook state and utilities
 */
export const useSlashCommand = (
  editor,
  onOpenChange,
  open,
  setInitialText,
  setInitialUrl,
  setDialogMode,
  config = {}
) => {
  // Merge configuration with defaults
  const slashConfig = { ...SLASH_COMMAND_CONFIG, ...config };

  // State management
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPosition, setSelectedPosition] = useState({
    groupIndex: 0,
    itemIndex: 0,
  });
  const [menuOpenedAt, setMenuOpenedAt] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [savedCursorPosition, setSavedCursorPosition] = useState(null);
  const [isUsingKeyboard, setIsUsingKeyboard] = useState(true); // Track input method

  // Floating UI setup
  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    strategy: "absolute", // Use absolute positioning
    middleware: [
      offset(slashConfig.offset),
      flip(),
      shift({ padding: 8 }),
      size({
        apply({ availableHeight, elements }) {
          Object.assign(elements.floating.style, {
            maxHeight: `${Math.min(availableHeight - 20, 400)}px`,
          });
        },
      }),
    ],
    whileElementsMounted: autoUpdate,
    placement: "bottom-start", // Explicitly set placement
  });

  // Memoize commands to prevent recreation on every render (defined first)
  const commands = useMemo(() => {
    if (!editor) {
      return [];
    }

    const baseCommands = getBaseCommands(
      editor,
      onOpenChange || (() => {}),
      setInitialText || (() => {}),
      setInitialUrl || (() => {}),
      setDialogMode || (() => {})
    );

    return baseCommands.map((group) => ({
      ...group,
      items: group.items.map((item) => ({
        ...item,
        command: () => {
          const { from } = editor.state.selection;
          const cursorPosition = from - 1; // Position where cursor should be after command

          // Remove the slash character first
          editor
            .chain()
            .deleteRange({ from: from - 1, to: from })
            .run();

          // Execute the original command (which may include its own focus calls)
          item.command();

          // Preserve cursor positioning after command execution
          // setTimeout ensures this runs after all ProseMirror transactions complete
          setTimeout(() => {
            if (editor && !editor.isDestroyed) {
              try {
                // Calculate target cursor position within document bounds
                const doc = editor.state.doc;
                const targetPos = Math.min(cursorPosition, doc.content.size);
                const resolvedPos = doc.resolve(targetPos);

                // Set text selection at the calculated position to maintain cursor placement
                editor.commands.setTextSelection(targetPos);
              } catch (error) {
                // Fallback to basic focus if cursor positioning fails
                editor.commands.focus();
              }
            }
          }, 0);

          // Don't close menu here - let executeSelectedCommand handle it
        },
      })),
    }));
  }, [editor]); // Only depend on editor, not the function props

  // Filter and group items based on search query
  const groupedItems = useMemo(() => {
    if (!commands.length) return [];

    const query = searchQuery.toLowerCase().trim();

    if (!query) {
      return commands;
    }

    // Filter items based on search query
    const filteredGroups = commands
      .map((group) => ({
        ...group,
        items: group.items.filter((item) => {
          const searchableText = [
            item.title,
            item.subtitle,
            item.shortcut,
            ...(item.keywords || []),
          ]
            .join(" ")
            .toLowerCase();

          return searchableText.includes(query);
        }),
      }))
      .filter((group) => group.items.length > 0);

    return filteredGroups;
  }, [commands, searchQuery]);

  // Calculate total items for navigation
  const totalItems = useMemo(() => {
    return groupedItems.reduce((total, group) => total + group.items.length, 0);
  }, [groupedItems]);

  // Reset selection when search query changes
  useEffect(() => {
    setSelectedPosition({ groupIndex: 0, itemIndex: 0 });
    setSelectedIndex(0);
  }, [searchQuery]);

  // Use commands directly instead of storing in state to avoid infinite loops

  // Helper functions (defined first to avoid hoisting issues)
  const getPositionFromIndex = useCallback(
    (index) => {
      let currentIndex = 0;

      for (let groupIndex = 0; groupIndex < groupedItems.length; groupIndex++) {
        const group = groupedItems[groupIndex];

        if (currentIndex + group.items.length > index) {
          return {
            groupIndex,
            itemIndex: index - currentIndex,
          };
        }

        currentIndex += group.items.length;
      }

      return { groupIndex: 0, itemIndex: 0 };
    },
    [groupedItems]
  );

  const getSelectedItem = useCallback(() => {
    const group = groupedItems[selectedPosition.groupIndex];
    if (!group) return null;

    return group.items[selectedPosition.itemIndex];
  }, [groupedItems, selectedPosition]);

  // Navigation helpers for keyboard menu interaction
  const navigateDown = useCallback(() => {
    // Skip navigation if no items are available
    if (totalItems === 0) return;

    // Enable keyboard navigation mode for proper hover state management
    setIsUsingKeyboard(true);

    // Calculate next index with wraparound (circular navigation)
    const newIndex = (selectedIndex + 1) % totalItems;
    const newPosition = getPositionFromIndex(newIndex);

    // Update selection state to reflect new position
    setSelectedIndex(newIndex);
    setSelectedPosition(newPosition);
  }, [totalItems, selectedIndex, getPositionFromIndex]);

  const navigateUp = useCallback(() => {
    // Skip navigation if no items are available
    if (totalItems === 0) return;

    // Enable keyboard navigation mode for proper hover state management
    setIsUsingKeyboard(true);

    // Calculate previous index with wraparound (circular navigation)
    const newIndex = selectedIndex === 0 ? totalItems - 1 : selectedIndex - 1;
    const newPosition = getPositionFromIndex(newIndex);

    // Update selection state to reflect new position
    setSelectedIndex(newIndex);
    setSelectedPosition(newPosition);
  }, [totalItems, selectedIndex, getPositionFromIndex]);

  // Focus restoration helper for when menu closes
  const restoreEditorFocus = useCallback(() => {
    // Restore focus to editor after menu interaction
    // This ensures the editor remains focused for continued typing
    if (editor && !editor.isDestroyed) {
      // Simple focus restoration - cursor positioning is handled by other mechanisms
      editor.commands.focus();
    }
  }, [editor, savedCursorPosition]);

  const executeSelectedCommand = useCallback(() => {
    const selectedItem = getSelectedItem();
    if (selectedItem) {
      // Calculate cursor position before command execution for later restoration
      const { from } = editor.state.selection;
      const cursorPosition = from - 1; // Target position after slash removal and command execution

      // First remove the slash character
      editor
        .chain()
        .deleteRange({ from: from - 1, to: from })
        .run();

      // Find the original command from baseCommands
      const baseCommands = getBaseCommands(
        editor,
        onOpenChange || (() => {}),
        setInitialText || (() => {}),
        setInitialUrl || (() => {}),
        setDialogMode || (() => {})
      );

      // Find the original command
      let originalCommand = null;
      for (const group of baseCommands) {
        const foundItem = group.items.find((item) => item.title === selectedItem.title);
        if (foundItem) {
          originalCommand = foundItem.command;
          break;
        }
      }

      if (originalCommand) {
        originalCommand();
      } else {
        // Fallback to wrapped command
        selectedItem.command();
      }

      // Restore cursor position after command execution
      // setTimeout ensures this runs after all command transactions complete
      setTimeout(() => {
        if (editor && !editor.isDestroyed) {
          try {
            // Calculate safe cursor position within document bounds
            const doc = editor.state.doc;
            const targetPos = Math.min(cursorPosition, doc.content.size);

            // Set text selection to maintain cursor at intended position
            editor.commands.setTextSelection(targetPos);
          } catch (error) {
            // Fallback to basic focus if positioning fails
            editor.commands.focus();
          }
        }
      }, 0);

      setIsOpen(false);
    }
  }, [getSelectedItem, editor, onOpenChange, setInitialText, setInitialUrl, setDialogMode]);

  // Keyboard event handler using document events (TipTap editor.on doesn't work for this)
  useEffect(() => {
    if (!editor) return;

    const handleKeyDown = (e) => {
      // Process keyboard events for slash menu interaction

      // Handle slash key to open menu (only when editor is focused)
      if (e.key === "/" && editor?.isFocused) {
        // Defer to next tick to allow slash character to appear in document
        setTimeout(() => {
          const { from } = editor.state.selection;
          const textBefore = editor.state.doc.textBetween(from - 1, from, "\n");

          // Verify slash was actually inserted before opening menu
          if (textBefore === "/") {
            // Calculate menu position based on slash character coordinates
            const pos = editor.view.coordsAtPos(from - 1);

            // Store cursor position for focus restoration when menu closes
            setSavedCursorPosition(from);

            // Position menu 8px below cursor for optimal user experience
            const menuX = pos.left;
            const menuY = pos.bottom + 8;
            setMenuPosition({ x: menuX, y: menuY });

            // Still create virtual element for Floating UI as fallback
            const virtualElement = {
              getBoundingClientRect: () => ({
                width: 0,
                height: 0,
                x: pos.left,
                y: pos.top,
                top: pos.top,
                right: pos.left,
                bottom: pos.bottom,
                left: pos.left,
              }),
            };

            refs.setReference(virtualElement);

            setIsOpen(true);
            setMenuOpenedAt(Date.now());
            setSearchQuery("");
            setSelectedPosition({ groupIndex: 0, itemIndex: 0 });
            setSelectedIndex(0);
          }
        }, 0);
      }

      // Handle keyboard navigation when menu is open
      if (isOpen) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          // Navigate to next menu item with circular wraparound
          navigateDown();
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          // Navigate to previous menu item with circular wraparound
          navigateUp();
        } else if (e.key === "Enter") {
          e.preventDefault();
          // Execute the currently selected command
          executeSelectedCommand();
        } else if (e.key === "Escape") {
          e.preventDefault();
          // Close menu and return focus to editor
          setIsOpen(false);
          restoreEditorFocus();
        }
        return; // Prevent other key processing when menu is open
      }
    };

    // Use document events instead of editor events
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [editor, isOpen, navigateDown, navigateUp, executeSelectedCommand, refs, restoreEditorFocus]);

  // Close menu when editor loses focus or selection changes significantly
  useEffect(() => {
    if (!editor) return;

    const handleSelectionUpdate = () => {
      const { from } = editor.state.selection;
      const textBefore = editor.state.doc.textBetween(from - 1, from, "\n");

      // Close menu if slash character is removed or cursor moves away from slash
      // This ensures menu only stays open when user is actively typing after slash
      if (isOpen && textBefore !== "/") {
        setIsOpen(false);
      }
    };

    const handleBlur = () => {
      // Prevent menu from closing immediately after opening due to brief focus loss
      // This improves UX by avoiding menu flicker when it first appears
      const timeSinceOpened = menuOpenedAt ? Date.now() - menuOpenedAt : Infinity;

      if (timeSinceOpened < 100) {
        // Ignore blur events within 100ms of menu opening
        return;
      }

      // Close menu when editor loses focus after the grace period
      setIsOpen(false);
    };

    editor.on("selectionUpdate", handleSelectionUpdate);
    // Temporarily disable blur handler to test slash menu
    // editor.on("blur", handleBlur);

    return () => {
      editor.off("selectionUpdate", handleSelectionUpdate);
      // editor.off("blur", handleBlur);
    };
  }, [editor, isOpen, menuOpenedAt]);

  // Restore editor focus when menu closes
  useEffect(() => {
    if (!isOpen && savedCursorPosition !== null) {
      // Restore focus to editor after menu interaction completes
      // Cursor positioning is handled by other mechanisms in the editor
      if (editor && !editor.isDestroyed) {
        editor.commands.focus();
      }
      // Clear saved position after restoring
      setSavedCursorPosition(null);
    }
  }, [isOpen, savedCursorPosition, editor]);

  return {
    isOpen,
    setIsOpen,
    groupedItems,
    floatingStyles,
    refs,
    context,
    searchQuery,
    setSearchQuery,
    selectedPosition,
    setSelectedPosition,
    selectedIndex,
    setSelectedIndex,
    totalItems,
    menuPosition,
    isUsingKeyboard,
    setIsUsingKeyboard,
  };
};
