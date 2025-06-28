"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/useToast";
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Info,
  Loader2,
  Trash2,
  Plus,
  Edit,
  Wifi,
  WifiOff
} from "lucide-react";

/**
 * Toast Demo Component
 * Showcases all the different toast types and their usage patterns
 * This component can be used for testing and as a reference for developers
 */
export default function ToastDemo() {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Simulate async operation
  const simulateAsyncOperation = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
    return "Operation completed successfully!";
  };

  // Simulate async operation that fails
  const simulateFailedOperation = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    throw new Error("Operation failed due to network error");
  };

  const handlePromiseDemo = () => {
    const promise = simulateAsyncOperation();
    toast.promise(promise, {
      loading: "Processing your request...",
      success: "Request completed successfully!",
      error: "Failed to process request",
    });
  };

  const handleAsyncDemo = async () => {
    try {
      await toast.handleAsync(simulateAsyncOperation, {
        loadingMessage: "Working on it...",
        successMessage: "All done!",
        errorMessage: "Oops, something went wrong",
      });
    } catch (error) {
      console.error("Async operation failed:", error);
    }
  };

  const handleFailedAsyncDemo = async () => {
    try {
      await toast.handleAsync(simulateFailedOperation, {
        loadingMessage: "Attempting operation...",
        successMessage: "Success!",
        errorMessage: "Operation failed",
      });
    } catch (error) {
      console.error("Expected failure:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Toast Notification Demo</h1>
        <p className="text-muted-foreground">
          Showcase of the enhanced toast notification system with modern design and animations
        </p>
      </div>

      {/* Basic Toast Types */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Basic Toast Types
          </CardTitle>
          <CardDescription>
            Standard toast notifications for different message types
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button
            onClick={() => toast.success("Success!", "Your action was completed successfully.")}
            className="bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Success Toast
          </Button>
          
          <Button
            onClick={() => toast.error("Error!", "Something went wrong. Please try again.")}
            variant="destructive"
          >
            <XCircle className="w-4 h-4 mr-2" />
            Error Toast
          </Button>
          
          <Button
            onClick={() => toast.warning("Warning!", "Please review your input before proceeding.")}
            className="bg-orange-600 hover:bg-orange-700"
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            Warning Toast
          </Button>
          
          <Button
            onClick={() => toast.info("Info", "Here's some helpful information for you.")}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Info className="w-4 h-4 mr-2" />
            Info Toast
          </Button>
        </CardContent>
      </Card>

      {/* Convenience Methods */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Edit className="w-5 h-5 text-blue-600" />
            Convenience Methods
          </CardTitle>
          <CardDescription>
            Pre-configured toasts for common use cases
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Button
            onClick={() => toast.showFormSuccess("Profile updated successfully!")}
            variant="outline"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Form Success
          </Button>
          
          <Button
            onClick={() => toast.showFormError("Please fill in all required fields")}
            variant="outline"
          >
            <XCircle className="w-4 h-4 mr-2" />
            Form Error
          </Button>
          
          <Button
            onClick={() => toast.showValidationError("Email format is invalid")}
            variant="outline"
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            Validation Error
          </Button>
          
          <Button
            onClick={() => toast.showCreateSuccess("Project")}
            variant="outline"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Success
          </Button>
          
          <Button
            onClick={() => toast.showUpdateSuccess("Document")}
            variant="outline"
          >
            <Edit className="w-4 h-4 mr-2" />
            Update Success
          </Button>
          
          <Button
            onClick={() => toast.showDeleteSuccess("User")}
            variant="outline"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Success
          </Button>
        </CardContent>
      </Card>

      {/* Advanced Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Loader2 className="w-5 h-5 text-purple-600" />
            Advanced Features
          </CardTitle>
          <CardDescription>
            Loading states, promises, and async operations
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Button
            onClick={() => toast.loading("Loading", "Please wait while we process your request...")}
            variant="outline"
            className="border-purple-200"
          >
            <Loader2 className="w-4 h-4 mr-2" />
            Loading Toast
          </Button>
          
          <Button
            onClick={handlePromiseDemo}
            variant="outline"
            className="border-indigo-200"
          >
            <Wifi className="w-4 h-4 mr-2" />
            Promise Toast
          </Button>
          
          <Button
            onClick={handleAsyncDemo}
            variant="outline"
            className="border-teal-200"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <CheckCircle className="w-4 h-4 mr-2" />
            )}
            Async Success
          </Button>
          
          <Button
            onClick={handleFailedAsyncDemo}
            variant="outline"
            className="border-red-200"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <WifiOff className="w-4 h-4 mr-2" />
            )}
            Async Failure
          </Button>
          
          <Button
            onClick={() => toast.showNetworkError("Failed to connect to server")}
            variant="outline"
            className="border-red-200"
          >
            <WifiOff className="w-4 h-4 mr-2" />
            Network Error
          </Button>
          
          <Button
            onClick={() => toast.dismissAll()}
            variant="outline"
            className="border-gray-200"
          >
            <XCircle className="w-4 h-4 mr-2" />
            Dismiss All
          </Button>
        </CardContent>
      </Card>

      {/* Custom Options */}
      <Card>
        <CardHeader>
          <CardTitle>Custom Options</CardTitle>
          <CardDescription>
            Toasts with custom duration, positioning, and styling
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            onClick={() => toast.success(
              "Long Duration", 
              "This toast will stay for 10 seconds", 
              { duration: 10000 }
            )}
            variant="outline"
          >
            Long Duration (10s)
          </Button>
          
          <Button
            onClick={() => toast.info(
              "Short Duration", 
              "This toast disappears quickly", 
              { duration: 1000 }
            )}
            variant="outline"
          >
            Short Duration (1s)
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
