# 🛠️ TipTap Editor Development Guide

Complete guide for developers working on the TipTap editor system, including architecture patterns, development workflows, and contribution guidelines.

## 📋 Table of Contents

- [Development Setup](#development-setup)
- [Architecture Patterns](#architecture-patterns)
- [Component Development](#component-development)
- [Extension Development](#extension-development)
- [Testing Guidelines](#testing-guidelines)
- [Performance Optimization](#performance-optimization)
- [Debugging Tips](#debugging-tips)

## 🚀 Development Setup

### Prerequisites
```bash
# Required versions
Node.js >= 18.0.0
Bun >= 1.0.0 (package manager)
Next.js >= 15.0.0
React >= 18.0.0
```

### Installation
```bash
# Install dependencies
bun install

# Start development server
bun run dev

# Run tests
bun run test

# Build for production
bun run build
```

### Development Environment
```bash
# Environment variables
NEXT_PUBLIC_EDITOR_DEBUG=true      # Enable debug mode
NEXT_PUBLIC_EDITOR_PERFORMANCE=true # Enable performance monitoring
```

## 🏗️ Architecture Patterns

### 1. Laravel-Inspired Service Pattern

```javascript
// services/EditorService.js
class EditorService {
  static async saveContent({ pageId, content, metadata }) {
    // Business logic here
    return await api.post('/content', { pageId, content, metadata });
  }
  
  static async loadContent(pageId) {
    return await api.get(`/content/${pageId}`);
  }
  
  static validateContent(content) {
    // Validation logic
    return { isValid: true, errors: [] };
  }
}
```

### 2. Hook-Based Architecture

```javascript
// hooks/useTiptapEditor.js
export const useTiptapEditor = (providedEditor) => {
  const [isReady, setIsReady] = useState(false);
  
  // Memoized utilities
  const utilities = useMemo(() => ({
    getHTML: () => providedEditor?.getHTML() || '',
    getJSON: () => providedEditor?.getJSON() || null,
    getText: () => providedEditor?.getText() || '',
    // ... more utilities
  }), [providedEditor]);
  
  return {
    editor: providedEditor,
    isReady,
    ...utilities,
  };
};
```

### 3. Context Provider Pattern

```javascript
// core/EditorProvider.jsx
export const EditorProvider = ({ children, ...props }) => {
  const [editors, setEditors] = useState(new Map());
  
  const contextValue = useMemo(() => ({
    editors,
    registerEditor: (id, editor) => {
      setEditors(prev => new Map(prev).set(id, editor));
    },
    unregisterEditor: (id) => {
      setEditors(prev => {
        const next = new Map(prev);
        next.delete(id);
        return next;
      });
    },
  }), [editors]);
  
  return (
    <EditorContext.Provider value={contextValue}>
      {children}
    </EditorContext.Provider>
  );
};
```

## 🧩 Component Development

### Component Structure Guidelines

```javascript
// ui/components/ExampleComponent.jsx
/**
 * 🎯 ExampleComponent - Brief description
 * 
 * Detailed explanation of what this component does,
 * how it fits into the editor system, and usage examples.
 */

import React, { useState, useCallback, useMemo } from 'react';
import { ComponentProps } from './types';

/**
 * ExampleComponent
 * 
 * @param {Object} props - Component props
 * @param {Object} props.editor - TipTap editor instance
 * @param {string} props.instanceId - Editor instance identifier
 * @param {Object} props.config - Component configuration
 * @param {Function} props.onAction - Action callback
 */
const ExampleComponent = ({ 
  editor, 
  instanceId, 
  config = {}, 
  onAction,
  className = '',
}) => {
  // State management
  const [isActive, setIsActive] = useState(false);
  
  // Memoized values
  const componentConfig = useMemo(() => ({
    ...DEFAULT_CONFIG,
    ...config,
  }), [config]);
  
  // Event handlers
  const handleAction = useCallback((action) => {
    // Handle action logic
    onAction?.(action, instanceId);
  }, [onAction, instanceId]);
  
  // Early return for invalid states
  if (!editor) return null;
  
  return (
    <div className={`example-component ${className}`}>
      {/* Component content */}
    </div>
  );
};

export default ExampleComponent;
```

### Props Validation

```javascript
import PropTypes from 'prop-types';

ExampleComponent.propTypes = {
  editor: PropTypes.object.isRequired,
  instanceId: PropTypes.string.isRequired,
  config: PropTypes.object,
  onAction: PropTypes.func,
  className: PropTypes.string,
};

ExampleComponent.defaultProps = {
  config: {},
  onAction: null,
  className: '',
};
```

### TypeScript Support (Optional)

```typescript
// types/editor.ts
export interface EditorComponentProps {
  editor: Editor;
  instanceId: string;
  config?: Record<string, any>;
  className?: string;
}

export interface EditorConfig {
  autofocus?: boolean;
  characterLimit?: number;
  placeholder?: {
    text: string;
    showOnlyWhenEditable?: boolean;
  };
}
```

## 🔌 Extension Development

### Extension Development Workflow

1. **Plan the Extension**
   - Define the purpose and functionality
   - Identify dependencies
   - Plan the user interface
   - Consider keyboard shortcuts

2. **Create Extension Structure**
   ```
   extensions/
   ├── my-extension/
   │   ├── index.js              # Main extension export
   │   ├── extension.js          # TipTap extension definition
   │   ├── component.jsx         # React component (if needed)
   │   ├── styles.css           # Extension-specific styles
   │   └── README.md            # Extension documentation
   ```

3. **Implement Extension**
   ```javascript
   // extensions/my-extension/extension.js
   import { Node } from '@tiptap/core';
   
   export const MyExtension = Node.create({
     name: 'myExtension',
     
     addOptions() {
       return {
         // Default options
       };
     },
     
     addCommands() {
       return {
         // Extension commands
       };
     },
     
     addKeyboardShortcuts() {
       return {
         // Keyboard shortcuts
       };
     },
   });
   ```

4. **Register Extension**
   ```javascript
   // Register in extension registry
   ExtensionRegistry.register('my-extension', MyExtension, 'custom', {
     config: { /* default config */ },
     dependencies: ['required-extension'],
   });
   ```

5. **Add to Slash Menu** (if applicable)
   ```javascript
   // ui/commands/index.js
   {
     title: "My Extension",
     subtitle: "Description of functionality",
     icon: <MyIcon className="w-5 h-5" />,
     keywords: ["my", "extension", "custom"],
     command: () => editor.chain().insertMyExtension().run(),
   }
   ```

### Extension Testing

```javascript
// __tests__/extensions/my-extension.test.js
import { createEditor } from '@tiptap/core';
import { MyExtension } from '../extensions/my-extension';

describe('MyExtension', () => {
  let editor;
  
  beforeEach(() => {
    editor = createEditor({
      extensions: [MyExtension],
    });
  });
  
  afterEach(() => {
    editor.destroy();
  });
  
  it('should insert extension content', () => {
    editor.commands.insertMyExtension();
    expect(editor.getHTML()).toContain('expected-content');
  });
  
  it('should handle keyboard shortcuts', () => {
    // Test keyboard shortcuts
  });
});
```

## 🧪 Testing Guidelines

### Unit Testing

```javascript
// __tests__/components/BubbleMenu.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import { createEditor } from '@tiptap/core';
import BubbleMenu from '../ui/BubbleMenu';

describe('BubbleMenu', () => {
  let editor;
  
  beforeEach(() => {
    editor = createEditor({
      content: '<p>Test content</p>',
    });
  });
  
  it('renders formatting buttons', () => {
    render(<BubbleMenu editor={editor} />);
    
    expect(screen.getByTitle(/bold/i)).toBeInTheDocument();
    expect(screen.getByTitle(/italic/i)).toBeInTheDocument();
  });
  
  it('applies formatting when clicked', () => {
    render(<BubbleMenu editor={editor} />);
    
    fireEvent.click(screen.getByTitle(/bold/i));
    expect(editor.isActive('bold')).toBe(true);
  });
});
```

### Integration Testing

```javascript
// __tests__/integration/editor.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import { CompleteEditor } from '../index';

describe('CompleteEditor Integration', () => {
  it('should handle slash commands', async () => {
    render(<CompleteEditor instanceId="test" />);
    
    const editor = screen.getByRole('textbox');
    
    // Type slash command
    fireEvent.input(editor, { target: { textContent: '/' } });
    
    // Wait for slash menu
    await screen.findByText('Heading 1');
    
    // Select command
    fireEvent.click(screen.getByText('Heading 1'));
    
    // Verify result
    expect(editor).toHaveTextContent('');
  });
});
```

### E2E Testing (Playwright)

```javascript
// e2e/editor.spec.js
import { test, expect } from '@playwright/test';

test('editor basic functionality', async ({ page }) => {
  await page.goto('/editor');
  
  // Wait for editor to load
  await page.waitForSelector('[data-testid="editor"]');
  
  // Type content
  await page.fill('[data-testid="editor"]', 'Hello world');
  
  // Test slash command
  await page.type('[data-testid="editor"]', '/');
  await page.waitForSelector('[data-testid="slash-menu"]');
  
  // Select heading
  await page.click('text=Heading 1');
  
  // Verify heading was created
  await expect(page.locator('h1')).toBeVisible();
});
```

## ⚡ Performance Optimization

### 1. Memoization Strategies

```javascript
// Memoize expensive calculations
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(props);
}, [props.dependency1, props.dependency2]);

// Memoize event handlers
const handleClick = useCallback((event) => {
  // Handle click
}, [dependency]);

// Memoize components
const MemoizedComponent = React.memo(Component, (prevProps, nextProps) => {
  return prevProps.editor === nextProps.editor;
});
```

### 2. Lazy Loading

```javascript
// Lazy load heavy components
const SlashMenu = lazy(() => import('./ui/menus/SlashMenu'));
const ColorPicker = lazy(() => import('./ui/ColorPickerPanel'));

// Use with Suspense
<Suspense fallback={<LoadingSpinner />}>
  <SlashMenu editor={editor} />
</Suspense>
```

### 3. Debouncing

```javascript
// Debounce expensive operations
const debouncedSave = useMemo(
  () => debounce((content) => {
    EditorService.saveContent(content);
  }, 2000),
  []
);

useEffect(() => {
  if (editor) {
    editor.on('update', ({ editor }) => {
      debouncedSave(editor.getJSON());
    });
  }
}, [editor, debouncedSave]);
```

## 🐛 Debugging Tips

### 1. Enable Debug Mode

```javascript
// Add to development environment
if (process.env.NODE_ENV === 'development') {
  window.editor = editor; // Access editor in console
  window.EditorService = EditorService; // Access service methods
}
```

### 2. Editor State Inspection

```javascript
// Inspect editor state
console.log('Editor HTML:', editor.getHTML());
console.log('Editor JSON:', editor.getJSON());
console.log('Editor Selection:', editor.state.selection);
console.log('Active Marks:', editor.getAttributes());
```

### 3. Extension Debugging

```javascript
// Debug extension loading
ExtensionRegistry.on('register', (name, extension) => {
  console.log(`Registered extension: ${name}`, extension);
});

ExtensionRegistry.on('load', (extensions) => {
  console.log('Loaded extensions:', extensions);
});
```

### 4. Performance Monitoring

```javascript
// Monitor render performance
const ProfiledComponent = React.Profiler(
  'EditorComponent',
  (id, phase, actualDuration) => {
    console.log(`${id} ${phase} took ${actualDuration}ms`);
  }
)(EditorComponent);
```

## 📝 Code Style Guidelines

### 1. File Organization
- One component per file
- Co-locate related files (styles, tests)
- Use descriptive file names
- Follow consistent naming conventions

### 2. Import Organization
```javascript
// 1. React imports
import React, { useState, useEffect } from 'react';

// 2. Third-party imports
import { Editor } from '@tiptap/react';
import { Bold, Italic } from 'lucide-react';

// 3. Internal imports
import { EditorService } from '../services';
import { useTiptapEditor } from '../hooks';

// 4. Relative imports
import './Component.css';
```

### 3. Component Structure
```javascript
// 1. Component definition and props
const Component = ({ prop1, prop2 }) => {
  // 2. Hooks (useState, useEffect, etc.)
  const [state, setState] = useState();
  
  // 3. Memoized values
  const memoizedValue = useMemo(() => {}, []);
  
  // 4. Event handlers
  const handleEvent = useCallback(() => {}, []);
  
  // 5. Effects
  useEffect(() => {}, []);
  
  // 6. Early returns
  if (!prop1) return null;
  
  // 7. Render
  return <div>Component content</div>;
};
```

### 4. Documentation Standards
- Use JSDoc for all functions and components
- Include usage examples in comments
- Document complex logic with inline comments
- Keep README files up to date

## 🤝 Contribution Guidelines

### 1. Development Workflow
1. Create feature branch from `main`
2. Implement changes with tests
3. Update documentation
4. Submit pull request
5. Address review feedback
6. Merge after approval

### 2. Commit Message Format
```
type(scope): description

feat(editor): add table support
fix(bubble-menu): resolve positioning issue
docs(readme): update installation instructions
test(extensions): add toggle extension tests
```

### 3. Pull Request Template
- Clear description of changes
- Link to related issues
- Screenshots for UI changes
- Test coverage information
- Breaking change notes
