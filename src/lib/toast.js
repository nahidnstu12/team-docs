"use client";

import { toast as sonnerToast } from "sonner";
import { CheckCircle, XCircle, AlertTriangle, Info } from "lucide-react";

/**
 * Enhanced toast utility with modern design and animations
 * Built on top of Sonner with custom styling and icons
 */

// Default configuration
const DEFAULT_DURATION = 4500;
const DEFAULT_POSITION = "top-right";

/**
 * Create a custom toast with icon and enhanced styling
 * @param {string} type - Toast type (success, error, warning, info)
 * @param {string} title - Toast title
 * @param {string} description - Toast description (optional)
 * @param {Object} options - Additional options
 */
const createToast = (type, title, description, options = {}) => {
  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertTriangle,
    info: Info,
  };

  const Icon = icons[type];

  const toastOptions = {
    duration: options.duration || DEFAULT_DURATION,
    position: options.position || DEFAULT_POSITION,
    dismissible: true,
    closeButton: true,
    ...options,
    icon: Icon ? <Icon className="w-5 h-5" /> : undefined,
  };

  // Use the appropriate sonner method based on type
  switch (type) {
    case "success":
      return sonnerToast.success(title, {
        description,
        ...toastOptions,
      });
    case "error":
      return sonnerToast.error(title, {
        description,
        ...toastOptions,
      });
    case "warning":
      return sonnerToast.warning(title, {
        description,
        ...toastOptions,
      });
    case "info":
      return sonnerToast.info(title, {
        description,
        ...toastOptions,
      });
    default:
      return sonnerToast(title, {
        description,
        ...toastOptions,
      });
  }
};

/**
 * Success toast - Green theme with checkmark icon
 * @param {string} title - Toast title
 * @param {string} description - Toast description (optional)
 * @param {Object} options - Additional options
 */
export const toastSuccess = (title, description, options = {}) => {
  return createToast("success", title, description, options);
};

/**
 * Error toast - Red theme with X icon
 * @param {string} title - Toast title
 * @param {string} description - Toast description (optional)
 * @param {Object} options - Additional options
 */
export const toastError = (title, description, options = {}) => {
  return createToast("error", title, description, options);
};

/**
 * Warning toast - Orange theme with warning icon
 * @param {string} title - Toast title
 * @param {string} description - Toast description (optional)
 * @param {Object} options - Additional options
 */
export const toastWarning = (title, description, options = {}) => {
  return createToast("warning", title, description, options);
};

/**
 * Info toast - Blue theme with info icon
 * @param {string} title - Toast title
 * @param {string} description - Toast description (optional)
 * @param {Object} options - Additional options
 */
export const toastInfo = (title, description, options = {}) => {
  return createToast("info", title, description, options);
};

/**
 * Loading toast - Shows a loading spinner
 * @param {string} title - Toast title
 * @param {string} description - Toast description (optional)
 * @param {Object} options - Additional options
 */
export const toastLoading = (title, description, options = {}) => {
  return sonnerToast.loading(title, {
    description,
    duration: Infinity, // Loading toasts should not auto-dismiss
    ...options,
  });
};

/**
 * Promise toast - Automatically handles promise states
 * @param {Promise} promise - The promise to track
 * @param {Object} messages - Messages for different states
 * @param {Object} options - Additional options
 */
export const toastPromise = (promise, messages, options = {}) => {
  const defaultMessages = {
    loading: "Loading...",
    success: "Success!",
    error: "Something went wrong",
  };

  return sonnerToast.promise(
    promise,
    {
      ...defaultMessages,
      ...messages,
    },
    options
  );
};

/**
 * Custom toast with full control
 * @param {string} title - Toast title
 * @param {string} description - Toast description (optional)
 * @param {Object} options - Additional options
 */
export const toastCustom = (title, description, options = {}) => {
  return sonnerToast(title, {
    description,
    duration: DEFAULT_DURATION,
    ...options,
  });
};

/**
 * Dismiss a specific toast
 * @param {string} toastId - The ID of the toast to dismiss
 */
export const dismissToast = (toastId) => {
  return sonnerToast.dismiss(toastId);
};

/**
 * Dismiss all toasts
 */
export const dismissAllToasts = () => {
  return sonnerToast.dismiss();
};

// Re-export the original toast for backward compatibility
export { sonnerToast as toast };

// Default export with all methods
const toastUtils = {
  success: toastSuccess,
  error: toastError,
  warning: toastWarning,
  info: toastInfo,
  loading: toastLoading,
  promise: toastPromise,
  custom: toastCustom,
  dismiss: dismissToast,
  dismissAll: dismissAllToasts,
};

export default toastUtils;
