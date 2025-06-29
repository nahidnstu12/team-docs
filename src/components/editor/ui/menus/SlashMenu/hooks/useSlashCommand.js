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

  // Floating UI setup
  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [
      offset(slashConfig.offset),
      flip(),
      shift(),
      size({
        apply({ availableHeight, elements }) {
          Object.assign(elements.floating.style, {
            maxHeight: `${Math.min(availableHeight - 20, 400)}px`,
          });
        },
      }),
    ],
    whileElementsMounted: autoUpdate,
    placement: slashConfig.placement,
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
          setIsOpen(false);
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
    if (totalItems === 0) return;

    const newIndex = (selectedIndex + 1) % totalItems;
    const newPosition = getPositionFromIndex(newIndex);

    setSelectedIndex(newIndex);
    setSelectedPosition(newPosition);
  }, [totalItems, selectedIndex, getPositionFromIndex]);

  const navigateUp = useCallback(() => {
    if (totalItems === 0) return;

    const newIndex = selectedIndex === 0 ? totalItems - 1 : selectedIndex - 1;
    const newPosition = getPositionFromIndex(newIndex);

    setSelectedIndex(newIndex);
    setSelectedPosition(newPosition);
  }, [totalItems, selectedIndex, getPositionFromIndex]);

  const executeSelectedCommand = useCallback(() => {
    const selectedItem = getSelectedItem();
    if (selectedItem) {
      selectedItem.command();
    }
  }, [getSelectedItem]);

  // Keyboard event handler using document events (TipTap editor.on doesn't work for this)
  useEffect(() => {
    if (!editor) return;

    const handleKeyDown = (e) => {
      // Only handle if editor is focused
      if (!editor.isFocused) return;

      // Handle slash key to open menu
      if (e.key === "/") {
        // Defer to next tick to allow slash to appear in doc
        setTimeout(() => {
          const { from } = editor.state.selection;
          const textBefore = editor.state.doc.textBetween(from - 1, from, "\n");

          if (textBefore === "/") {
            // Get slash position for menu positioning
            const pos = editor.view.coordsAtPos(from - 1);

            const virtualElement = {
              getBoundingClientRect: () => ({
                width: 0,
                height: 0,
                x: pos.right,
                y: pos.bottom,
                top: pos.bottom,
                right: pos.right,
                bottom: pos.bottom,
                left: pos.right,
              }),
            };

            refs.setReference(virtualElement);

            setIsOpen(true);
            setSearchQuery("");
            setSelectedPosition({ groupIndex: 0, itemIndex: 0 });
            setSelectedIndex(0);
          }
        }, 0);
      }

      // Handle navigation when menu is open
      if (isOpen) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          navigateDown();
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          navigateUp();
        } else if (e.key === "Enter") {
          e.preventDefault();
          executeSelectedCommand();
        } else if (e.key === "Escape") {
          e.preventDefault();
          setIsOpen(false);
        }
      }
    };

    // Use document events instead of editor events
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [editor, isOpen, navigateDown, navigateUp, executeSelectedCommand, refs]);

  // Close menu when editor loses focus or selection changes significantly
  useEffect(() => {
    if (!editor) return;

    const handleSelectionUpdate = () => {
      const { from } = editor.state.selection;
      const textBefore = editor.state.doc.textBetween(from - 1, from, "\n");

      // Close menu if slash is removed or cursor moves away
      if (isOpen && textBefore !== "/") {
        setIsOpen(false);
      }
    };

    const handleBlur = () => {
      setIsOpen(false);
    };

    editor.on("selectionUpdate", handleSelectionUpdate);
    editor.on("blur", handleBlur);

    return () => {
      editor.off("selectionUpdate", handleSelectionUpdate);
      editor.off("blur", handleBlur);
    };
  }, [editor, isOpen]);

  return {
    isOpen,
    groupedItems,
    floatingStyles,
    refs,
    context,
    searchQuery,
    setSearchQuery,
    selectedPosition,
    selectedIndex,
    totalItems,
  };
};
