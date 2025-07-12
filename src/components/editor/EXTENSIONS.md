# 🔌 TipTap Editor Extensions Guide

Complete reference for all TipTap extensions used in the editor system, including configuration options, usage examples, and custom extension development.

## 📋 Table of Contents

- [Extension Categories](#extension-categories)
- [Core Extensions](#core-extensions)
- [Text Formatting Extensions](#text-formatting-extensions)
- [Block Extensions](#block-extensions)
- [Custom Extensions](#custom-extensions)
- [Extension Registry](#extension-registry)
- [Creating Custom Extensions](#creating-custom-extensions)

## 🏗️ Extension Categories

Extensions are organized into logical categories for better management:

```javascript
export const EXTENSION_CATEGORIES = {
  BASE: "base",           // Core functionality (always loaded)
  MARKS: "marks",         // Inline formatting (bold, italic, etc.)
  BLOCKS: "blocks",       // Block-level elements (headings, lists, etc.)
  CUSTOM: "custom",       // Custom-built extensions
  UTILITIES: "utilities", // Helper extensions (character count, etc.)
  UI: "ui",              // User interface extensions
};
```

## 🔧 Core Extensions

### StarterKit
**Category**: Base  
**Always Loaded**: Yes

The foundation extension that provides essential editor functionality.

```javascript
StarterKit.configure({
  history: true,                    // Undo/redo functionality
  paragraph: { 
    HTMLAttributes: { 
      class: "text-left" 
    } 
  },
  heading: { 
    HTMLAttributes: { 
      class: "text-left" 
    } 
  },
  // Includes: Bold, Italic, Strike, Code, Paragraph, Text, 
  // Document, Heading, BulletList, OrderedList, ListItem,
  // Blockquote, CodeBlock, HardBreak, HorizontalRule
})
```

### Typography
**Category**: Base  
**Purpose**: Smart typography features

```javascript
Typography
// Provides:
// - Smart quotes (" " and ' ')
// - Em dashes (—)
// - Ellipsis (…)
// - Copyright symbols (©)
// - Trademark symbols (™)
```

### CharacterCount
**Category**: Utilities  
**Purpose**: Track document length

```javascript
CharacterCount.configure({
  limit: 10000,                     // Maximum character limit
  mode: 'textSize',                 // Count mode: 'textSize' or 'nodeSize'
})

// Usage in component:
const characterCount = editor.storage.characterCount.characters();
const wordCount = editor.storage.characterCount.words();
```

### Placeholder
**Category**: Utilities  
**Purpose**: Show placeholder text

```javascript
Placeholder.configure({
  placeholder: "Type '/' for commands...",
  showOnlyWhenEditable: true,       // Only show when editor is editable
  showOnlyCurrent: false,           // Show in all empty nodes
  includeChildren: false,           // Don't show in child nodes
})
```

## 🎨 Text Formatting Extensions

### Bold
**Category**: Marks  
**Shortcut**: `Cmd/Ctrl + B`

```javascript
Bold
// Creates: <strong>text</strong>
// Usage: editor.chain().focus().toggleBold().run()
```

### Italic
**Category**: Marks  
**Shortcut**: `Cmd/Ctrl + I`

```javascript
Italic
// Creates: <em>text</em>
// Usage: editor.chain().focus().toggleItalic().run()
```

### Underline
**Category**: Marks  
**Shortcut**: `Cmd/Ctrl + U`

```javascript
Underline
// Creates: <u>text</u>
// Usage: editor.chain().focus().toggleUnderline().run()
```

### Strike
**Category**: Marks  
**Shortcut**: `Cmd/Ctrl + Shift + X`

```javascript
Strike
// Creates: <s>text</s>
// Usage: editor.chain().focus().toggleStrike().run()
```

### Subscript & Superscript
**Category**: Marks

```javascript
Subscript
// Creates: <sub>text</sub>
// Usage: editor.chain().focus().toggleSubscript().run()

Superscript
// Creates: <sup>text</sup>
// Usage: editor.chain().focus().toggleSuperscript().run()
```

### Color & Highlight
**Category**: Marks  
**Dependencies**: TextStyle

```javascript
TextStyle                           // Required for color support

Color
// Usage: editor.chain().focus().setColor('#ff0000').run()
// Remove: editor.chain().focus().unsetColor().run()

Highlight.configure({
  multicolor: true,                 // Support multiple highlight colors
})
// Usage: editor.chain().focus().setHighlight({ color: '#ffff00' }).run()
// Remove: editor.chain().focus().unsetHighlight().run()
```

## 🏗️ Block Extensions

### TaskList & TaskItem
**Category**: Blocks  
**Purpose**: Interactive todo lists

```javascript
TaskList.configure({
  nested: true,                     // Allow nested task lists
  HTMLAttributes: {
    class: 'task-list',
  },
})

TaskItem.configure({
  nested: true,                     // Allow nested task items
  HTMLAttributes: {
    class: 'task-item',
  },
})

// Usage:
// editor.chain().focus().toggleTaskList().run()
// Creates interactive checkboxes
```

### CodeBlockLowlight
**Category**: Blocks  
**Purpose**: Syntax-highlighted code blocks

```javascript
import { all, createLowlight } from 'lowlight';
const lowlight = createLowlight(all);

CodeBlockLowlight.configure({
  lowlight,                         // Syntax highlighter instance
  defaultLanguage: 'plaintext',     // Default when no language specified
  HTMLAttributes: {
    class: 'code-block',
  },
})

// Usage:
// editor.chain().focus().toggleCodeBlock().run()
// editor.chain().focus().setCodeBlock({ language: 'javascript' }).run()
```

### TextAlign
**Category**: Blocks  
**Purpose**: Text alignment options

```javascript
TextAlign.configure({
  types: ['heading', 'paragraph'],  // Which elements can be aligned
  alignments: ['left', 'center', 'right', 'justify'],
  defaultAlignment: 'left',
})

// Usage:
// editor.chain().focus().setTextAlign('center').run()
// editor.chain().focus().unsetTextAlign().run()
```

### Link
**Category**: Marks  
**Purpose**: Enhanced link handling

```javascript
Link.configure({
  openOnClick: false,               // Don't open links in editor mode
  HTMLAttributes: {
    class: 'text-blue-600 underline cursor-pointer',
    rel: 'noopener noreferrer',
    target: '_blank',
  },
  protocols: ['http', 'https', 'mailto', 'tel'],
  validate: href => /^https?:\/\//.test(href),
})

// Usage:
// editor.chain().focus().setLink({ href: 'https://example.com' }).run()
// editor.chain().focus().unsetLink().run()
```

## 🎯 Custom Extensions

### Toggle Extension
**Category**: Custom  
**Purpose**: Notion-like collapsible blocks

```javascript
Toggle.configure({
  defaultOpen: true,                // New toggles start expanded
  HTMLAttributes: {
    class: 'toggle-block',
  },
})

// Features:
// - Click to expand/collapse
// - Smooth animations
// - Keyboard navigation
// - Nested content support
// - Persistent state

// Usage:
// editor.chain().focus().insertToggle().run()
```

### TrailingNode Extension
**Category**: Custom  
**Purpose**: Always-available escape mechanism

```javascript
TrailingNode.configure({
  node: 'paragraph',                // Type of trailing node
  notAfter: [],                     // Always add trailing node
})

// Features:
// - Ensures users can always escape from blocks
// - Adds paragraph at document end
// - Handles focus management
// - Provides consistent UX
```

## 🗂️ Extension Registry

The extension registry manages all extensions centrally:

```javascript
import { ExtensionRegistry } from '@/components/editor';

// Register a new extension
ExtensionRegistry.register('my-extension', MyExtension, 'custom', {
  config: { option: 'value' },
  dependencies: ['base-extension'],
  lazy: true,                       // Load on demand
  enabled: true,                    // Enable by default
});

// Load specific extensions
const extensions = await ExtensionRegistry.loadExtensions([
  'bold',
  'italic',
  'heading',
  'my-extension',
]);

// Get extension by name
const extension = ExtensionRegistry.get('bold');

// List extensions by category
const markExtensions = ExtensionRegistry.getByCategory('marks');

// Check if extension exists
const exists = ExtensionRegistry.has('my-extension');
```

## 🛠️ Creating Custom Extensions

### Node Extension Example

```javascript
import { Node } from '@tiptap/core';

const CustomBlock = Node.create({
  name: 'customBlock',
  
  group: 'block',
  content: 'block*',
  
  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },
  
  parseHTML() {
    return [
      { tag: 'div[data-type="custom-block"]' },
    ];
  },
  
  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      { 'data-type': 'custom-block', ...HTMLAttributes },
      0,
    ];
  },
  
  addCommands() {
    return {
      insertCustomBlock: () => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          content: [{
            type: 'paragraph',
          }],
        });
      },
    };
  },
  
  addKeyboardShortcuts() {
    return {
      'Mod-Shift-c': () => this.editor.commands.insertCustomBlock(),
    };
  },
});

export default CustomBlock;
```

### Mark Extension Example

```javascript
import { Mark } from '@tiptap/core';

const CustomMark = Mark.create({
  name: 'customMark',
  
  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },
  
  parseHTML() {
    return [
      { tag: 'span[data-type="custom-mark"]' },
    ];
  },
  
  renderHTML({ HTMLAttributes }) {
    return [
      'span',
      { 'data-type': 'custom-mark', ...HTMLAttributes },
      0,
    ];
  },
  
  addCommands() {
    return {
      setCustomMark: (attributes) => ({ commands }) => {
        return commands.setMark(this.name, attributes);
      },
      toggleCustomMark: (attributes) => ({ commands }) => {
        return commands.toggleMark(this.name, attributes);
      },
      unsetCustomMark: () => ({ commands }) => {
        return commands.unsetMark(this.name);
      },
    };
  },
  
  addKeyboardShortcuts() {
    return {
      'Mod-Shift-m': () => this.editor.commands.toggleCustomMark(),
    };
  },
});

export default CustomMark;
```

### Extension with React Component

```javascript
import { Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import CustomComponent from './CustomComponent';

const CustomNodeWithComponent = Node.create({
  name: 'customNodeWithComponent',
  
  group: 'block',
  atom: true,
  
  addAttributes() {
    return {
      data: {
        default: {},
      },
    };
  },
  
  parseHTML() {
    return [
      { tag: 'div[data-type="custom-node"]' },
    ];
  },
  
  renderHTML({ HTMLAttributes }) {
    return ['div', { 'data-type': 'custom-node', ...HTMLAttributes }];
  },
  
  addNodeView() {
    return ReactNodeViewRenderer(CustomComponent);
  },
  
  addCommands() {
    return {
      insertCustomNode: (data) => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: { data },
        });
      },
    };
  },
});

export default CustomNodeWithComponent;
```

## 📚 Extension Development Best Practices

### 1. Follow Naming Conventions
- Use camelCase for extension names
- Prefix custom extensions with your namespace
- Use descriptive names that indicate functionality

### 2. Handle Dependencies
- Declare dependencies explicitly
- Check for required extensions in `addOptions()`
- Provide fallbacks when dependencies are missing

### 3. Provide Configuration Options
- Use `addOptions()` for customizable behavior
- Provide sensible defaults
- Document all available options

### 4. Add Keyboard Shortcuts
- Follow platform conventions (Cmd on Mac, Ctrl on Windows)
- Avoid conflicts with existing shortcuts
- Provide alternative access methods

### 5. Include Commands
- Provide both toggle and set/unset commands for marks
- Use descriptive command names
- Return boolean to indicate success/failure

### 6. Test Thoroughly
- Test with different content structures
- Verify keyboard shortcuts work
- Test undo/redo functionality
- Check mobile compatibility
