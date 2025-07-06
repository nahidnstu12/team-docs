/**
 * Search navigation utilities
 * Handles navigation logic for search results with proper store updates
 */

/**
 * Navigate to search result with proper store state management
 * @param {Object} result - Search result object
 * @param {Object} router - Next.js router instance
 * @param {Object} projectStore - Project store methods
 */
export function navigateToSearchResult(result, router, projectStore) {
  const { route, metadata, type } = result;
  const { setSelectedSection, setSelectedPage } = projectStore;

  switch (type) {
    case 'project':
      // Navigate to projects page - no store updates needed
      router.push('/projects');
      break;
      
    case 'section':
      // Navigate to project editor and select section
      setSelectedSection(metadata.sectionId);
      setSelectedPage(null); // Clear page selection
      router.push(route);
      break;
      
    case 'page':
      // Navigate to project editor and select section + page
      setSelectedSection(metadata.sectionId);
      setSelectedPage(metadata.pageId);
      router.push(route);
      break;
      
    default:
      // Fallback to direct navigation
      router.push(route);
  }
}

/**
 * Get navigation preview text for search result
 * @param {Object} result - Search result object
 * @returns {string} Preview text showing where navigation will go
 */
export function getNavigationPreview(result) {
  const { type, metadata } = result;

  switch (type) {
    case 'project':
      return 'Go to Projects page';
      
    case 'section':
      return `Open ${metadata.projectName} → ${metadata.sectionName}`;
      
    case 'page':
      return `Open ${metadata.projectName} → ${metadata.sectionName} → ${metadata.pageTitle}`;
      
    default:
      return 'Navigate to result';
  }
}

/**
 * Check if search result navigation requires editor context
 * @param {Object} result - Search result object
 * @returns {boolean} True if navigation goes to editor
 */
export function requiresEditorContext(result) {
  return result.type === 'section' || result.type === 'page';
}

/**
 * Get breadcrumb path for search result
 * @param {Object} result - Search result object
 * @returns {Array} Array of breadcrumb items
 */
export function getResultBreadcrumb(result) {
  const { type, metadata } = result;
  const breadcrumb = [];

  // Always start with project if available
  if (metadata.projectName) {
    breadcrumb.push({
      label: metadata.projectName,
      type: 'project'
    });
  }

  // Add section if available and not the main item
  if (metadata.sectionName && type !== 'section') {
    breadcrumb.push({
      label: metadata.sectionName,
      type: 'section'
    });
  }

  // Add page if it's the main item
  if (type === 'page' && metadata.pageTitle) {
    breadcrumb.push({
      label: metadata.pageTitle,
      type: 'page'
    });
  }

  return breadcrumb;
}
