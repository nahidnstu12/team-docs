"use client";

import { useState, useEffect, useCallback, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, FileText, Folder, File } from "lucide-react";
import { searchAction } from "../actions/searchAction";
import { useProjectStore } from "@/app/(home)/projects/store/useProjectStore";
import { navigateToSearchResult } from "../utils/searchNavigation";
import { motion } from "framer-motion";

/**
 * SearchDialog component provides global search functionality
 * Uses Shadcn Command component for search UI with real-time results
 */
export default function SearchDialog({ open, onOpenChange }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isSearching, startTransition] = useTransition();
  const [error, setError] = useState(null);

  console.log(
    `[DEBUG] SearchDialog component render - open: ${open}, query: "${query}", results.length: ${results.length}`
  );

  const router = useRouter();
  const { setSelectedSection, setSelectedPage } = useProjectStore();

  /**
   * Perform search using server action
   */
  const performSearch = useCallback(async (searchQuery) => {
    console.log(`[DEBUG] SearchDialog - Starting search for: "${searchQuery}"`);

    startTransition(async () => {
      try {
        const response = await searchAction(searchQuery, { limit: 15 });
        console.log(`[DEBUG] SearchDialog - Search response:`, response);

        if (response.success) {
          console.log(
            `[DEBUG] SearchDialog - Setting ${response.data.length} results:`,
            response.data
          );
          setResults(response.data);
          setError(null);
        } else {
          console.log(`[DEBUG] SearchDialog - Search failed:`, response.error);
          setError(response.error || "Search failed");
          setResults([]);
        }
      } catch (err) {
        console.log(`[DEBUG] SearchDialog - Search error:`, err);
        setError("Search failed. Please try again.");
        setResults([]);
      }
    });
  }, []);

  // Debounced search effect
  useEffect(() => {
    console.log(`[DEBUG] SearchDialog useEffect - query: "${query}", length: ${query.length}`);

    if (!query.trim() || query.trim().length < 2) {
      console.log(`[DEBUG] SearchDialog useEffect - Query too short, clearing results`);
      setResults([]);
      setError(null);
      return;
    }

    console.log(`[DEBUG] SearchDialog useEffect - Setting timeout for search: "${query.trim()}"`);
    const timeoutId = setTimeout(() => {
      console.log(`[DEBUG] SearchDialog useEffect - Timeout triggered, calling performSearch`);
      performSearch(query.trim());
    }, 300); // 300ms debounce

    return () => {
      console.log(`[DEBUG] SearchDialog useEffect - Clearing timeout`);
      clearTimeout(timeoutId);
    };
  }, [query, performSearch]);

  /**
   * Handle search result selection
   */
  const handleSelect = useCallback(
    (result) => {
      // Use navigation utility for consistent navigation logic
      navigateToSearchResult(result, router, { setSelectedSection, setSelectedPage });

      // Close dialog after navigation
      onOpenChange(false);
      setQuery("");
      setResults([]);
    },
    [router, setSelectedSection, setSelectedPage, onOpenChange]
  );

  /**
   * Get icon for result type
   */
  const getResultIcon = (type) => {
    switch (type) {
      case "project":
        return <Folder className="w-4 h-4 text-blue-500" />;
      case "section":
        return <FileText className="w-4 h-4 text-green-500" />;
      case "page":
        return <File className="w-4 h-4 text-purple-500" />;
      default:
        return <Search className="w-4 h-4 text-gray-500" />;
    }
  };

  /**
   * Highlight search term in text
   */
  const highlightText = (text, searchTerm) => {
    if (!text || !searchTerm) return text;

    const regex = new RegExp(`(${searchTerm})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  /**
   * Reset dialog state when closed
   */
  useEffect(() => {
    if (!open) {
      setQuery("");
      setResults([]);
      setError(null);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <div className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Search</h2>
            <Input
              placeholder="Search within projects, sections, pages..."
              value={query}
              onChange={(e) => {
                console.log(`[DEBUG] SearchDialog Input onChange - new value: "${e.target.value}"`);
                setQuery(e.target.value);
              }}
              onFocus={() => console.log(`[DEBUG] SearchDialog Input onFocus`)}
              onBlur={() => console.log(`[DEBUG] SearchDialog Input onBlur`)}
              onKeyDown={(e) => console.log(`[DEBUG] SearchDialog Input onKeyDown - key: ${e.key}`)}
              className="text-base"
              autoFocus
            />
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            {/* Loading state */}
            {isSearching && (
              <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center space-y-3">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                  <span className="text-sm text-muted-foreground font-medium">
                    Searching across projects, sections, and pages...
                  </span>
                </div>
              </div>
            )}

            {/* Error state */}
            {error && !isSearching && (
              <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center space-y-2 text-center">
                  <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                    <Search className="w-6 h-6 text-red-500" />
                  </div>
                  <span className="text-sm text-red-600 dark:text-red-400 font-medium">
                    {error}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Please try again or contact support
                  </span>
                </div>
              </div>
            )}

            {/* Empty state */}
            {!isSearching && !error && query.trim().length >= 2 && results.length === 0 && (
              <div className="text-center py-16 px-6">
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 flex items-center justify-center mb-6">
                  <Search className="w-10 h-10 text-orange-500" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No results found for "{query}"
                </h3>
                <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
                  We couldn't find any projects, sections, or pages matching your search.
                </p>

                <div className="space-y-4">
                  <div className="text-left max-w-md mx-auto">
                    <h4 className="text-sm font-medium text-foreground mb-2">
                      Try these suggestions:
                    </h4>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• Check your spelling and try again</li>
                      <li>• Use different or more general keywords</li>
                      <li>• Search for partial words (e.g., "admin" for "Admin Project")</li>
                      <li>• Try searching for section or page names</li>
                    </ul>
                  </div>

                  <div className="flex flex-wrap justify-center gap-2 pt-2">
                    <span className="text-xs px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full">
                      Projects
                    </span>
                    <span className="text-xs px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-full">
                      Sections
                    </span>
                    <span className="text-xs px-3 py-1 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-full">
                      Pages
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Search results */}
            {(() => {
              const shouldShowResults = !isSearching && !error && results.length > 0;
              console.log(
                `[DEBUG] SearchDialog render - isSearching: ${isSearching}, error: ${error}, results.length: ${results.length}, shouldShowResults: ${shouldShowResults}`
              );
              console.log(`[DEBUG] SearchDialog render - results:`, results);
              return shouldShowResults;
            })() && (
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground px-2 py-1">
                  {results.length} results found
                </div>
                {results.map((result, index) => {
                  console.log(`[DEBUG] SearchDialog render - mapping result ${index}:`, result);
                  return (
                    <motion.div
                      key={result.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleSelect(result)}
                      className="flex items-start gap-3 p-4 cursor-pointer hover:bg-accent/70 transition-all duration-200 rounded-lg mx-2 my-1 border border-transparent hover:border-accent hover:shadow-sm"
                    >
                      <div className="flex-shrink-0 mt-1">{getResultIcon(result.type)}</div>

                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="secondary"
                            className="text-xs px-2 py-1 font-medium rounded-full"
                          >
                            {result.displayType}
                          </Badge>
                        </div>

                        <div className="font-semibold text-sm leading-tight">
                          {highlightText(result.displayTitle, query)}
                        </div>

                        {result.displaySubtitle && (
                          <div className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                            {highlightText(result.displaySubtitle, query)}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* Initial state - show help text */}
            {!query.trim() && (
              <div className="flex items-center justify-center py-16">
                <div className="text-center max-w-sm">
                  <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 flex items-center justify-center mb-6">
                    <Search className="w-10 h-10 text-blue-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Search Everything</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Find projects, sections, and pages instantly. Start typing to see results.
                  </p>
                  <div className="flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
                    <span className="px-2 py-1 bg-muted rounded-full">Projects</span>
                    <span className="px-2 py-1 bg-muted rounded-full">Sections</span>
                    <span className="px-2 py-1 bg-muted rounded-full">Pages</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
