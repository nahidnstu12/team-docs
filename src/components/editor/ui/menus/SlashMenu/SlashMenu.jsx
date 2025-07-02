"use client";

import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useDismiss, useInteractions } from "@floating-ui/react";
import { useSlashCommand } from "./hooks/useSlashCommand";

/**
 * ⚡ SlashMenu - The Command Palette (Notion-Style)
 *
 * This is the magic menu that appears when you type "/" in the editor!
 * It's like having a command center at your fingertips.
 *
 * 🎯 What this component does:
 * - Detects when user types "/" in the editor
 * - Shows a searchable list of commands (headings, lists, code blocks, etc.)
 * - Provides keyboard navigation (up/down arrows, Enter to select)
 * - Filters commands as user types (e.g., "/head" shows heading options)
 * - Inserts the selected content type at the cursor position
 * - Handles smooth animations and positioning
 *
 * 💡 Available commands include:
 * - Text blocks: Paragraph, headings (H1-H6)
 * - Lists: Bullet lists, numbered lists, task lists
 * - Special blocks: Code blocks, toggles, quotes
 * - Advanced: Tables, dividers, etc.
 *
 * 🔧 How it works:
 * 1. User types "/" - menu appears at cursor position
 * 2. User can type to filter commands (e.g., "head" for headings)
 * 3. User navigates with arrow keys or mouse hover
 * 4. User presses Enter or clicks to select command
 * 5. Selected command executes and menu disappears
 * 6. ESC key cancels and returns focus to editor
 *
 * 🎨 Advanced features:
 * - Smart positioning (avoids screen edges)
 * - Smooth Framer Motion animations
 * - Keyboard shortcuts displayed in menu
 * - Search highlighting
 * - Portal rendering for proper z-index layering
 */

/**
 * SlashMenu Component
 *
 * @param {Object} props - Component props
 * @param {Object} props.editor - TipTap editor instance
 * @param {string} props.instanceId - Editor instance identifier
 * @param {boolean} props.open - External dialog open state (for coordination)
 * @param {Function} props.onOpenChange - External dialog state change handler
 * @param {Function} props.setInitialText - Set initial text for link dialog
 * @param {Function} props.setInitialUrl - Set initial URL for link dialog
 * @param {Function} props.setDialogMode - Set dialog mode (create/edit)
 * @param {Object} props.config - Slash menu configuration overrides
 * @param {string} props.className - Additional CSS classes
 */
const SlashMenuComponent = ({
  editor,
  instanceId,
  open = false,
  onOpenChange = () => {},
  setInitialText = () => {},
  setInitialUrl = () => {},
  setDialogMode = () => {},
  config = {},
  className = "",
}) => {
  // Use the slash command hook for menu logic
  const {
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
    menuPosition,
    isUsingKeyboard,
    setIsUsingKeyboard,
  } = useSlashCommand(
    editor,
    onOpenChange,
    open,
    setInitialText,
    setInitialUrl,
    setDialogMode,
    config
  );

  // Set up dismiss behavior
  const dismiss = useDismiss(context);

  // Helper function to calculate global index from group and item indices
  const calculateGlobalIndex = (groupIndex, itemIndex) => {
    return (
      groupedItems.slice(0, groupIndex).reduce((acc, g) => acc + g.items.length, 0) + itemIndex
    );
  };
  const { getFloatingProps } = useInteractions([dismiss]);

  // Refs for item navigation
  const itemRefs = useRef([]);

  // Scroll selected item into view
  useEffect(() => {
    if (itemRefs.current[0]) {
      itemRefs.current[0].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [selectedPosition]);

  // Clear focus when menu closes
  useEffect(() => {
    if (!isOpen) {
      itemRefs.current[0]?.blur();
    }
  }, [isOpen]);

  // Don't render if editor is not available
  if (!editor) return null;

  // Render the menu in a portal to avoid CSS conflicts
  const menuContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          style={{
            // Pure manual positioning - no Floating UI interference
            position: "absolute",
            left: `${menuPosition.x}px`,
            top: `${menuPosition.y}px`,
            minWidth: "360px",
            maxWidth: "420px",
            zIndex: 50,
          }}
          // Make the menu focusable and auto-focus when it opens
          tabIndex={-1}
          autoFocus
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className={`
            slash-menu
            overflow-hidden bg-white border border-gray-200/80 shadow-2xl rounded-xl 
            dark:bg-zinc-900 dark:border-zinc-700/80 backdrop-blur-sm
            ${className}
          `}
        >
          {/* Search input */}
          <div className="p-4 border-b border-gray-100 dark:border-zinc-800">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search commands..."
              className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-zinc-800 dark:border-zinc-700 dark:text-white dark:placeholder-gray-400"
              autoFocus
            />
          </div>

          {/* Command groups */}
          <div className="max-h-80 overflow-y-auto">
            {groupedItems.length === 0 ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                <p className="text-sm">No commands found</p>
                <p className="text-xs mt-1">Try a different search term</p>
              </div>
            ) : (
              groupedItems.map((group, groupIndex) => (
                <div key={group.group} className="py-2">
                  {/* Group header */}
                  <div className="px-4 py-2">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">
                      {group.group}
                    </h3>
                  </div>

                  {/* Group items */}
                  <div className="space-y-1 px-2">
                    {group.items.map((item, itemIndex) => {
                      const isSelected =
                        selectedPosition.groupIndex === groupIndex &&
                        selectedPosition.itemIndex === itemIndex;

                      return (
                        <button
                          key={`${item.title}-${itemIndex}`}
                          ref={(el) => {
                            if (isSelected) {
                              itemRefs.current[0] = el;
                            }
                          }}
                          onClick={item.command}
                          onMouseEnter={() => {
                            // Switch to mouse mode and sync selection
                            setIsUsingKeyboard(false);
                            const globalIndex = calculateGlobalIndex(groupIndex, itemIndex);
                            setSelectedPosition({ groupIndex, itemIndex });
                            setSelectedIndex(globalIndex);
                          }}
                          className={`
                            w-full flex items-center gap-3 px-3 py-2.5 text-left rounded-lg transition-all duration-150
                            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
                            ${
                              isSelected
                                ? "bg-blue-50 border border-blue-200 dark:bg-zinc-800 dark:border-zinc-600"
                                : `border border-transparent ${
                                    !isUsingKeyboard
                                      ? "hover:bg-blue-50 hover:border-blue-200 dark:hover:bg-zinc-800"
                                      : ""
                                  }`
                            }
                          `}
                        >
                          {/* Icon */}
                          <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-md bg-gray-100 dark:bg-zinc-700">
                            {item.icon}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {item.title}
                              </p>
                              {item.shortcut && (
                                <span className="ml-2 text-xs text-gray-500 dark:text-gray-400 font-mono bg-gray-100 dark:bg-zinc-700 px-1.5 py-0.5 rounded">
                                  {item.shortcut}
                                </span>
                              )}
                            </div>
                            {item.subtitle && (
                              <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                                {item.subtitle}
                              </p>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer with tips */}
          <div className="px-4 py-3 border-t border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/50">
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>Use ↑↓ to navigate</span>
              <span>Press Enter to select</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Render in portal to avoid CSS positioning conflicts
  return typeof document !== "undefined" ? createPortal(menuContent, document.body) : null;
};

// Memoize the component to prevent unnecessary re-renders
export const SlashMenu = React.memo(SlashMenuComponent);

export default SlashMenu;
