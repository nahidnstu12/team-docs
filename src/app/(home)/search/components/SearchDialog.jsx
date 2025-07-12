"use client";

import { useState, useEffect, useCallback, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, FileText, Folder, File } from "lucide-react";
import { searchAction } from "../actions/searchAction";
import { useProjectStore } from "@/app/(home)/projects/store/useProjectStore";
import { navigateToSearchResult } from "../utils/searchNavigation";
import { motion } from "framer-motion";

/**
 * SearchDialog Component - Global Search Interface
 *
 * This component provides a comprehensive search interface that allows users to search
 * across projects, sections, and pages within their workspace. It implements:
 *
 * FEATURES:
 * - Real-time search with 300ms debouncing for performance
 * - Full-text search across projects, sections, and pages
 * - Minimum 2-character requirement with user feedback
 * - Search result highlighting with matched text
 * - Intelligent navigation with Zustand store integration
 * - Responsive design with mobile-first approach
 * - Keyboard accessibility and shortcuts
 * - Loading states and error handling
 * - Framer Motion animations for smooth UX
 *
 * ARCHITECTURE:
 * - Uses React useTransition for non-blocking search operations
 * - Integrates with SearchService via server actions
 * - Manages local state for query, results, loading, and errors
 * - Utilizes Zustand store for project/section/page navigation state
 * - Implements proper cleanup and memory management
 *
 * SEARCH FLOW:
 * 1. User types in search input (debounced 300ms)
 * 2. Validates minimum 2 characters
 * 3. Calls searchAction server function
 * 4. SearchService performs PostgreSQL full-text search
 * 5. Results formatted and displayed with highlighting
 * 6. User clicks result → navigateToSearchResult handles routing + state
 *
 * @param {boolean} open - Controls dialog visibility
 * @param {function} onOpenChange - Callback for dialog state changes
 */
export default function SearchDialog({ open, onOpenChange }) {
  // ===== STATE MANAGEMENT =====
  const [query, setQuery] = useState(""); // Current search query
  const [results, setResults] = useState([]); // Search results array
  const [isSearching, startTransition] = useTransition(); // Non-blocking search state
  const [error, setError] = useState(null); // Error message state

  // ===== HOOKS & DEPENDENCIES =====
  const router = useRouter(); // Next.js navigation
  const { setSelectedSection, setSelectedPage } = useProjectStore(); // Zustand store for editor state

  // ===== SEARCH LOGIC =====
  /**
   * Perform search using server action with error handling
   *
   * IMPLEMENTATION DETAILS:
   * - Uses React useTransition for non-blocking UI updates
   * - Calls searchAction server function with query and options
   * - Handles both success and error states appropriately
   * - Limits results to 15 for optimal UI performance
   * - Clears previous results on new search or error
   *
   * FLOW:
   * 1. Wrap search in startTransition for concurrent features
   * 2. Call searchAction with query and limit options
   * 3. Process response and update local state
   * 4. Handle errors gracefully with user-friendly messages
   *
   * @param {string} searchQuery - The search term to query
   */
  const performSearch = useCallback(async (searchQuery) => {
    try {
      // Use React 18 concurrent features for non-blocking search
      const response = await new Promise((resolve) => {
        startTransition(async () => {
          // Call server action with search parameters
          const result = await searchAction(searchQuery, { limit: 15 });
          resolve(result);
        });
      });

      // Process successful response
      if (response.success) {
        setResults(response.data); // Update results state
        setError(null); // Clear any previous errors
      } else {
        // Handle server-side errors
        setError(response.error || "Search failed");
        setResults([]); // Clear results on error
      }
    } catch (err) {
      // Handle client-side errors (network, parsing, etc.)
      setError("Search failed. Please try again.");
      setResults([]);
    }
  }, []);

  // ===== DEBOUNCED SEARCH EFFECT =====
  /**
   * Debounced search effect with validation and cleanup
   *
   * DEBOUNCING STRATEGY:
   * - 300ms delay to prevent excessive API calls while typing
   * - Clears previous timeout on each keystroke
   * - Only triggers search after user stops typing
   *
   * VALIDATION LOGIC:
   * - Empty queries: Clear results and errors
   * - Short queries (<2 chars): Show helpful error message
   * - Valid queries: Trigger debounced search
   *
   * PERFORMANCE OPTIMIZATIONS:
   * - Cleanup timeout on component unmount
   * - Trim whitespace to avoid unnecessary searches
   * - Early returns to prevent unnecessary processing
   *
   * @dependency {string} query - Search input value
   * @dependency {function} performSearch - Memoized search function
   */
  useEffect(() => {
    // Handle empty query - reset state
    if (!query.trim()) {
      setResults([]);
      setError(null);
      return;
    }

    // Validate minimum character requirement
    if (query.trim().length < 2) {
      setResults([]);
      setError("Please enter at least 2 characters to search");
      return;
    }

    // Debounce search to prevent excessive API calls
    const timeoutId = setTimeout(() => {
      performSearch(query.trim());
    }, 300); // 300ms debounce delay

    // Cleanup function to prevent memory leaks
    return () => {
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
        <mark key={index} className="bg-yellow-200 dark:bg-yellow-800 rounded">
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
      <DialogContent className="sm:max-w-2xl max-h-[100vh] w-[95vw]">
        <DialogTitle className="text-xl font-semibold">Search</DialogTitle>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="relative">
              <Input
                placeholder="Search for projects, sections, pages..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="text-lg h-12 px-4"
                autoFocus
              />
            </div>
          </div>

          <div className="max-h-[500px] overflow-y-auto">
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
                    {error.includes("2 characters") ? "Minimum 2 characters required" : error}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {error.includes("2 characters")
                      ? "Type at least 2 characters to start searching"
                      : "Please try again or contact support"}
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
            {!isSearching && !error && results.length > 0 && (
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground px-2 py-1">
                  {results.length} results found
                </div>
                {results.map((result, index) => (
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
                ))}
              </div>
            )}

            {/* Initial state - show help text */}
            {!query.trim() && (
              <div className="flex items-center justify-center py-16">
                <div className="text-center max-w-sm">
                  <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 flex items-center justify-center mb-4">
                    <Search className="w-8 h-8 text-blue-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Start searching</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Type at least 2 characters to search for projects, sections, and pages
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
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
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
