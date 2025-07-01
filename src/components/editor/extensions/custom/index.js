/**
 * Custom Extensions Index
 * Exports all custom TipTap extensions
 *
 * @fileoverview This module provides a centralized export point for all
 * custom TipTap extensions, including color, details, links, and behavior extensions.
 */

// Import custom extensions
export { ColorExtensions } from "../color";
// export { Details, DetailsSummary } from "../details"; // Removed - replaced with Toggle
// export { CustomLink } from "../link"; // Removed - conflicts with standard Link extension
export { ClearMarksOnEnter } from "../clearMarkStyles";
export { ResetMarksOnDelete } from "../ResetMarksOnDelete";

// Re-export for convenience
export * from "../color";
// export * from "../details"; // Removed - replaced with Toggle
// export * from "../link"; // Removed - conflicts with standard Link extension
export * from "../clearMarkStyles";
export * from "../ResetMarksOnDelete";

/**
 * Get all custom extensions as an array
 * @returns {Array} Array of custom extensions
 */
export const getAllCustomExtensions = () => {
  return [
    ...ColorExtensions,
    // Details, DetailsSummary, // Removed - replaced with Toggle
    // CustomLink, // Removed - conflicts with standard Link extension
    ClearMarksOnEnter,
    ResetMarksOnDelete,
  ];
};

/**
 * Custom extension configurations
 * @type {Object}
 */
export const CUSTOM_EXTENSION_CONFIGS = {
  color: {
    multicolor: true,
  },
  // details: { // Removed - replaced with Toggle
  //   HTMLAttributes: {
  //     class: "details-block",
  //   },
  // },
  link: {
    openOnClick: false,
    HTMLAttributes: {
      class: "custom-link cursor-pointer text-blue-500 underline",
      rel: "noopener noreferrer",
      target: "_blank",
    },
  },
  clearMarksOnEnter: {
    skipNodeTypes: ["codeBlock", "blockquote", "toggle", "taskItem"],
  },
  resetMarksOnDelete: {
    enabled: true,
  },
};

/**
 * Register custom extensions with the extension registry
 * @param {Object} registry - Extension registry instance
 */
export const registerCustomExtensions = (registry) => {
  // Register color extensions
  ColorExtensions.forEach((extension, index) => {
    registry.register(`color-${index}`, extension, "custom", {
      config: CUSTOM_EXTENSION_CONFIGS.color,
      category: "formatting",
    });
  });

  // Register details extensions - REMOVED (replaced with Toggle)
  // registry.register("details", Details, "custom", {
  //   config: CUSTOM_EXTENSION_CONFIGS.details,
  //   category: "blocks",
  // });

  // registry.register("details-summary", DetailsSummary, "custom", {
  //   config: {},
  //   category: "blocks",
  //   dependencies: ["details"],
  // });

  // Register link extension - REMOVED (conflicts with standard Link extension)
  // registry.register("custom-link", CustomLink, "custom", {
  //   config: CUSTOM_EXTENSION_CONFIGS.link,
  //   category: "marks",
  // });

  // Register behavior extensions
  registry.register("clear-marks-on-enter", ClearMarksOnEnter, "custom", {
    config: CUSTOM_EXTENSION_CONFIGS.clearMarksOnEnter,
    category: "utilities",
  });

  registry.register("reset-marks-on-delete", ResetMarksOnDelete, "custom", {
    config: CUSTOM_EXTENSION_CONFIGS.resetMarksOnDelete,
    category: "utilities",
  });
};

export default {
  getAllCustomExtensions,
  registerCustomExtensions,
  CUSTOM_EXTENSION_CONFIGS,
};
