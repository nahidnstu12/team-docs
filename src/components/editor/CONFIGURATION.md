# 🔧 TipTap Editor Configuration Guide

Complete configuration reference for the TipTap editor system, covering all available options, extensions, and customization possibilities.

## 📋 Table of Contents

- [Core Configuration](#core-configuration)
- [Extension Configuration](#extension-configuration)
- [UI Component Configuration](#ui-component-configuration)
- [Advanced Configuration](#advanced-configuration)
- [Performance Configuration](#performance-configuration)
- [Theming & Styling](#theming--styling)

## 🏗️ Core Configuration

### Default Editor Configuration

```javascript
// src/components/editor/core/EditorConfig.js
export const DEFAULT_EDITOR_CONFIG = {
  // Editor behavior
  autofocus: true,                    // Auto-focus editor on mount
  immediatelyRender: false,           // Render immediately or wait for hydration
  
  // Content limits
  characterLimit: 10000,              // Maximum character count
  
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
  
  // Auto-save settings (disabled for versioning)
  autoSave: {
    enabled: false,
    delay: 2000,                      // 2 seconds debounce
  },
  
  // Preview mode
  preview: {
    enabled: true,
    className: "preview-mode",
  },
};
```

### Editor Instance Configuration

```jsx
<CompleteEditor
  instanceId="my-editor"              // Required: Unique identifier
  pageId="page-123"                   // Optional: Page identifier for persistence
  initialContent={jsonContent}       // Optional: Initial TipTap JSON content
  onSave={handleSave}                 // Optional: Save callback
  onChange={handleChange}             // Optional: Change callback
  onFocus={handleFocus}               // Optional: Focus callback
  onBlur={handleBlur}                 // Optional: Blur callback
  config={customConfig}               // Optional: Configuration overrides
  className="custom-editor"           // Optional: Additional CSS classes
  editable={true}                     // Optional: Editor editability
/>
```

## 🔌 Extension Configuration

### Available Extensions

#### Core Extensions (Always Loaded)
```javascript
// Base functionality
StarterKit.configure({
  history: true,
  paragraph: { HTMLAttributes: { class: "text-left" } },
  heading: { HTMLAttributes: { class: "text-left" } },
})

// Typography enhancements
Typography                            // Smart quotes, em dashes, etc.

// Character counting
CharacterCount.configure({
  limit: 10000,
})

// Placeholder text
Placeholder.configure({
  placeholder: "Type '/' for commands...",
  showOnlyWhenEditable: true,
  showOnlyCurrent: false,
})
```

#### Text Formatting Extensions
```javascript
// Basic formatting
Bold                                  // Bold text
Italic                                // Italic text
Strike                                // Strikethrough text
Underline                             // Underlined text
Subscript                             // Subscript text
Superscript                           // Superscript text

// Advanced formatting
Highlight.configure({
  multicolor: true,                   // Multiple highlight colors
})

Color                                 // Text colors
TextStyle                             // Required for color support
```

#### Block Extensions
```javascript
// Lists
TaskList.configure({
  nested: true,                       // Allow nested task lists
})

TaskItem.configure({
  nested: true,                       // Allow nested task items
})

// Code blocks with syntax highlighting
CodeBlockLowlight.configure({
  lowlight,                           // Syntax highlighter instance
  defaultLanguage: "plaintext",       // Default language
})

// Text alignment
TextAlign.configure({
  types: ["heading", "paragraph"],    // Alignable elements
  alignments: ["left", "center", "right", "justify"],
})
```

#### Custom Extensions
```javascript
// Notion-like collapsible blocks
Toggle.configure({
  defaultOpen: true,                  // New toggles start expanded
})

// Always-available escape mechanism
TrailingNode.configure({
  node: "paragraph",
  notAfter: [],                       // Always add trailing node
})

// Enhanced link handling
Link.configure({
  openOnClick: false,                 // Don't open links on click in editor
  HTMLAttributes: {
    class: "text-blue-600 underline cursor-pointer",
  },
})
```

## 🎨 UI Component Configuration

### Slash Menu Configuration

```javascript
export const SLASH_COMMAND_CONFIG = {
  trigger: "/",                       // Trigger character
  allowSpaces: false,                 // Allow spaces in search
  startOfLine: false,                 // Only trigger at start of line
  
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
    threshold: 0.3,                   // Fuzzy search threshold
  },
};
```

### Bubble Menu Configuration

```javascript
export const BUBBLE_MENU_CONFIG = {
  // Positioning
  placement: "top",
  offset: 8,
  
  // Tippy.js options
  tippyOptions: {
    duration: 150,                    // Animation speed
    placement: "top",                 // Show above selection
    interactive: true,                // Allow clicking inside menu
    interactiveBorder: 10,            // Keep menu open when mouse is near
    hideOnClick: false,               // Don't hide when clicking buttons
  },
  
  // Show/hide conditions
  shouldShow: ({ editor, view, state, oldState, from, to }) => {
    const { doc, selection } = state;
    const { empty } = selection;
    
    // Don't show if selection is empty
    if (empty) return false;
    
    // Don't show if selection contains only whitespace
    const text = doc.textBetween(from, to, " ");
    if (!text.trim()) return false;
    
    return true;
  },
};
```

### Color Picker Configuration

```javascript
// Available text colors
const textColors = [
  { name: "Red", color: "#ef4444" },
  { name: "Green", color: "#22c55e" },
  { name: "Blue", color: "#3b82f6" },
  { name: "Yellow", color: "#eab308" },
  { name: "Purple", color: "#8b5cf6" },
  { name: "Gray", color: "#6b7280" },
];

// Available background colors
const bgColors = [
  { name: "Red", color: "#fee2e2" },
  { name: "Green", color: "#dcfce7" },
  { name: "Blue", color: "#dbeafe" },
  { name: "Yellow", color: "#fef9c3" },
  { name: "Purple", color: "#ede9fe" },
  { name: "Gray", color: "#f3f4f6" },
];
```

## ⚡ Performance Configuration

### Lazy Loading Configuration

```javascript
// Dynamic imports for better performance
const SlashMenu = dynamic(() => import("./ui/menus/SlashMenu"), {
  loading: () => <div className="animate-pulse h-8 w-32 bg-gray-200 rounded" />,
  ssr: false,
});

const BubbleMenu = dynamic(() => import("./ui/BubbleMenu"), {
  loading: () => null,
  ssr: false,
});
```

### Code Splitting Configuration

```javascript
// Extension lazy loading
const extensionRegistry = {
  async loadExtension(name) {
    switch (name) {
      case 'toggle':
        return (await import('./extensions/toggle')).Toggle;
      case 'color':
        return (await import('./extensions/color')).ColorExtensions;
      default:
        throw new Error(`Unknown extension: ${name}`);
    }
  }
};
```

## 🎨 Theming & Styling

### Theme Configuration

```javascript
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
```

### CSS Custom Properties

```css
/* Editor theme variables */
:root {
  --editor-bg: #ffffff;
  --editor-text: #1f2937;
  --editor-border: #e5e7eb;
  --editor-selection: #3b82f6;
  --editor-placeholder: #9ca3af;
}

[data-theme="dark"] {
  --editor-bg: #1f2937;
  --editor-text: #f9fafb;
  --editor-border: #374151;
  --editor-selection: #60a5fa;
  --editor-placeholder: #6b7280;
}
```

## 🔒 Validation Configuration

```javascript
export const VALIDATION_RULES = {
  maxCharacters: 10000,
  maxHeadingLevel: 6,
  allowedImageTypes: ["image/jpeg", "image/png", "image/gif", "image/webp"],
  maxImageSize: 5 * 1024 * 1024,     // 5MB
  allowedLinkProtocols: ["http:", "https:", "mailto:", "tel:"],
};
```

## 🔧 Advanced Configuration Examples

### Custom Extension Registration

```javascript
import { ExtensionRegistry } from "@/components/editor";

// Register custom extension
ExtensionRegistry.register("my-extension", MyExtension, "custom", {
  config: { option: "value" },
  dependencies: ["base-extension"],
  lazy: true,
  enabled: true,
});
```

### Multi-Editor Setup

```jsx
<EditorProvider
  autoSave={true}
  globalConfig={{
    characterLimit: 50000,
    theme: "dark",
  }}
>
  <Editor instanceId="editor-1" config={{ autofocus: true }} />
  <Editor instanceId="editor-2" config={{ editable: false }} />
</EditorProvider>
```
