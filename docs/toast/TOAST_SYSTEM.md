# Enhanced Toast Notification System

A modern, beautiful toast notification system built on top of Sonner with custom styling, animations, and enhanced functionality.

## Features

- ✨ **Modern Design**: Clean, beautiful design that matches the app theme
- 🎨 **Multiple Types**: Success, Error, Warning, Info, and Loading toasts
- 🎭 **Smooth Animations**: Slide-in/fade-in and slide-out/fade-out animations
- 📱 **Mobile Responsive**: Optimized for mobile devices with proper positioning
- 🎯 **Auto-dismiss**: Configurable auto-dismiss timeout (default: 4.5 seconds)
- 🔄 **Stacking**: Support for multiple toasts with proper stacking
- ❌ **Close Button**: Manual dismiss with close button
- 🎪 **Custom Icons**: Lucide React icons for each toast type
- 🌙 **Theme Support**: Automatic light/dark theme integration

## Quick Start

### Basic Usage

```jsx
import { useToast } from "@/hooks/useToast";

function MyComponent() {
  const toast = useToast();

  const handleSuccess = () => {
    toast.success("Success!", "Your action was completed successfully.");
  };

  const handleError = () => {
    toast.error("Error!", "Something went wrong. Please try again.");
  };

  return (
    <div>
      <button onClick={handleSuccess}>Show Success</button>
      <button onClick={handleError}>Show Error</button>
    </div>
  );
}
```

### Direct Import

```jsx
import { toastSuccess, toastError } from "@/lib/toast";

// Simple usage
toastSuccess("Success!", "Operation completed");
toastError("Error!", "Something went wrong");
```

## Toast Types

### Success Toast
```jsx
toast.success("Success!", "Your changes have been saved.");
```

### Error Toast
```jsx
toast.error("Error!", "Failed to save changes. Please try again.");
```

### Warning Toast
```jsx
toast.warning("Warning!", "Please review your input before proceeding.");
```

### Info Toast
```jsx
toast.info("Info", "Here's some helpful information.");
```

### Loading Toast
```jsx
const loadingToastId = toast.loading("Loading", "Processing your request...");
// Later dismiss it
toast.dismiss(loadingToastId);
```

## Convenience Methods

The `useToast` hook provides pre-configured methods for common use cases:

```jsx
// Form operations
toast.showFormSuccess("Profile updated successfully!");
toast.showFormError("Please fill in all required fields");
toast.showValidationError("Email format is invalid");

// CRUD operations
toast.showCreateSuccess("Project");
toast.showUpdateSuccess("Document");
toast.showDeleteSuccess("User");

// Network operations
toast.showNetworkError("Failed to connect to server");
```

## Advanced Features

### Promise Handling
```jsx
const saveData = async () => {
  // Your async operation
  return fetch('/api/save', { method: 'POST' });
};

toast.promise(saveData(), {
  loading: "Saving...",
  success: "Data saved successfully!",
  error: "Failed to save data",
});
```

### Async Operations with Loading States
```jsx
const handleAsyncOperation = async () => {
  try {
    await toast.handleAsync(
      () => fetch('/api/data').then(res => res.json()),
      {
        loadingMessage: "Fetching data...",
        successMessage: "Data loaded successfully!",
        errorMessage: "Failed to load data",
      }
    );
  } catch (error) {
    console.error("Operation failed:", error);
  }
};
```

### Custom Options
```jsx
toast.success("Custom Toast", "This toast has custom options", {
  duration: 10000, // 10 seconds
  position: "bottom-right",
  // Add custom styling or behavior
});
```

## Integration with Forms

The toast system is automatically integrated with the `useServerFormAction` hook:

```jsx
const { register, formAction, isPending } = useServerFormAction({
  schema: MySchema,
  actionFn: myServerAction,
  defaultValues: {},
  successToast: {
    title: "Success!",
    description: "Form submitted successfully",
  },
  errorToast: {
    title: "Error",
    description: "Please check your input",
  },
});
```

## Styling and Theming

The toast system automatically adapts to your app's theme:

- **Light Mode**: Clean white background with subtle shadows
- **Dark Mode**: Dark background with appropriate contrast
- **Colors**: 
  - Success: Green theme
  - Error: Red theme  
  - Warning: Orange theme
  - Info: Blue theme

### Custom CSS Variables

The system uses CSS variables that can be customized:

```css
:root {
  --success-bg: hsl(142.1 76.2% 36.3%);
  --success-text: hsl(355.7 100% 97.3%);
  --error-bg: hsl(0 84.2% 60.2%);
  --error-text: hsl(0 0% 98%);
  /* ... more variables */
}
```

## Mobile Responsiveness

On mobile devices (< 640px):
- Toasts span the full width with margins
- Animation changes from horizontal slide to vertical slide
- Positioning adjusts for better mobile UX

## API Reference

### useToast Hook

```jsx
const {
  // Core methods
  success,
  error,
  warning,
  info,
  loading,
  promise,
  custom,
  dismiss,
  dismissAll,
  
  // Convenience methods
  showFormSuccess,
  showFormError,
  showNetworkError,
  showValidationError,
  showDeleteSuccess,
  showCreateSuccess,
  showUpdateSuccess,
  
  // Utility methods
  handleAsync,
} = useToast();
```

### Direct Functions

```jsx
import {
  toastSuccess,
  toastError,
  toastWarning,
  toastInfo,
  toastLoading,
  toastPromise,
  toastCustom,
  dismissToast,
  dismissAllToasts,
} from "@/lib/toast";
```

## Demo

Visit `/toast-demo` to see all toast types and features in action.

## Best Practices

1. **Use appropriate types**: Match the toast type to the message context
2. **Keep messages concise**: Use clear, actionable messages
3. **Provide context**: Include helpful descriptions when needed
4. **Handle errors gracefully**: Always show user-friendly error messages
5. **Use convenience methods**: Leverage pre-configured methods for common cases
6. **Test on mobile**: Ensure toasts work well on all screen sizes

## Migration from Basic Sonner

If you're migrating from basic Sonner usage:

```jsx
// Old way
import { toast } from "sonner";
toast.success("Success", { description: "It worked!" });

// New way
import { useToast } from "@/hooks/useToast";
const toast = useToast();
toast.success("Success", "It worked!");
```

The new system provides better TypeScript support, consistent styling, and enhanced functionality while maintaining backward compatibility.
