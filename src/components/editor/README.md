# 📝 TipTap Editor System - Notion-Like Rich Text Editor

A comprehensive, production-ready TipTap rich text editor implementation for Next.js 15 with App Router. Built with modern React patterns, Laravel-inspired service architecture, and designed to replicate Notion's editing experience.

## 🎯 Project Vision

**Goal**: Create a Notion-like editor that provides an intuitive, powerful writing experience with advanced features like slash commands, collapsible blocks, real-time formatting, and seamless content organization.

**Current Status**: ✅ Core features implemented | 🚧 Advanced features in progress | 📋 Collaboration features planned

## 🏗️ Architecture Overview

The editor system follows a modular, scalable architecture with clear separation of concerns:

```
src/components/editor/
├── 📁 core/                    # Core editor functionality
│   ├── Editor.jsx              # Main editor component with extension loading
│   ├── EditorProvider.jsx      # Context provider for multi-editor management
│   └── EditorConfig.js         # Configuration constants and defaults
├── 📁 extensions/              # TipTap extensions (features)
│   ├── index.js                # Extension registry and management
│   ├── custom/                 # Custom-built extensions
│   ├── toggle/                 # Notion-like collapsible blocks
│   ├── trailing-node/          # Always-available escape mechanism
│   ├── color/                  # Text and highlight colors
│   └── link/                   # Enhanced link handling
├── 📁 ui/                      # User interface components
│   ├── menus/                  # Interactive menus
│   │   ├── SlashMenu/          # Notion-style command palette
│   │   └── BubbleMenu/         # Context-sensitive formatting
│   ├── dialogs/                # Modal dialogs
│   ├── ColorPickerPanel.jsx    # Color selection interface
│   └── Toolbar.jsx             # Traditional toolbar (optional)
├── 📁 hooks/                   # React hooks for editor functionality
│   ├── useTiptapEditor.js      # Main editor hook with utilities
│   ├── useLinkEditor.js        # Link creation/editing logic
│   └── useSlashCommand.js      # Slash menu command handling
├── 📁 services/                # Business logic (Laravel-inspired)
│   └── EditorService.js        # Content operations and API integration
├── 📁 utils/                   # Utility functions and helpers
└── 📁 constants/               # Constants and type definitions
```

## 🚀 Quick Start Guide

### 🎯 Basic Implementation

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
        placeholder: { text: "Start writing or type '/' for commands..." },
        characterLimit: 10000,
      }}
    />
  );
}
```

### 🔧 Advanced Implementation with Provider

```jsx
import { EditorProvider, Editor, BubbleMenu, SlashMenu } from "@/components/editor";

export default function AdvancedEditor() {
  return (
    <EditorProvider>
      <Editor
        instanceId="advanced-editor"
        extensions={[CustomExtension]}
        config={{ autofocus: true }}
      >
        <BubbleMenu />
        <SlashMenu />
      </Editor>
    </EditorProvider>
  );
}
```

## ✨ Current Features & Capabilities

### 🎨 Rich Text Editing

- **Text Formatting**: Bold, italic, underline, strikethrough, subscript, superscript
- **Advanced Styling**: Text colors, highlight colors, font families
- **Block Elements**: Headings (H1-H6), paragraphs, blockquotes, code blocks with syntax highlighting
- **Lists**: Bullet lists, ordered lists, nested task lists with checkboxes
- **Interactive Content**: Smart links with preview, collapsible toggle blocks
- **Special Elements**: Horizontal rules, inline code, keyboard shortcuts

### 🎯 Notion-Like Features

- **Slash Commands**: Type `/` for instant access to all content types
- **Bubble Menu**: Context-sensitive formatting toolbar on text selection
- **Toggle Blocks**: Collapsible content sections with smooth animations
- **Trailing Nodes**: Always-available escape mechanism from any block type
- **Smart Placeholders**: Contextual placeholder text throughout the editor
- **Keyboard Navigation**: Full keyboard support with intuitive shortcuts

### 🔧 Technical Features

- **Auto-save**: Configurable with debouncing (currently disabled for versioning)
- **Content Validation**: XSS prevention and structure validation
- **Performance**: Lazy loading, code splitting, optimized rendering
- **Responsive Design**: Mobile-first with touch support
- **Dark Mode**: Complete dark theme support
- **Accessibility**: WCAG compliant with screen reader support

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

## 📚 Documentation

### 📖 Complete Documentation Suite

| Document                                           | Purpose                      | Audience             |
| -------------------------------------------------- | ---------------------------- | -------------------- |
| **[README.md](./README.md)**                       | Overview and quick start     | All developers       |
| **[FEATURES.md](./FEATURES.md)**                   | Complete feature guide       | Users & developers   |
| **[CONFIGURATION.md](./CONFIGURATION.md)**         | Configuration reference      | Developers           |
| **[EXTENSIONS.md](./EXTENSIONS.md)**               | Extension development guide  | Extension developers |
| **[DEVELOPMENT.md](./DEVELOPMENT.md)**             | Development workflow         | Contributors         |
| **[NOTION-COMPARISON.md](./NOTION-COMPARISON.md)** | Feature comparison & roadmap | Product managers     |
| **[API.md](./API.md)**                             | API reference                | Developers           |
| **[ROADMAP.md](./ROADMAP.md)**                     | Future features & timeline   | All stakeholders     |

### 🚀 Getting Started Resources

1. **New to the Editor?** → Start with [README.md](./README.md)
2. **Want to Use Features?** → Check [FEATURES.md](./FEATURES.md)
3. **Need to Configure?** → See [CONFIGURATION.md](./CONFIGURATION.md)
4. **Building Extensions?** → Read [EXTENSIONS.md](./EXTENSIONS.md)
5. **Contributing Code?** → Follow [DEVELOPMENT.md](./DEVELOPMENT.md)
6. **Planning Features?** → Review [NOTION-COMPARISON.md](./NOTION-COMPARISON.md)

## 🎯 What's Next?

### 🚧 Immediate Priorities (Next 4 weeks)

1. **Tables** - Full table support with inline editing
2. **Images** - Drag & drop image upload with resizing
3. **Drag & Drop** - Block reordering with visual feedback
4. **Callout Boxes** - Info/warning/error callout blocks

### 📈 Progress Toward Notion-Like Experience

- **Current**: ~60% of Notion's core features implemented
- **Target**: 80% feature parity by end of quarter
- **Focus**: Essential content creation features first

See [NOTION-COMPARISON.md](./NOTION-COMPARISON.md) for detailed feature comparison and implementation roadmap.

## 🤝 Contributing

### Development Workflow

1. **Read** [DEVELOPMENT.md](./DEVELOPMENT.md) for setup and patterns
2. **Check** [ROADMAP.md](./ROADMAP.md) for planned features
3. **Follow** established architectural patterns
4. **Add** comprehensive tests and documentation
5. **Update** relevant documentation files

### Code Standards

- Follow Laravel-inspired service patterns
- Add JSDoc comments to all functions
- Include tests for new features
- Update documentation with changes
- Maintain modular architecture

### Documentation Standards

- Keep all documentation files up to date
- Add examples for new features
- Update configuration guides for new options
- Include migration notes for breaking changes

## 📄 License

This editor system is part of the team-docs project and follows the same licensing terms.
