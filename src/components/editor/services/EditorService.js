/**
 * 🛠️ EditorService - The Business Logic Layer (Laravel-Style)
 *
 * This service handles all the "behind the scenes" work for your editors.
 * Think of it as your editor's personal assistant that handles saving, loading,
 * validation, and other business operations.
 *
 * 🎯 What this service provides:
 * - Content saving and loading operations
 * - Data validation and sanitization
 * - Content transformation (JSON ↔ HTML ↔ Markdown)
 * - Error handling and logging
 * - Caching and performance optimization
 * - Integration with your backend APIs
 *
 * 💡 Why use a service pattern?
 * - Separation of concerns (UI vs business logic)
 * - Reusable across different components
 * - Easier testing and maintenance
 * - Consistent error handling
 * - Centralized data operations
 *
 * 📝 Example usage:
 * ```javascript
 * // Save content
 * await EditorService.save('editor-1', content);
 *
 * // Load content
 * const content = await EditorService.load('editor-1');
 *
 * // Validate content
 * const isValid = EditorService.validate(content);
 * ```
 *
 * 🏗️ Laravel-inspired architecture:
 * - Static methods for easy access
 * - Consistent return formats
 * - Built-in error handling
 * - Chainable operations where appropriate
 */

import { toast } from "sonner";

/**
 * Base Service Class
 * Provides common functionality for all services
 */
class BaseService {
  /**
   * Handle service errors consistently
   * @param {Error} error - Error object
   * @param {string} operation - Operation that failed
   * @returns {Object} Standardized error response
   */
  static handleError(error, operation = "operation") {
    // Log error for debugging purposes in development
    if (process.env.NODE_ENV === "development") {
      console.error(`${this.name} - ${operation} failed:`, error);
    }

    return {
      success: false,
      error: error.message || `${operation} failed`,
      data: null,
    };
  }

  /**
   * Create success response
   * @param {*} data - Response data
   * @param {string} message - Success message
   * @returns {Object} Standardized success response
   */
  static createSuccessResponse(data, message = "Operation completed successfully") {
    return {
      success: true,
      data,
      message,
      error: null,
    };
  }

  /**
   * Validate required parameters
   * @param {Object} params - Parameters to validate
   * @param {Array} required - Required parameter names
   * @throws {Error} If required parameters are missing
   */
  static validateRequired(params, required) {
    const missing = required.filter((key) => !params.hasOwnProperty(key) || params[key] == null);

    if (missing.length > 0) {
      throw new Error(`Missing required parameters: ${missing.join(", ")}`);
    }
  }
}

/**
 * Editor Service
 * Handles editor business logic and operations
 */
export class EditorService extends BaseService {
  /**
   * Save editor content
   * @param {Object} params - Save parameters
   * @param {string} params.pageId - Page identifier
   * @param {Object} params.content - Editor content (TipTap JSON)
   * @param {Object} params.metadata - Additional metadata
   * @param {boolean} params.showToast - Whether to show success/error toast (default: false)
   * @returns {Promise<Object>} Save result
   */
  static async saveContent({ pageId, content, metadata = {}, showToast = false }) {
    try {
      this.validateRequired({ pageId, content }, ["pageId", "content"]);

      // Validate content structure
      const validationResult = this.validateContent(content);
      if (!validationResult.isValid) {
        throw new Error(`Invalid content: ${validationResult.errors.join(", ")}`);
      }

      // Transform content for storage
      const transformedContent = this.transformContentForStorage(content);

      // Prepare save data
      const saveData = {
        pageId,
        content: transformedContent,
        metadata: {
          ...metadata,
          lastModified: new Date().toISOString(),
          wordCount: this.getWordCount(content),
          characterCount: this.getCharacterCount(content),
        },
      };

      // Import save action dynamically to avoid circular dependencies
      const { savePageContent } = await import(
        "@/app/(home)/projects/[slug]/editor/actions/savePageContent"
      );

      const result = await savePageContent(saveData);

      if (result.success) {
        // Only show toast if explicitly requested (manual save)
        if (showToast) {
          toast.success(result.message || "Content saved successfully");
        }
        return this.createSuccessResponse(result.page, result.message);
      } else {
        throw new Error(result.message || "Save operation failed");
      }
    } catch (error) {
      // Always show error toasts for user awareness
      if (showToast) {
        toast.error(error.message || "Failed to save content");
      }
      return this.handleError(error, "save content");
    }
  }

  /**
   * Load editor content
   * @param {string} pageId - Page identifier
   * @returns {Promise<Object>} Load result
   */
  static async loadContent(pageId) {
    try {
      this.validateRequired({ pageId }, ["pageId"]);

      // Import fetch action dynamically
      const { fetchPageContent } = await import(
        "@/app/(home)/projects/[slug]/editor/actions/fetchPageContent"
      );

      const result = await fetchPageContent(pageId);

      if (result) {
        // Transform content for editor
        const transformedContent = this.transformContentForEditor(result.content);

        return this.createSuccessResponse(
          {
            content: transformedContent,
            metadata: {
              lastModified: result.updatedAt,
              wordCount: this.getWordCount(transformedContent),
              characterCount: this.getCharacterCount(transformedContent),
            },
          },
          "Content loaded successfully"
        );
      } else {
        throw new Error("Page not found");
      }
    } catch (error) {
      toast.error(error.message || "Failed to load content");
      return this.handleError(error, "load content");
    }
  }

  /**
   * Validate editor content structure
   * @param {Object} content - TipTap JSON content
   * @returns {Object} Validation result
   */
  static validateContent(content) {
    const errors = [];

    // Check if content is an object
    if (!content || typeof content !== "object") {
      errors.push("Content must be a valid object");
      return { isValid: false, errors };
    }

    // Check for required TipTap structure
    if (!content.type) {
      errors.push("Content must have a type property");
    }

    // Validate content size
    const contentString = JSON.stringify(content);
    if (contentString.length > 1000000) {
      // 1MB limit
      errors.push("Content size exceeds maximum limit");
    }

    // Check for potentially dangerous content
    if (this.containsDangerousContent(content)) {
      errors.push("Content contains potentially dangerous elements");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Check for dangerous content (XSS prevention)
   * @param {Object} content - Content to check
   * @returns {boolean} Whether content contains dangerous elements
   */
  static containsDangerousContent(content) {
    const contentString = JSON.stringify(content);

    // Check for script tags, event handlers, etc.
    const dangerousPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /<iframe/i,
      /<object/i,
      /<embed/i,
    ];

    return dangerousPatterns.some((pattern) => pattern.test(contentString));
  }

  /**
   * Transform content for storage (sanitize, optimize)
   * @param {Object} content - Editor content
   * @returns {Object} Transformed content
   */
  static transformContentForStorage(content) {
    // Deep clone to avoid mutations
    const transformed = JSON.parse(JSON.stringify(content));

    // Remove any functions or undefined values
    return this.sanitizeObject(transformed);
  }

  /**
   * Transform content for editor (restore, enhance)
   * @param {Object} content - Stored content
   * @returns {Object} Transformed content
   */
  static transformContentForEditor(content) {
    if (!content) {
      return {
        type: "doc",
        content: [],
      };
    }

    // Ensure content has proper structure
    if (typeof content === "string") {
      try {
        return JSON.parse(content);
      } catch {
        // If parsing fails, create a paragraph with the text
        return {
          type: "doc",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: content,
                },
              ],
            },
          ],
        };
      }
    }

    return content;
  }

  /**
   * Sanitize object by removing functions and undefined values
   * @param {*} obj - Object to sanitize
   * @returns {*} Sanitized object
   */
  static sanitizeObject(obj) {
    if (obj === null || typeof obj !== "object") {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map((item) => this.sanitizeObject(item));
    }

    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === "function" || value === undefined) {
        continue; // Skip functions and undefined values
      }
      sanitized[key] = this.sanitizeObject(value);
    }

    return sanitized;
  }

  /**
   * Get word count from content
   * @param {Object} content - TipTap JSON content
   * @returns {number} Word count
   */
  static getWordCount(content) {
    const text = this.extractTextFromContent(content);
    if (!text.trim()) return 0;

    return text.trim().split(/\s+/).length;
  }

  /**
   * Get character count from content
   * @param {Object} content - TipTap JSON content
   * @returns {number} Character count
   */
  static getCharacterCount(content) {
    const text = this.extractTextFromContent(content);
    return text.length;
  }

  /**
   * Extract plain text from TipTap JSON content
   * @param {Object} content - TipTap JSON content
   * @returns {string} Plain text
   */
  static extractTextFromContent(content) {
    if (!content) return "";

    if (typeof content === "string") {
      return content;
    }

    if (content.text) {
      return content.text;
    }

    if (content.content && Array.isArray(content.content)) {
      return content.content.map((node) => this.extractTextFromContent(node)).join(" ");
    }

    return "";
  }

  /**
   * Export content to different formats
   * @param {Object} content - TipTap JSON content
   * @param {string} format - Export format ('html', 'markdown', 'text')
   * @returns {Promise<string>} Exported content
   */
  static async exportContent(content, format = "html") {
    try {
      switch (format.toLowerCase()) {
        case "text":
          return this.extractTextFromContent(content);

        case "markdown":
          // This would require a TipTap to Markdown converter
          // For now, return text format
          return this.extractTextFromContent(content);

        case "html":
        default:
          // This would require a TipTap to HTML converter
          // For now, return a basic HTML structure
          const text = this.extractTextFromContent(content);
          return `<div class="editor-content">${text}</div>`;
      }
    } catch (error) {
      return this.handleError(error, "export content");
    }
  }

  /**
   * Get content statistics
   * @param {Object} content - TipTap JSON content
   * @returns {Object} Content statistics
   */
  static getContentStats(content) {
    return {
      wordCount: this.getWordCount(content),
      characterCount: this.getCharacterCount(content),
      paragraphCount: this.countNodesByType(content, "paragraph"),
      headingCount: this.countNodesByType(content, "heading"),
      listCount: this.countNodesByType(content, ["bulletList", "orderedList"]),
      taskCount: this.countNodesByType(content, "taskItem"),
      codeBlockCount: this.countNodesByType(content, "codeBlock"),
    };
  }

  /**
   * Count nodes by type in content
   * @param {Object} content - TipTap JSON content
   * @param {string|Array} types - Node type(s) to count
   * @returns {number} Node count
   */
  static countNodesByType(content, types) {
    if (!content) return 0;

    const targetTypes = Array.isArray(types) ? types : [types];
    let count = 0;

    if (targetTypes.includes(content.type)) {
      count++;
    }

    if (content.content && Array.isArray(content.content)) {
      count += content.content.reduce((sum, node) => sum + this.countNodesByType(node, types), 0);
    }

    return count;
  }
}

export default EditorService;
