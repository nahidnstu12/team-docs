"use client";
import { useDismiss, useInteractions } from "@floating-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { useSlashCommand } from "../hooks/useSlashCommand";
import { useEffect, useRef } from "react";

export default function SlashCommandMenu({
  open,
  onOpenChange,
  editor,
  setInitialText,
  setInitialUrl,
  setDialogMode,
}) {
  const {
    isOpen,
    groupedItems,
    floatingStyles,
    refs,
    context,
    searchQuery,
    setSearchQuery,
    selectedPosition,
  } = useSlashCommand(editor, onOpenChange, open, setInitialText, setInitialUrl, setDialogMode);

  const dismiss = useDismiss(context);
  const { getFloatingProps } = useInteractions([dismiss]);

  const itemRefs = useRef([]);

  useEffect(() => {
    if (itemRefs.current[0]) {
      itemRefs.current[0].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [selectedPosition]);

  useEffect(() => {
    if (!isOpen) {
      itemRefs.current[0]?.blur(); // Remove any lingering focus state
    }
  }, [isOpen]);

  if (!editor) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={refs.setFloating}
          style={{ ...floatingStyles, minWidth: "360px", maxWidth: "420px" }}
          {...getFloatingProps()}
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="z-50 overflow-hidden bg-white border border-gray-200/80 shadow-2xl rounded-xl dark:bg-zinc-900 dark:border-zinc-700/80 backdrop-blur-sm"
        >
          <div className="p-4 border-b border-gray-100 dark:border-zinc-800">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg outline-none transition-colors focus:bg-white dark:focus:bg-zinc-900 focus:border-blue-500 dark:focus:border-blue-400 placeholder:text-gray-500 dark:placeholder:text-zinc-400"
              autoFocus
              placeholder="Type a command or search..."
            />
          </div>

          <div className="py-1 overflow-y-auto max-h-96">
            {groupedItems.length === 0 && (
              <div className="px-4 py-6 text-center">
                <div className="text-sm text-gray-500 dark:text-zinc-400">No matching commands</div>
                <div className="text-xs text-gray-400 dark:text-zinc-500 mt-1">
                  Try a different search term
                </div>
              </div>
            )}

            {groupedItems.map(([groupName, items], groupIndex) => (
              <div key={groupName} className="py-1">
                <div className="px-4 py-2 text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
                  {groupName}
                </div>
                {items.map((item, itemIndex) => {
                  const isSelected =
                    selectedPosition.groupIndex === groupIndex &&
                    selectedPosition.itemIndex === itemIndex;

                  return (
                    <button
                      key={item.title}
                      ref={(el) => {
                        if (isSelected) {
                          itemRefs.current[0] = el; // Always store selected item in index 0 for scrolling
                        }
                      }}
                      type="button"
                      onClick={item.command}
                      className={`flex w-full items-center justify-between px-4 py-3 text-left transition-all duration-150 hover:bg-gray-50 dark:hover:bg-zinc-800/50 group ${
                        isSelected
                          ? "bg-blue-50 dark:bg-blue-900/20 border-r-2 border-blue-500"
                          : ""
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div
                          className={`flex items-center justify-center w-8 h-8 rounded-lg transition-colors ${
                            isSelected
                              ? "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400"
                              : "bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 group-hover:bg-gray-200 dark:group-hover:bg-zinc-700"
                          }`}
                        >
                          {item.icon}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div
                            className={`text-sm font-medium truncate ${
                              isSelected
                                ? "text-blue-900 dark:text-blue-100"
                                : "text-gray-900 dark:text-zinc-100"
                            }`}
                          >
                            {item.title}
                          </div>
                          {item.subtitle && (
                            <div
                              className={`text-xs truncate ${
                                isSelected
                                  ? "text-blue-700 dark:text-blue-300"
                                  : "text-gray-500 dark:text-zinc-400"
                              }`}
                            >
                              {item.subtitle}
                            </div>
                          )}
                        </div>
                      </div>
                      {item.shortcut && (
                        <div
                          className={`text-xs font-mono px-2 py-1 rounded border transition-colors ${
                            isSelected
                              ? "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                              : "bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-zinc-400 border-gray-200 dark:border-zinc-700"
                          }`}
                        >
                          {item.shortcut}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
