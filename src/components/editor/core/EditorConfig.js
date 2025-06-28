/**
 * Editor Configuration Constants
 * Centralized configuration for the TipTap editor system
 *
 * @fileoverview This file contains all configuration constants, default settings,
 * and configuration utilities for the TipTap editor implementation.
 */

/**
 * Default editor configuration
 * @type {Object}
 */
export const DEFAULT_EDITOR_CONFIG = {
  // Editor behavior settings
  autofocus: true,
  immediatelyRender: false,

  // Content limits
  characterLimit: 10000,

  // Editor attributes
  editorProps: {
    attributes: {
      class: "focus:outline-none max-w-none prose prose-lg",
    },
  },

  // Placeholder settings
  placeholder: {
    text: "Type '/' for commands...",
    showOnlyWhenEditable: true,
    showOnlyCurrent: false,
  },

  // Auto-save settings
  autoSave: {
    enabled: true,
    delay: 2000, // 2 seconds
  },

  // Preview mode settings
  preview: {
    enabled: true,
    className: "preview-mode",
  },
};

/**
 * Editor keyboard shortcuts
 * @type {Object}
 */
export const EDITOR_SHORTCUTS = {
  // Text formatting
  bold: "Mod-b",
  italic: "Mod-i",
  underline: "Mod-u",
  strike: "Mod-shift-x",

  // Text styling
  highlight: "Mod-shift-h",
  subscript: "Mod-,",
  superscript: "Mod-.",

  // Block formatting
  heading1: "Mod-Alt-1",
  heading2: "Mod-Alt-2",
  heading3: "Mod-Alt-3",
  heading4: "Mod-Alt-4",
  heading5: "Mod-Alt-5",
  heading6: "Mod-Alt-6",

  // Lists
  bulletList: "Mod-shift-8",
  orderedList: "Mod-shift-7",
  taskList: "Mod-shift-9",

  // Blocks
  blockquote: "Mod-shift-b",
  codeBlock: "Mod-Alt-c",
  details: "Mod-shift-d",

  // Text alignment
  alignLeft: "Mod-shift-l",
  alignCenter: "Mod-shift-e",
  alignRight: "Mod-shift-r",
  alignJustify: "Mod-shift-j",

  // Editor actions
  save: "Mod-s",
  undo: "Mod-z",
  redo: "Mod-y",
};

/**
 * Slash command trigger configuration
 * @type {Object}
 */
export const SLASH_COMMAND_CONFIG = {
  trigger: "/",
  allowSpaces: false,
  startOfLine: false,

  // Menu positioning
  placement: "bottom-start",
  offset: 8,

  // Animation settings
  animation: {
    duration: 150,
    easing: "easeOut",
  },

  // Search settings
  search: {
    caseSensitive: false,
    threshold: 0.3, // Fuzzy search threshold
  },
};

/**
 * Bubble menu configuration
 * @type {Object}
 */
export const BUBBLE_MENU_CONFIG = {
  // Menu positioning
  placement: "top",
  offset: 8,

  // Tippy.js options
  tippyOptions: {
    duration: 150,
    animation: "shift-away",
    theme: "light-border",
  },

  // Menu appearance
  className: "bubble-menu",

  // Show/hide conditions
  shouldShow: ({ editor, view, state, oldState, from, to }) => {
    const { doc, selection } = state;
    const { empty } = selection;

    // Don't show if selection is empty
    if (empty) return false;

    // Don't show if selection contains multiple blocks
    const isMultipleBlocks = selection.$from.parent !== selection.$to.parent;
    if (isMultipleBlocks) return false;

    return true;
  },
};

/**
 * Color palette for text and highlight colors
 * @type {Object}
 */
export const COLOR_PALETTE = {
  text: [
    "#000000", // Black
    "#374151", // Gray-700
    "#6B7280", // Gray-500
    "#9CA3AF", // Gray-400
    "#DC2626", // Red-600
    "#EA580C", // Orange-600
    "#D97706", // Amber-600
    "#65A30D", // Lime-600
    "#16A34A", // Green-600
    "#059669", // Emerald-600
    "#0891B2", // Cyan-600
    "#0284C7", // Sky-600
    "#2563EB", // Blue-600
    "#7C3AED", // Violet-600
    "#C026D3", // Fuchsia-600
    "#E11D48", // Rose-600
  ],

  highlight: [
    "#FEF3C7", // Yellow-100
    "#DBEAFE", // Blue-100
    "#D1FAE5", // Green-100
    "#FED7D7", // Red-100
    "#E0E7FF", // Indigo-100
    "#F3E8FF", // Purple-100
    "#FCE7F3", // Pink-100
    "#ECFDF5", // Emerald-100
    "#F0F9FF", // Sky-100
    "#FFF7ED", // Orange-100
  ],
};

/**
 * Font family options
 * @type {Array}
 */
export const FONT_FAMILIES = [
  { name: "Default", value: "" },
  { name: "Sans Serif", value: "ui-sans-serif, system-ui, sans-serif" },
  { name: "Serif", value: "ui-serif, Georgia, serif" },
  { name: "Monospace", value: "ui-monospace, 'Cascadia Code', monospace" },
  { name: "Inter", value: "Inter, sans-serif" },
  { name: "Roboto", value: "Roboto, sans-serif" },
  { name: "Open Sans", value: "'Open Sans', sans-serif" },
  { name: "Lato", value: "Lato, sans-serif" },
  { name: "Poppins", value: "Poppins, sans-serif" },
  { name: "Playfair Display", value: "'Playfair Display', serif" },
  { name: "Source Code Pro", value: "'Source Code Pro', monospace" },
];

/**
 * Editor theme configuration
 * @type {Object}
 */
export const EDITOR_THEME = {
  light: {
    background: "#ffffff",
    text: "#1f2937",
    border: "#e5e7eb",
    selection: "#3b82f6",
  },

  dark: {
    background: "#1f2937",
    text: "#f9fafb",
    border: "#374151",
    selection: "#60a5fa",
  },
};

/**
 * Validation rules for editor content
 * @type {Object}
 */
export const VALIDATION_RULES = {
  maxCharacters: 10000,
  maxHeadingLevel: 6,
  allowedImageTypes: ["image/jpeg", "image/png", "image/gif", "image/webp"],
  maxImageSize: 5 * 1024 * 1024, // 5MB
  allowedLinkProtocols: ["http:", "https:", "mailto:", "tel:"],
};

/**
 * Performance optimization settings
 * @type {Object}
 */
export const PERFORMANCE_CONFIG = {
  // Debounce settings
  debounce: {
    save: 2000,
    search: 300,
    resize: 100,
  },

  // Lazy loading
  lazyLoad: {
    extensions: true,
    menus: true,
    dialogs: true,
  },

  // Virtual scrolling (for large documents)
  virtualScrolling: {
    enabled: false,
    itemHeight: 24,
    overscan: 5,
  },
};

/**
 * Accessibility configuration
 * @type {Object}
 */
export const ACCESSIBILITY_CONFIG = {
  // ARIA labels
  ariaLabels: {
    editor: "Rich text editor",
    toolbar: "Formatting toolbar",
    bubbleMenu: "Text formatting menu",
    slashMenu: "Insert content menu",
  },

  // Keyboard navigation
  keyboardNavigation: {
    enabled: true,
    trapFocus: true,
  },

  // Screen reader support
  screenReader: {
    announceChanges: true,
    announceSelection: false,
  },
};

/**
 * Merge user configuration with defaults
 * @param {Object} userConfig - User-provided configuration
 * @returns {Object} Merged configuration
 */
export const mergeConfig = (userConfig = {}) => {
  return {
    ...DEFAULT_EDITOR_CONFIG,
    ...userConfig,
    editorProps: {
      ...DEFAULT_EDITOR_CONFIG.editorProps,
      ...userConfig.editorProps,
      attributes: {
        ...DEFAULT_EDITOR_CONFIG.editorProps.attributes,
        ...userConfig.editorProps?.attributes,
      },
    },
  };
};

/**
 * Get configuration for specific editor instance
 * @param {string} instanceId - Editor instance identifier
 * @param {Object} overrides - Configuration overrides
 * @returns {Object} Instance-specific configuration
 */
export const getInstanceConfig = (instanceId, overrides = {}) => {
  const baseConfig = mergeConfig(overrides);

  return {
    ...baseConfig,
    instanceId,
    editorProps: {
      ...baseConfig.editorProps,
      attributes: {
        ...baseConfig.editorProps.attributes,
        "data-editor-id": instanceId,
      },
    },
  };
};
