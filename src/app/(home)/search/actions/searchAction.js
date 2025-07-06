"use server";

import { Session } from "@/lib/Session";
import { SearchService } from "@/system/Services/SearchService";
import Logger from "@/lib/Logger";

/**
 * Server action for performing real-time search across projects, sections, and pages
 * @param {string} query - Search query string
 * @param {Object} options - Search options
 * @param {number} options.limit - Maximum number of results (default: 20)
 * @returns {Promise<{success: boolean, data: Array, error?: string}>}
 */
export async function searchAction(query, options = {}) {
  try {
    // Validate input
    if (!query || typeof query !== "string") {
      return {
        success: true,
        data: [],
        message: "Empty query",
      };
    }

    const trimmedQuery = query.trim();

    // Return empty results for very short queries
    if (trimmedQuery.length < 2) {
      return {
        success: true,
        data: [],
        message: "Query too short",
      };
    }

    // Get current workspace ID
    const workspaceId = await Session.getWorkspaceIdForUser();

    if (!workspaceId) {
      return {
        success: false,
        data: [],
        error: "No workspace found",
      };
    }

    // Perform search
    const { limit = 20 } = options;
    const searchResults = await SearchService.searchAll(trimmedQuery, workspaceId, limit);

    // Format results for UI consumption
    const formattedResults = searchResults.map((result) => ({
      id: result.id,
      type: result.type,
      title: result.title,
      description: result.description,
      matchedText: result.matchedText,
      route: result.route,
      metadata: result.metadata,
      // Add display information for UI
      displayType: getDisplayType(result.type),
      displayTitle: getDisplayTitle(result),
      displaySubtitle: getDisplaySubtitle(result),
    }));

    return {
      success: true,
      data: formattedResults,
      message: `Found ${formattedResults.length} results`,
    };
  } catch (error) {
    return {
      success: false,
      data: [],
      error: "Search failed. Please try again.",
    };
  }
}

/**
 * Get display type for search result
 * @param {string} type - Result type (project, section, page)
 * @returns {string} Display-friendly type
 */
function getDisplayType(type) {
  const typeMap = {
    project: "Project",
    section: "Section",
    page: "Page",
  };
  return typeMap[type] || type;
}

/**
 * Get display title for search result
 * @param {Object} result - Search result object
 * @returns {string} Display title
 */
function getDisplayTitle(result) {
  switch (result.type) {
    case "project":
      return result.title;
    case "section":
      return `${result.metadata.projectName} › ${result.title}`;
    case "page":
      return `${result.metadata.projectName} › ${result.metadata.sectionName} › ${result.title}`;
    default:
      return result.title;
  }
}

/**
 * Get display subtitle for search result
 * @param {Object} result - Search result object
 * @returns {string} Display subtitle
 */
function getDisplaySubtitle(result) {
  // Use matched text as subtitle, or description, or empty string
  return result.matchedText || result.description || "";
}

/**
 * Debounced search action for real-time search
 * This is a wrapper that can be used with debouncing on the client side
 * @param {string} query - Search query
 * @param {Object} options - Search options
 * @returns {Promise} Search results
 */
export async function debouncedSearchAction(query, options = {}) {
  // Add a small delay to prevent too many rapid requests
  await new Promise((resolve) => setTimeout(resolve, 100));
  return searchAction(query, options);
}

/**
 * Get search suggestions based on recent searches or popular content
 * This can be enhanced later with user search history
 * @returns {Promise<Array>} Array of search suggestions
 */
export async function getSearchSuggestions() {
  try {
    const workspaceId = await Session.getWorkspaceIdForUser();

    if (!workspaceId) {
      return {
        success: false,
        data: [],
        error: "No workspace found",
      };
    }

    // For now, return empty suggestions
    // This can be enhanced later with:
    // - Recent searches
    // - Popular content
    // - Recently modified pages
    return {
      success: true,
      data: [],
      message: "No suggestions available",
    };
  } catch (error) {
    return {
      success: false,
      data: [],
      error: "Failed to get suggestions",
    };
  }
}
