# TipTap Editor System

A comprehensive, modular TipTap rich text editor implementation for Next.js 15 with App Router, designed following Laravel-like service patterns and modern React best practices.

## 🏗️ Architecture Overview

The editor system is organized into modular components that can be used independently or together:

```
src/components/editor/
├── core/                    # Core editor functionality
│   ├── Editor.jsx          # Main editor component
│   ├── EditorProvider.jsx  # Context provider
│   └── EditorConfig.js     # Configuration constants
├── extensions/             # TipTap extensions
│   ├── index.js           # Extension registry
│   ├── custom/            # Custom extensions
│   ├── base/              # Base extensions
│   ├── blocks/            # Block-level extensions
│   └── marks/             # Inline formatting extensions
├── ui/                    # UI components
│   ├── menus/             # Menu components
│   ├── dialogs/           # Dialog components
│   ├── toolbars/          # Toolbar components
│   └── panels/            # Side panels
├── hooks/                 # Editor-specific hooks
├── services/              # Business logic (Laravel-like)
├── utils/                 # Utilities and helpers
└── constants/             # Constants and configurations
```

## 🚀 Quick Start

### Basic Usage

```jsx
import { CompleteEditor } from "@/components/editor";

export default function MyPage() {
  const handleSave = async (content, instanceId) => {
    // Save content to your backend
    await saveToBackend(content, instanceId);
  };

  return (
    <CompleteEditor
      instanceId="my-editor"
      pageId="page-123"
      onSave={handleSave}
      config={{
        placeholder: { text: "Start writing..." },
        characterLimit: 10000,
      }}
    />
  );
}
```

### With Provider (Multiple Editors)

```jsx
import { EditorProvider, Editor, BubbleMenu, SlashMenu } from "@/components/editor";

export default function MultiEditorPage() {
  return (
    <EditorProvider autoSave={true}>
      <Editor instanceId="editor-1">
        <BubbleMenu />
        <SlashMenu />
      </Editor>

      <Editor instanceId="editor-2">
        <BubbleMenu />
      </Editor>
    </EditorProvider>
  );
}
```

## 🎯 Features

### ✅ Implemented Features

- **Rich Text Formatting**: Bold, italic, underline, strikethrough, subscript, superscript
- **Text Styling**: Highlighting, colors, font families, text alignment
- **Block Elements**: Headings (H1-H6), paragraphs, blockquotes, code blocks
- **Lists**: Bullet lists, ordered lists, task lists (with nesting)
- **Interactive Elements**: Links, collapsible details/summary sections
- **Slash Commands**: Notion-like command palette with keyboard shortcuts
- **Bubble Menu**: Context-sensitive formatting toolbar
- **Auto-save**: Configurable auto-save with debouncing
- **Content Validation**: XSS prevention and content structure validation
- **Keyboard Navigation**: Full keyboard support for all features
- **Responsive Design**: Mobile-first design with touch support
- **Dark Mode**: Full dark mode support
- **Performance**: Lazy loading, code splitting, optimized rendering

### 🎨 UI Components

#### Slash Menu

- Triggered by typing `/`
- Searchable command palette
- Keyboard navigation (↑↓ arrows, Enter, Escape)
- Visual icons and keyboard shortcuts
- Grouped commands by category

#### Bubble Menu

- Appears when text is selected
- Context-sensitive formatting options
- Color picker integration
- Expandable more options panel

#### Toolbar (Optional)

- Traditional toolbar interface
- All formatting options
- Font family selection
- Alignment controls

## 🔧 Configuration

### Editor Configuration

```jsx
const editorConfig = {
  // Basic settings
  autofocus: true,
  characterLimit: 10000,

  // Placeholder
  placeholder: {
    text: "Type '/' for commands...",
    showOnlyWhenEditable: true,
  },

  // Auto-save
  autoSave: {
    enabled: true,
    delay: 2000, // 2 seconds
  },

  // Editor attributes
  editorProps: {
    attributes: {
      class: "prose prose-lg max-w-none",
    },
  },
};
```

### Extension Configuration

```jsx
import { ExtensionRegistry } from "@/components/editor";

// Register custom extension
ExtensionRegistry.register("my-extension", MyExtension, "custom", {
  config: { option: "value" },
  dependencies: ["base-extension"],
});

// Load specific extensions
const extensions = await ExtensionRegistry.loadExtensions([
  "bold",
  "italic",
  "heading",
  "my-extension",
]);
```

## 🎣 Hooks

### useEditorContext

Access the global editor context:

```jsx
import { useEditorContext } from "@/components/editor";

function MyComponent() {
  const { registerEditor, saveEditor, isLoading, isSaving, hasUnsavedChanges } = useEditorContext();

  // Use context methods...
}
```

### useEditorInstance

Work with a specific editor instance:

```jsx
import { useEditorInstance } from "@/components/editor";

function MyComponent() {
  const { editor, save, loadContent, clearContent, focus } = useEditorInstance("my-editor-id");

  // Use instance methods...
}
```

### useEditorContent

Manage content loading and saving:

```jsx
import { useEditorContent } from "@/components/editor";

function MyComponent() {
  const {
    content,
    isLoading,
    isSaving,
    hasUnsavedChanges,
    saveContent,
    loadContent,
    updateContent,
  } = useEditorContent({
    pageId: "page-123",
    autoSave: true,
    onSave: handleSave,
  });

  // Use content management...
}
```

## 🛠️ Services

### EditorService

Laravel-like service for editor business logic:

```jsx
import { EditorService } from "@/components/editor";

// Save content
const result = await EditorService.saveContent({
  pageId: "page-123",
  content: editorContent,
  metadata: { tags: ["important"] },
});

// Load content
const content = await EditorService.loadContent("page-123");

// Validate content
const validation = EditorService.validateContent(content);

// Get statistics
const stats = EditorService.getContentStats(content);
```

## 🎨 Styling

The editor uses Tailwind CSS with custom CSS for specific elements:

```css
/* Custom editor styles */
.editor-content {
  @apply prose prose-lg max-w-none;
}

.bubble-menu {
  @apply bg-white border border-gray-200 shadow-xl rounded-xl;
}

.slash-menu {
  @apply bg-white border border-gray-200 shadow-2xl rounded-xl;
}
```

## 🔌 Extensions

### Creating Custom Extensions

```jsx
import { Node } from "@tiptap/core";
import { ExtensionRegistry } from "@/components/editor";

const MyCustomExtension = Node.create({
  name: "myCustomNode",

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  parseHTML() {
    return [{ tag: "my-custom-element" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["my-custom-element", HTMLAttributes, 0];
  },

  addCommands() {
    return {
      insertMyCustomNode:
        () =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: {},
          });
        },
    };
  },
});

// Register the extension
ExtensionRegistry.register("my-custom", MyCustomExtension, "custom");
```

## 📱 Responsive Design

The editor is fully responsive and touch-friendly:

- Mobile-first design approach
- Touch-optimized controls
- Responsive menu positioning
- Adaptive toolbar layouts
- Gesture support for selection

## ♿ Accessibility

Full accessibility support included:

- ARIA labels and roles
- Keyboard navigation
- Screen reader support
- Focus management
- High contrast support

## 🚀 Performance

Optimized for performance:

- Lazy loading of extensions
- Code splitting for menus
- Debounced auto-save
- Virtual scrolling for large documents
- Optimized re-renders

## 🧪 Testing

```jsx
import { render, screen } from "@testing-library/react";
import { CompleteEditor } from "@/components/editor";

test("renders editor with placeholder", () => {
  render(
    <CompleteEditor
      instanceId="test-editor"
      config={{ placeholder: { text: "Test placeholder" } }}
    />
  );

  expect(screen.getByText("Test placeholder")).toBeInTheDocument();
});
```

## 📚 Migration Guide

See [MIGRATION.md](./MIGRATION.md) for detailed migration instructions from the old editor structure.

## 🤝 Contributing

1. Follow the established patterns
2. Add JSDoc comments to all functions
3. Include tests for new features
4. Update documentation
5. Follow the modular architecture

## 📄 License

This editor system is part of the team-docs project.
