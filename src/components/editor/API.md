# TipTap Editor API Reference

Complete API documentation for the modular TipTap editor system.

## 📚 Table of Contents

- [Core Components](#core-components)
- [Hooks](#hooks)
- [Services](#services)
- [Configuration](#configuration)
- [Extension System](#extension-system)
- [Utilities](#utilities)

## 🏗️ Core Components

### CompleteEditor

Pre-configured editor with all features enabled.

```jsx
import { CompleteEditor } from "@/components/editor";

<CompleteEditor
  instanceId="my-editor"
  pageId="page-123"
  initialContent={content}
  onSave={handleSave}
  onChange={handleChange}
  config={editorConfig}
  className="my-editor"
  editable={true}
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `instanceId` | `string` | `"default"` | Unique identifier for the editor instance |
| `pageId` | `string` | - | Page identifier for content persistence |
| `initialContent` | `Object` | `null` | Initial TipTap JSON content |
| `onSave` | `Function` | - | Callback when content is saved |
| `onChange` | `Function` | - | Callback when content changes |
| `onFocus` | `Function` | - | Callback when editor gains focus |
| `onBlur` | `Function` | - | Callback when editor loses focus |
| `config` | `Object` | `{}` | Editor configuration overrides |
| `className` | `string` | `""` | Additional CSS classes |
| `editable` | `boolean` | `true` | Whether the editor is editable |

### Editor

Core editor component for custom setups.

```jsx
import { Editor, EditorProvider } from "@/components/editor";

<EditorProvider>
  <Editor instanceId="custom-editor">
    {/* Custom menus and toolbars */}
  </Editor>
</EditorProvider>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `instanceId` | `string` | **Required** | Unique identifier for the editor instance |
| `initialContent` | `Object` | `null` | Initial TipTap JSON content |
| `extensions` | `Array` | `[]` | Additional extensions to load |
| `config` | `Object` | `{}` | Editor configuration overrides |
| `onSave` | `Function` | - | Save callback function |
| `onChange` | `Function` | - | Change callback function |
| `children` | `ReactNode` | - | Child components (menus, toolbars, etc.) |

### EditorProvider

Context provider for managing multiple editor instances.

```jsx
import { EditorProvider } from "@/components/editor";

<EditorProvider
  config={globalConfig}
  onSave={globalSaveHandler}
  autoSave={true}
  autoSaveDelay={2000}
>
  {/* Editor components */}
</EditorProvider>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `config` | `Object` | `{}` | Global editor configuration |
| `onSave` | `Function` | - | Global save callback |
| `onLoad` | `Function` | - | Global load callback |
| `onChange` | `Function` | - | Global change callback |
| `autoSave` | `boolean` | `true` | Enable auto-save functionality |
| `autoSaveDelay` | `number` | `2000` | Auto-save delay in milliseconds |
| `children` | `ReactNode` | **Required** | Child components |

## 🎣 Hooks

### useEditorContext

Access the global editor context.

```jsx
import { useEditorContext } from "@/components/editor";

const {
  config,
  registerEditor,
  unregisterEditor,
  getEditor,
  saveEditor,
  saveAllEditors,
  loadContent,
  clearContent,
  focusEditor,
  editors,
  isLoading,
  isSaving,
  hasUnsavedChanges,
  lastSaved,
  editorCount,
} = useEditorContext();
```

#### Returns

| Property | Type | Description |
|----------|------|-------------|
| `config` | `Object` | Merged editor configuration |
| `registerEditor` | `Function` | Register an editor instance |
| `unregisterEditor` | `Function` | Unregister an editor instance |
| `getEditor` | `Function` | Get editor instance by ID |
| `saveEditor` | `Function` | Save specific editor instance |
| `saveAllEditors` | `Function` | Save all registered editors |
| `loadContent` | `Function` | Load content into editor |
| `clearContent` | `Function` | Clear editor content |
| `focusEditor` | `Function` | Focus specific editor |
| `editors` | `Array` | List of registered editor IDs |
| `isLoading` | `boolean` | Global loading state |
| `isSaving` | `boolean` | Global saving state |
| `hasUnsavedChanges` | `boolean` | Whether any editor has unsaved changes |
| `lastSaved` | `Date` | Last save timestamp |
| `editorCount` | `number` | Number of registered editors |

### useEditorInstance

Work with a specific editor instance.

```jsx
import { useEditorInstance } from "@/components/editor";

const {
  editor,
  isRegistered,
  save,
  loadContent,
  clearContent,
  focus,
} = useEditorInstance("my-editor-id");
```

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `instanceId` | `string` | Editor instance identifier |

#### Returns

| Property | Type | Description |
|----------|------|-------------|
| `editor` | `Object` | TipTap editor instance |
| `isRegistered` | `boolean` | Whether editor is registered |
| `save` | `Function` | Save this editor's content |
| `loadContent` | `Function` | Load content into this editor |
| `clearContent` | `Function` | Clear this editor's content |
| `focus` | `Function` | Focus this editor |

### useEditorContent

Manage content loading, saving, and state.

```jsx
import { useEditorContent } from "@/components/editor";

const {
  content,
  isLoading,
  isSaving,
  hasUnsavedChanges,
  lastSaved,
  error,
  metadata,
  loadContent,
  saveContent,
  updateContent,
  clearContent,
  resetContent,
  getContentStats,
  validateContent,
  isReady,
  isEmpty,
} = useEditorContent({
  pageId: "page-123",
  autoSave: true,
  onSave: handleSave,
  onError: handleError,
});
```

#### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `pageId` | `string` | - | Page identifier for content |
| `initialContent` | `Object` | `null` | Initial content to load |
| `autoSave` | `boolean` | `true` | Enable auto-save |
| `autoSaveDelay` | `number` | `2000` | Auto-save delay in ms |
| `onSave` | `Function` | - | Save callback |
| `onLoad` | `Function` | - | Load callback |
| `onError` | `Function` | - | Error callback |

### useTiptapEditor

Enhanced TipTap editor hook with utilities.

```jsx
import { useTiptapEditor } from "@/components/editor";

const {
  editor,
  isReady,
  isEmpty,
  wordCount,
  characterCount,
  canUndo,
  canRedo,
  getHTML,
  getJSON,
  getText,
  focus,
  blur,
  setContent,
  clearContent,
  // ... more utilities
} = useTiptapEditor(providedEditor);
```

## 🛠️ Services

### EditorService

Laravel-like service for editor business logic.

```jsx
import { EditorService } from "@/components/editor";
```

#### Methods

##### saveContent(params)

Save editor content to server.

```jsx
const result = await EditorService.saveContent({
  pageId: "page-123",
  content: editorContent,
  metadata: { tags: ["important"] },
});
```

**Parameters:**
- `pageId` (string): Page identifier
- `content` (Object): TipTap JSON content
- `metadata` (Object): Additional metadata

**Returns:** `Promise<Object>` - Save result with success status

##### loadContent(pageId)

Load content from server.

```jsx
const result = await EditorService.loadContent("page-123");
```

**Parameters:**
- `pageId` (string): Page identifier

**Returns:** `Promise<Object>` - Load result with content and metadata

##### validateContent(content)

Validate content structure and safety.

```jsx
const validation = EditorService.validateContent(content);
// { isValid: boolean, errors: string[] }
```

##### getContentStats(content)

Get content statistics.

```jsx
const stats = EditorService.getContentStats(content);
// { wordCount, characterCount, paragraphCount, ... }
```

##### extractTextFromContent(content)

Extract plain text from TipTap JSON.

```jsx
const text = EditorService.extractTextFromContent(content);
```

## ⚙️ Configuration

### DEFAULT_EDITOR_CONFIG

Default configuration object.

```jsx
import { DEFAULT_EDITOR_CONFIG } from "@/components/editor";

const customConfig = {
  ...DEFAULT_EDITOR_CONFIG,
  characterLimit: 5000,
  placeholder: {
    text: "Custom placeholder...",
  },
};
```

### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `autofocus` | `boolean` | `true` | Auto-focus editor on mount |
| `characterLimit` | `number` | `10000` | Maximum character limit |
| `placeholder.text` | `string` | `"Type '/' for commands..."` | Placeholder text |
| `autoSave.enabled` | `boolean` | `true` | Enable auto-save |
| `autoSave.delay` | `number` | `2000` | Auto-save delay in ms |
| `editorProps.attributes.class` | `string` | `"focus:outline-none max-w-none"` | Editor CSS classes |

## 🔌 Extension System

### ExtensionRegistry

Manage TipTap extensions.

```jsx
import { ExtensionRegistry } from "@/components/editor";
```

#### Methods

##### register(name, extension, category, options)

Register a new extension.

```jsx
ExtensionRegistry.register("my-extension", MyExtension, "custom", {
  config: { option: "value" },
  dependencies: ["base-extension"],
});
```

##### loadExtension(name)

Load a specific extension.

```jsx
const extension = await ExtensionRegistry.loadExtension("my-extension");
```

##### getBaseExtensions()

Get all base extensions.

```jsx
const extensions = await ExtensionRegistry.getBaseExtensions();
```

## 🔧 Utilities

### EditorUtils

Utility functions for editor content.

```jsx
import { EditorUtils } from "@/components/editor";
```

#### Methods

##### createEmptyDocument()

Create an empty TipTap document.

```jsx
const emptyDoc = EditorUtils.createEmptyDocument();
```

##### createTextDocument(text)

Create a document with text content.

```jsx
const textDoc = EditorUtils.createTextDocument("Hello world");
```

##### extractText(doc)

Extract plain text from document.

```jsx
const text = EditorUtils.extractText(document);
```

##### getStats(doc)

Get document statistics.

```jsx
const stats = EditorUtils.getStats(document);
```

##### validate(doc)

Validate document structure.

```jsx
const validation = EditorUtils.validate(document);
```

## 📝 Type Definitions

### Content Types

```typescript
interface TipTapContent {
  type: string;
  content?: TipTapContent[];
  text?: string;
  marks?: Mark[];
  attrs?: Record<string, any>;
}

interface EditorConfig {
  autofocus?: boolean;
  characterLimit?: number;
  placeholder?: {
    text?: string;
    showOnlyWhenEditable?: boolean;
  };
  autoSave?: {
    enabled?: boolean;
    delay?: number;
  };
  editorProps?: {
    attributes?: Record<string, string>;
    editable?: () => boolean;
  };
}
```

### Event Types

```typescript
type SaveCallback = (content: TipTapContent, instanceId: string) => Promise<void>;
type ChangeCallback = (content: TipTapContent, instanceId: string) => void;
type ErrorCallback = (error: Error, operation: string) => void;
```

---

*For more examples and advanced usage, see the [README.md](./README.md) and [examples directory](./examples/).*
