"use client";

import { useCallback } from "react";
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

/**
 * Custom hook for toast notifications
 * Provides a consistent API for showing different types of toasts
 * with proper error handling and state management
 */
export const useToast = () => {
  // Success toast with consistent styling
  const success = useCallback((title, description, options = {}) => {
    try {
      return toastSuccess(title, description, options);
    } catch (error) {
      console.error("Error showing success toast:", error);
    }
  }, []);

  // Error toast with consistent styling
  const error = useCallback((title, description, options = {}) => {
    try {
      return toastError(title, description, options);
    } catch (error) {
      console.error("Error showing error toast:", error);
    }
  }, []);

  // Warning toast with consistent styling
  const warning = useCallback((title, description, options = {}) => {
    try {
      return toastWarning(title, description, options);
    } catch (error) {
      console.error("Error showing warning toast:", error);
    }
  }, []);

  // Info toast with consistent styling
  const info = useCallback((title, description, options = {}) => {
    try {
      return toastInfo(title, description, options);
    } catch (error) {
      console.error("Error showing info toast:", error);
    }
  }, []);

  // Loading toast for async operations
  const loading = useCallback((title, description, options = {}) => {
    try {
      return toastLoading(title, description, options);
    } catch (error) {
      console.error("Error showing loading toast:", error);
    }
  }, []);

  // Promise toast for handling async operations
  const promise = useCallback((promiseToTrack, messages, options = {}) => {
    try {
      return toastPromise(promiseToTrack, messages, options);
    } catch (error) {
      console.error("Error showing promise toast:", error);
    }
  }, []);

  // Custom toast with full control
  const custom = useCallback((title, description, options = {}) => {
    try {
      return toastCustom(title, description, options);
    } catch (error) {
      console.error("Error showing custom toast:", error);
    }
  }, []);

  // Dismiss specific toast
  const dismiss = useCallback((toastId) => {
    try {
      return dismissToast(toastId);
    } catch (error) {
      console.error("Error dismissing toast:", error);
    }
  }, []);

  // Dismiss all toasts
  const dismissAll = useCallback(() => {
    try {
      return dismissAllToasts();
    } catch (error) {
      console.error("Error dismissing all toasts:", error);
    }
  }, []);

  // Convenience methods for common use cases
  const showFormSuccess = useCallback((message = "Changes saved successfully") => {
    return success("Success", message);
  }, [success]);

  const showFormError = useCallback((message = "Please check your input and try again") => {
    return error("Error", message);
  }, [error]);

  const showNetworkError = useCallback((message = "Please check your connection and try again") => {
    return error("Network Error", message);
  }, [error]);

  const showValidationError = useCallback((message = "Please fix the errors and try again") => {
    return warning("Validation Error", message);
  }, [warning]);

  const showDeleteSuccess = useCallback((itemName = "Item") => {
    return success("Deleted", `${itemName} has been successfully deleted`);
  }, [success]);

  const showCreateSuccess = useCallback((itemName = "Item") => {
    return success("Created", `${itemName} has been successfully created`);
  }, [success]);

  const showUpdateSuccess = useCallback((itemName = "Item") => {
    return success("Updated", `${itemName} has been successfully updated`);
  }, [success]);

  // Handle async operations with loading states
  const handleAsync = useCallback(async (
    asyncFn,
    {
      loadingMessage = "Processing...",
      successMessage = "Operation completed successfully",
      errorMessage = "Something went wrong",
      showLoading = true,
    } = {}
  ) => {
    let loadingToastId;
    
    try {
      if (showLoading) {
        loadingToastId = loading("Loading", loadingMessage);
      }

      const result = await asyncFn();

      if (loadingToastId) {
        dismiss(loadingToastId);
      }

      success("Success", successMessage);
      return result;
    } catch (error) {
      if (loadingToastId) {
        dismiss(loadingToastId);
      }

      const message = error?.message || errorMessage;
      error("Error", message);
      throw error;
    }
  }, [loading, success, error, dismiss]);

  return {
    // Core toast methods
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
  };
};

export default useToast;
