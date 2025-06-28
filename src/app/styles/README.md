# Styles Organization

This directory contains the organized CSS files for the application. The styles are logically grouped into separate files to maintain better organization and easier maintenance.

## File Structure

### `globals.css` (Entry Point)
The main entry file that imports all other style files. This file is kept lightweight and only contains imports.

### Core Style Files

#### `theme.css`
- CSS custom properties and color schemes
- Theme variables for light and dark modes
- Color tokens for UI components
- Radius and spacing variables

#### `base.css`
- Base layer styles and CSS resets
- Global element styling
- Sidebar-specific variables (legacy support)

#### `utilities.css`
- Custom utility classes
- Reusable component classes like `.bubble-btn`
- Application-specific utility styles

#### `scrollbar.css`
- Global scrollbar styling for all browsers
- WebKit scrollbar customization
- Firefox and IE scrollbar support
- ScrollArea component integration

#### `toast.css`
- Complete toast notification system styles
- Toast animations and transitions
- Different toast types (success, error, warning, info)
- Mobile responsive adjustments
- Close button styling

#### `editor.css`
- Editor-specific styles (existing file)
- Rich text editor customizations

## Benefits of This Organization

1. **Maintainability**: Each file has a specific purpose, making it easier to find and modify styles
2. **Performance**: Styles can be loaded conditionally if needed in the future
3. **Collaboration**: Team members can work on different style categories without conflicts
4. **Debugging**: Easier to identify which file contains specific styles
5. **Modularity**: Individual style modules can be reused or removed as needed

## Adding New Styles

When adding new styles:

1. **Theme-related**: Add to `theme.css`
2. **Global utilities**: Add to `utilities.css`
3. **Scrolling behavior**: Add to `scrollbar.css`
4. **Toast notifications**: Add to `toast.css`
5. **Base element styling**: Add to `base.css`
6. **New categories**: Create a new file and import it in `globals.css`

## Import Order

The import order in `globals.css` is important:
1. Framework imports (Tailwind, animations)
2. Feature-specific styles (editor, theme, base)
3. Component-specific styles (utilities, scrollbar, toast)

This ensures proper CSS cascade and prevents style conflicts.
