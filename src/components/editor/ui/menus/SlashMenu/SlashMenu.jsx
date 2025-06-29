"use client";

import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDismiss, useInteractions } from "@floating-ui/react";
import { useSlashCommand } from "./hooks/useSlashCommand";

/**
 * Slash Command Menu Component
 * Notion-like command palette triggered by typing '/'
 *
 * @fileoverview This component provides a command palette interface
 * that appears when users type '/' in the editor, offering quick access
 * to various formatting and content insertion options.
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
  open,
  onOpenChange,
  setInitialText,
  setInitialUrl,
  setDialogMode,
  config = {},
  className = "",
}) => {
  // Use the slash command hook for menu logic
  const {
    isOpen,
    groupedItems,
    floatingStyles,
    refs,
    context,
    searchQuery,
    setSearchQuery,
    selectedPosition,
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

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={refs.setFloating}
          style={{
            ...floatingStyles,
            minWidth: "360px",
            maxWidth: "420px",
            zIndex: 50,
          }}
          {...getFloatingProps()}
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
                          className={`
                            w-full flex items-center gap-3 px-3 py-2.5 text-left rounded-lg transition-all duration-150
                            hover:bg-blue-50 hover:border-blue-200 dark:hover:bg-zinc-800
                            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
                            ${
                              isSelected
                                ? "bg-blue-50 border border-blue-200 dark:bg-zinc-800 dark:border-zinc-600"
                                : "border border-transparent"
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
};

// Memoize the component to prevent unnecessary re-renders
export const SlashMenu = React.memo(SlashMenuComponent);

export default SlashMenu;
