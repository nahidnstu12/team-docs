# Migration Guide: TipTap Editor Restructuring

This guide helps you migrate from the old scattered TipTap editor implementation to the new modular architecture.

## 🔄 Overview of Changes

### Old Structure
```
src/
├── app/(home)/projects/[slug]/editor/
│   ├── components/RTEeditor.jsx
│   ├── components/SlashCommandMenu.jsx
│   ├── components/LinkDialog.jsx
│   ├── hooks/useSlashCommand.js
│   └── utils/base-commands.js
├── components/editor/ui/
│   ├── BubbleMenu.jsx
│   ├── Toolbar.jsx
│   └── ColorPickerPanel.jsx
├── lib/editor-extensions/
│   └── editor-extensions.js
└── hooks/use-tiptap-editor.js
```

### New Structure
```
src/components/editor/
├── core/                    # Core functionality
├── extensions/             # Extension system
├── ui/menus/              # Menu components
├── hooks/                 # Editor hooks
├── services/              # Business logic
└── utils/                 # Utilities
```

## 📋 Migration Steps

### Step 1: Update Imports

#### Before (Old Imports)
```jsx
// Old imports
import RTEeditor from "@/app/(home)/projects/[slug]/editor/components/RTEeditor";
import BubbleMenu from "@/components/editor/ui/BubbleMenu";
import { editorExtensions } from "@/lib/editor-extensions/editor-extensions";
import { useTiptapEditor } from "@/hooks/use-tiptap-editor";
```

#### After (New Imports)
```jsx
// New imports
import { CompleteEditor, EditorProvider, Editor } from "@/components/editor";
import { BubbleMenu, SlashMenu } from "@/components/editor";
import { ExtensionRegistry } from "@/components/editor";
import { useTiptapEditor, useEditorContent } from "@/components/editor";
```

### Step 2: Replace RTEeditor Component

#### Before
```jsx
// Old RTEeditor usage
<RTEeditor pageId={selectedPage} />
```

#### After
```jsx
// New editor usage - Option 1: Complete Editor
<CompleteEditor
  instanceId={`editor-${selectedPage}`}
  pageId={selectedPage}
  onSave={async (content) => {
    const result = await savePageContent({ pageId: selectedPage, content });
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  }}
  config={{
    placeholder: { text: "Type '/' for commands..." },
    characterLimit: 10000,
  }}
/>

// Option 2: Custom setup with provider
<EditorProvider autoSave={true}>
  <Editor instanceId={`editor-${selectedPage}`}>
    <BubbleMenu />
    <SlashMenu />
  </Editor>
</EditorProvider>
```

### Step 3: Update Extension Configuration

#### Before
```jsx
// Old extension setup
import { editorExtensions } from "@/lib/editor-extensions/editor-extensions";

const editor = useEditor({
  extensions: editorExtensions,
  // ... other config
});
```

#### After
```jsx
// New extension setup (handled automatically)
import { ExtensionRegistry } from "@/components/editor";

// Extensions are loaded automatically, but you can customize:
const customExtensions = await ExtensionRegistry.loadExtensions([
  "bold", "italic", "heading", "custom-link"
]);

// Or register new extensions:
ExtensionRegistry.register("my-extension", MyExtension, "custom");
```

### Step 4: Update Slash Command Integration

#### Before
```jsx
// Old slash command setup
import SlashCommandMenu from "./SlashCommandMenu";
import { useSlashCommand } from "../hooks/useSlashCommand";

// Manual integration required
```

#### After
```jsx
// New slash command setup (automatic)
import { SlashMenu } from "@/components/editor";

// Just include in editor children - no manual setup needed
<Editor instanceId="my-editor">
  <SlashMenu />
</Editor>
```

### Step 5: Update Content Management

#### Before
```jsx
// Old content management
const [pageContent, setPageContent] = useState(null);
const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  async function getPageContent() {
    const res = await fetchPageContent(pageId);
    setPageContent(res.content);
    setIsLoading(false);
  }
  getPageContent();
}, [pageId]);

const handleSubmit = useCallback(async () => {
  const content = editor.getJSON();
  const result = await savePageContent({ pageId, content });
  // Handle result...
}, [editor, pageId]);
```

#### After
```jsx
// New content management
import { useEditorContent } from "@/components/editor";

const {
  content,
  isLoading,
  isSaving,
  hasUnsavedChanges,
  saveContent,
  loadContent,
} = useEditorContent({
  pageId,
  autoSave: true,
  onSave: (content, pageId) => {
    toast.success("Content saved successfully");
  },
  onError: (error) => {
    toast.error("Failed to save content");
  },
});
```

### Step 6: Update Service Layer Integration

#### Before
```jsx
// Old direct action calls
import { savePageContent } from "../actions/savePageContent";
import { fetchPageContent } from "../actions/fetchPageContent";

const result = await savePageContent({ pageId, content });
```

#### After
```jsx
// New service layer
import { EditorService } from "@/components/editor";

const result = await EditorService.saveContent({
  pageId,
  content,
  metadata: { lastModified: new Date() },
});
```

## 🔧 Configuration Migration

### Editor Configuration

#### Before
```jsx
// Old configuration scattered across component
const editor = useEditor({
  immediatelyRender: false,
  extensions: editorExtensions,
  autofocus: true,
  content: pageContent,
  editorProps: {
    attributes: {
      class: "focus:outline-none max-w-none",
    },
    editable: () => !isPreviewMode,
  },
});
```

#### After
```jsx
// New centralized configuration
import { DEFAULT_EDITOR_CONFIG } from "@/components/editor";

const editorConfig = {
  ...DEFAULT_EDITOR_CONFIG,
  autofocus: true,
  characterLimit: 10000,
  placeholder: {
    text: "Type '/' for commands...",
  },
  editorProps: {
    attributes: {
      class: "focus:outline-none max-w-none prose prose-lg",
    },
    editable: () => !isPreviewMode,
  },
};

<CompleteEditor config={editorConfig} />
```

## 🎯 Feature Mapping

### Component Mapping

| Old Component | New Component | Notes |
|---------------|---------------|-------|
| `RTEeditor` | `CompleteEditor` or `Editor` | More modular, configurable |
| `SlashCommandMenu` | `SlashMenu` | Enhanced with better UX |
| `BubbleMenu` | `BubbleMenu` | Improved with more options |
| `LinkDialog` | Built into `SlashMenu` | Integrated experience |

### Hook Mapping

| Old Hook | New Hook | Notes |
|----------|----------|-------|
| `useTiptapEditor` | `useTiptapEditor` | Enhanced with utilities |
| `useSlashCommand` | `useSlashCommand` | Improved navigation |
| N/A | `useEditorContent` | New content management |
| N/A | `useEditorContext` | New context system |

### Service Mapping

| Old Pattern | New Service | Notes |
|-------------|-------------|-------|
| Direct action calls | `EditorService` | Centralized business logic |
| Manual validation | `EditorService.validateContent` | Built-in validation |
| Manual stats | `EditorService.getContentStats` | Automatic statistics |

## ⚠️ Breaking Changes

### 1. Import Paths
All editor-related imports now come from `@/components/editor`

### 2. Component Props
- `RTEeditor` props have changed to `Editor` props
- New required `instanceId` prop for multi-editor support
- Configuration moved to `config` prop

### 3. Extension System
- Extensions are now managed by `ExtensionRegistry`
- Custom extensions need to be registered
- Lazy loading is now default

### 4. Content Management
- Auto-save is now built-in and configurable
- Content validation is automatic
- State management is handled by hooks

## 🚀 Benefits After Migration

### 1. Better Organization
- Clear separation of concerns
- Modular architecture
- Easier to maintain and extend

### 2. Enhanced Features
- Better auto-save with debouncing
- Improved keyboard navigation
- Enhanced accessibility
- Better error handling

### 3. Performance Improvements
- Lazy loading of components
- Code splitting
- Optimized re-renders
- Better memory management

### 4. Developer Experience
- Better TypeScript support
- Comprehensive documentation
- Easier testing
- Consistent patterns

## 🧪 Testing Migration

### Before Migration
```jsx
// Test old component
import RTEeditor from "@/app/(home)/projects/[slug]/editor/components/RTEeditor";

test("renders editor", () => {
  render(<RTEeditor pageId="test-page" />);
  // Test implementation...
});
```

### After Migration
```jsx
// Test new component
import { CompleteEditor } from "@/components/editor";

test("renders editor", () => {
  render(
    <CompleteEditor
      instanceId="test-editor"
      pageId="test-page"
      config={{ placeholder: { text: "Test placeholder" } }}
    />
  );
  // Test implementation...
});
```

## 📝 Checklist

- [ ] Update all imports to use new paths
- [ ] Replace `RTEeditor` with `CompleteEditor` or `Editor`
- [ ] Update extension configuration
- [ ] Migrate content management to new hooks
- [ ] Update service layer calls
- [ ] Test all editor functionality
- [ ] Update tests to use new components
- [ ] Remove old editor files (after verification)

## 🆘 Troubleshooting

### Common Issues

1. **Import Errors**
   - Ensure all imports use the new `@/components/editor` path
   - Check for typos in component names

2. **Extension Not Loading**
   - Verify extension is registered with `ExtensionRegistry`
   - Check extension dependencies

3. **Auto-save Not Working**
   - Ensure `EditorProvider` has `autoSave={true}`
   - Check `onSave` callback is provided

4. **Styling Issues**
   - Update CSS classes to use new structure
   - Check Tailwind classes are applied correctly

### Getting Help

If you encounter issues during migration:

1. Check the [README.md](./README.md) for detailed documentation
2. Look at the example implementations
3. Check the console for error messages
4. Verify all dependencies are installed

## 🎉 Post-Migration

After successful migration:

1. Remove old editor files
2. Update documentation
3. Train team on new patterns
4. Consider adding new features enabled by the modular architecture
