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
          // Remove the slash character
          editor
            .chain()
            .deleteRange({ from: from - 1, to: from })
            .run();
          // Execute the command
          item.command();
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

  // Navigation helpers (defined after helper functions)
  const navigateDown = useCallback(() => {
    console.log("📍 Navigate down called, totalItems:", totalItems, "currentIndex:", selectedIndex);
    if (totalItems === 0) return;

    // Mark as keyboard navigation
    setIsUsingKeyboard(true);

    const newIndex = (selectedIndex + 1) % totalItems;
    const newPosition = getPositionFromIndex(newIndex);

    console.log("📍 Moving to index:", newIndex, "position:", newPosition);
    setSelectedIndex(newIndex);
    setSelectedPosition(newPosition);
  }, [totalItems, selectedIndex, getPositionFromIndex]);

  const navigateUp = useCallback(() => {
    console.log("📍 Navigate up called, totalItems:", totalItems, "currentIndex:", selectedIndex);
    if (totalItems === 0) return;

    // Mark as keyboard navigation
    setIsUsingKeyboard(true);

    const newIndex = selectedIndex === 0 ? totalItems - 1 : selectedIndex - 1;
    const newPosition = getPositionFromIndex(newIndex);

    console.log("📍 Moving to index:", newIndex, "position:", newPosition);
    setSelectedIndex(newIndex);
    setSelectedPosition(newPosition);
  }, [totalItems, selectedIndex, getPositionFromIndex]);

  // Focus restoration helper (defined first)
  const restoreEditorFocus = useCallback(() => {
    console.log("🔄 Restoring editor focus to position:", savedCursorPosition);

    // Multiple approaches to ensure focus is restored
    setTimeout(() => {
      // Approach 1: Use TipTap's focus command
      editor.commands.focus();

      // Approach 2: Focus the editor DOM element directly
      if (editor.view && editor.view.dom) {
        editor.view.dom.focus();
      }

      // Approach 3: Restore cursor position if saved
      if (savedCursorPosition !== null) {
        editor.commands.setTextSelection(savedCursorPosition);
      }

      console.log("✅ Editor focus restored, isFocused:", editor.isFocused);
    }, 10); // Small delay to ensure menu is closed first
  }, [editor, savedCursorPosition]);

  const executeSelectedCommand = useCallback(() => {
    const selectedItem = getSelectedItem();
    if (selectedItem) {
      console.log("✅ Executing command:", selectedItem.title);

      // For keyboard execution, call the original command directly (like mouse click)
      // First remove the slash character
      const { from } = editor.state.selection;
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

      setIsOpen(false);
    }
  }, [getSelectedItem, editor, onOpenChange, setInitialText, setInitialUrl, setDialogMode]);

  // Keyboard event handler using document events (TipTap editor.on doesn't work for this)
  useEffect(() => {
    if (!editor) return;

    const handleKeyDown = (e) => {
      console.log(
        "🔍 SlashMenu: Key pressed:",
        e.key,
        "isOpen:",
        isOpen,
        "editorFocused:",
        editor?.isFocused
      );

      // Handle slash key to open menu (only when editor is focused)
      if (e.key === "/" && editor?.isFocused) {
        // Defer to next tick to allow slash to appear in doc
        setTimeout(() => {
          const { from } = editor.state.selection;
          const textBefore = editor.state.doc.textBetween(from - 1, from, "\n");

          if (textBefore === "/") {
            // Get slash position for menu positioning
            const pos = editor.view.coordsAtPos(from - 1);

            // Save cursor position for focus restoration
            setSavedCursorPosition(from);

            // Set manual position for direct CSS positioning
            const menuX = pos.left;
            const menuY = pos.bottom + 8; // 8px below cursor
            setMenuPosition({ x: menuX, y: menuY });
            console.log("🎯 Menu opened at position:", { x: menuX, y: menuY });

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

      // Handle navigation when menu is open (don't check editor focus here)
      if (isOpen) {
        console.log("🎮 Menu navigation key:", e.key);
        if (e.key === "ArrowDown") {
          e.preventDefault();
          console.log("⬇️ Navigating down");
          navigateDown();
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          console.log("⬆️ Navigating up");
          navigateUp();
        } else if (e.key === "Enter") {
          e.preventDefault();
          console.log("✅ Executing command");
          executeSelectedCommand();
        } else if (e.key === "Escape") {
          e.preventDefault();
          console.log("🚪 Closing menu and returning focus to editor");
          setIsOpen(false);
          // Restore editor focus
          restoreEditorFocus();
        }
        return; // Don't process other keys when menu is open
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

      console.log("📍 Selection update:", {
        isOpen,
        from,
        textBefore,
        shouldClose: isOpen && textBefore !== "/",
      });

      // Close menu if slash is removed or cursor moves away
      if (isOpen && textBefore !== "/") {
        console.log("❌ Closing menu because textBefore is not '/'");
        setIsOpen(false);
      }
    };

    const handleBlur = () => {
      // Ignore blur events that happen immediately after opening the menu
      // This prevents the menu from closing when it appears and causes a brief focus loss
      const timeSinceOpened = menuOpenedAt ? Date.now() - menuOpenedAt : Infinity;

      console.log("👋 Editor blur - time since opened:", timeSinceOpened);

      if (timeSinceOpened < 100) {
        // Ignore blur within 100ms of opening
        console.log("🚫 Ignoring blur - menu just opened");
        return;
      }

      console.log("❌ Closing menu due to blur");
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

  // Restore focus whenever menu closes
  useEffect(() => {
    if (!isOpen && savedCursorPosition !== null) {
      console.log("🔄 Menu closed, restoring focus");
      restoreEditorFocus();
      // Clear saved position after restoring
      setSavedCursorPosition(null);
    }
  }, [isOpen, savedCursorPosition, restoreEditorFocus]);

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
