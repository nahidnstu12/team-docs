/**
 * Extension Registry
 * Centralized extension management system for TipTap editor
 *
 * @fileoverview This module provides a centralized registry for managing
 * TipTap extensions with lazy loading, dependency management, and modular organization.
 */

import StarterKit from "@tiptap/starter-kit";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { all, createLowlight } from "lowlight";
import OrderedList from "@tiptap/extension-ordered-list";
import TextAlign from "@tiptap/extension-text-align";
import Typography from "@tiptap/extension-typography";
import FontFamily from "@tiptap/extension-font-family";
import CharacterCount from "@tiptap/extension-character-count";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Strike from "@tiptap/extension-strike";
import Underline from "@tiptap/extension-underline";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import Highlight from "@tiptap/extension-highlight";
import { Placeholder } from "@tiptap/extension-placeholder";

// Initialize lowlight for code highlighting
const lowlight = createLowlight(all);

/**
 * Extension categories for organization
 * @type {Object}
 */
export const EXTENSION_CATEGORIES = {
  BASE: "base",
  BLOCKS: "blocks",
  MARKS: "marks",
  CUSTOM: "custom",
  UTILITIES: "utilities",
};

/**
 * Extension registry class
 * Manages loading and organization of TipTap extensions
 */
class ExtensionRegistryClass {
  constructor() {
    this.extensions = new Map();
    this.categories = new Map();
    this.loadedExtensions = new Set();
    this.dependencies = new Map();

    // Initialize with base extensions
    this.initializeBaseExtensions();
  }

  /**
   * Initialize base extensions that are always loaded
   * @private
   */
  initializeBaseExtensions() {
    // Base extensions (always loaded)
    this.register("starterkit", StarterKit, EXTENSION_CATEGORIES.BASE, {
      config: {
        history: true,
        paragraph: { HTMLAttributes: { class: "text-left" } },
        heading: { HTMLAttributes: { class: "text-left" } },
      },
    });

    this.register("typography", Typography, EXTENSION_CATEGORIES.BASE);
    this.register("character-count", CharacterCount, EXTENSION_CATEGORIES.UTILITIES, {
      config: { limit: 10000 },
    });

    this.register("placeholder", Placeholder, EXTENSION_CATEGORIES.UTILITIES, {
      config: {
        placeholder: "Type '/' for commands...",
        showOnlyWhenEditable: true,
        showOnlyCurrent: false,
      },
    });

    // Text formatting extensions
    this.register("bold", Bold, EXTENSION_CATEGORIES.MARKS);
    this.register("italic", Italic, EXTENSION_CATEGORIES.MARKS);
    this.register("strike", Strike, EXTENSION_CATEGORIES.MARKS);
    this.register("underline", Underline, EXTENSION_CATEGORIES.MARKS);
    this.register("subscript", Subscript, EXTENSION_CATEGORIES.MARKS);
    this.register("superscript", Superscript, EXTENSION_CATEGORIES.MARKS);
    this.register("highlight", Highlight, EXTENSION_CATEGORIES.MARKS, {
      config: { multicolor: true },
    });

    // Block extensions
    this.register("task-list", TaskList, EXTENSION_CATEGORIES.BLOCKS, {
      config: { nested: true },
    });
    this.register("task-item", TaskItem, EXTENSION_CATEGORIES.BLOCKS, {
      config: { nested: true },
    });
    this.register("ordered-list", OrderedList, EXTENSION_CATEGORIES.BLOCKS);
    this.register(
      "code-block",
      CodeBlockLowlight.configure({ lowlight }),
      EXTENSION_CATEGORIES.BLOCKS
    );

    // Utility extensions
    this.register("text-align", TextAlign, EXTENSION_CATEGORIES.UTILITIES, {
      config: { types: ["heading", "paragraph"] },
    });
    this.register("font-family", FontFamily, EXTENSION_CATEGORIES.UTILITIES, {
      config: { types: ["textStyle"] },
    });
  }

  /**
   * Register an extension
   * @param {string} name - Extension name
   * @param {Function|Object} extension - Extension class or instance
   * @param {string} category - Extension category
   * @param {Object} options - Extension options
   */
  register(name, extension, category = EXTENSION_CATEGORIES.CUSTOM, options = {}) {
    const extensionInfo = {
      name,
      extension,
      category,
      config: options.config || {},
      dependencies: options.dependencies || [],
      lazy: options.lazy || false,
      enabled: options.enabled !== false,
    };

    this.extensions.set(name, extensionInfo);

    // Add to category
    if (!this.categories.has(category)) {
      this.categories.set(category, new Set());
    }
    this.categories.get(category).add(name);

    // Register dependencies
    if (options.dependencies) {
      this.dependencies.set(name, options.dependencies);
    }
  }

  /**
   * Unregister an extension
   * @param {string} name - Extension name
   */
  unregister(name) {
    const extensionInfo = this.extensions.get(name);
    if (extensionInfo) {
      this.extensions.delete(name);
      this.categories.get(extensionInfo.category)?.delete(name);
      this.dependencies.delete(name);
      this.loadedExtensions.delete(name);
    }
  }

  /**
   * Get extension by name
   * @param {string} name - Extension name
   * @returns {Object|null} Extension info or null
   */
  get(name) {
    return this.extensions.get(name) || null;
  }

  /**
   * Get extensions by category
   * @param {string} category - Extension category
   * @returns {Array} Array of extension names
   */
  getByCategory(category) {
    return Array.from(this.categories.get(category) || []);
  }

  /**
   * Load a specific extension with its dependencies
   * @param {string} name - Extension name
   * @returns {Promise<Object|null>} Loaded extension or null
   */
  async loadExtension(name) {
    const extensionInfo = this.get(name);
    if (!extensionInfo || !extensionInfo.enabled) {
      return null;
    }

    // Check if already loaded
    if (this.loadedExtensions.has(name)) {
      return this.createExtensionInstance(extensionInfo);
    }

    try {
      // Load dependencies first
      const dependencies = this.dependencies.get(name) || [];
      await Promise.all(dependencies.map((dep) => this.loadExtension(dep)));

      // Load the extension
      let extension = extensionInfo.extension;

      // Handle lazy loading
      if (extensionInfo.lazy && typeof extension === "function") {
        extension = await extension();
      }

      // Mark as loaded
      this.loadedExtensions.add(name);

      return this.createExtensionInstance({ ...extensionInfo, extension });
    } catch (error) {
      console.error(`Failed to load extension ${name}:`, error);
      return null;
    }
  }

  /**
   * Create an extension instance with configuration
   * @param {Object} extensionInfo - Extension information
   * @returns {Object} Configured extension instance
   * @private
   */
  createExtensionInstance(extensionInfo) {
    const { extension, config } = extensionInfo;

    // Handle different extension types
    if (typeof extension === "function") {
      // Extension class with configure method
      if (extension.configure) {
        return extension.configure(config);
      }
      return extension;
    }

    // Extension instance
    return extension;
  }

  /**
   * Load multiple extensions
   * @param {Array} names - Array of extension names
   * @returns {Promise<Array>} Array of loaded extensions
   */
  async loadExtensions(names) {
    const loadPromises = names.map((name) => this.loadExtension(name));
    const results = await Promise.all(loadPromises);
    return results.filter(Boolean); // Remove null results
  }

  /**
   * Get base extensions (always loaded)
   * @returns {Promise<Array>} Array of base extensions
   */
  async getBaseExtensions() {
    const baseExtensions = this.getByCategory(EXTENSION_CATEGORIES.BASE);
    const markExtensions = this.getByCategory(EXTENSION_CATEGORIES.MARKS);
    const blockExtensions = this.getByCategory(EXTENSION_CATEGORIES.BLOCKS);
    const utilityExtensions = this.getByCategory(EXTENSION_CATEGORIES.UTILITIES);

    const allBaseExtensions = [
      ...baseExtensions,
      ...markExtensions,
      ...blockExtensions,
      ...utilityExtensions,
    ];

    return this.loadExtensions(allBaseExtensions);
  }

  /**
   * Get all available extension names
   * @returns {Array} Array of extension names
   */
  getAvailableExtensions() {
    return Array.from(this.extensions.keys());
  }

  /**
   * Get extension categories
   * @returns {Array} Array of category names
   */
  getCategories() {
    return Array.from(this.categories.keys());
  }

  /**
   * Check if extension is loaded
   * @param {string} name - Extension name
   * @returns {boolean} Whether extension is loaded
   */
  isLoaded(name) {
    return this.loadedExtensions.has(name);
  }

  /**
   * Enable/disable an extension
   * @param {string} name - Extension name
   * @param {boolean} enabled - Whether to enable the extension
   */
  setEnabled(name, enabled) {
    const extensionInfo = this.get(name);
    if (extensionInfo) {
      extensionInfo.enabled = enabled;
    }
  }

  /**
   * Get extension statistics
   * @returns {Object} Extension statistics
   */
  getStats() {
    return {
      total: this.extensions.size,
      loaded: this.loadedExtensions.size,
      categories: this.categories.size,
      byCategory: Object.fromEntries(
        Array.from(this.categories.entries()).map(([cat, exts]) => [cat, exts.size])
      ),
    };
  }
}

// Create singleton instance
export const ExtensionRegistry = new ExtensionRegistryClass();

// Convenience methods for common operations
export const registerExtension = (name, extension, category, options) =>
  ExtensionRegistry.register(name, extension, category, options);

export const loadExtension = (name) => ExtensionRegistry.loadExtension(name);

export const getBaseExtensions = () => ExtensionRegistry.getBaseExtensions();

export const getExtensionStats = () => ExtensionRegistry.getStats();

// Default export
export default ExtensionRegistry;
