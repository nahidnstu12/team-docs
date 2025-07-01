"use client";

import React, { useState, useEffect } from "react";
import { Link as LinkIcon, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

/**
 * LinkCreateDialog Component
 * Modal for creating new links in the TipTap editor
 *
 * @param {Object} props - Component props
 * @param {boolean} props.open - Dialog open state
 * @param {Function} props.onOpenChange - Dialog state change handler
 * @param {Object} props.editor - TipTap editor instance
 * @param {string} props.selectedText - Currently selected text
 * @param {Function} props.onCreate - Callback when link is created
 */
export default function LinkCreateDialog({
  open,
  onOpenChange,
  editor,
  selectedText = "",
  onCreate,
}) {
  const [linkText, setLinkText] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Update form when selectedText changes or dialog opens
  useEffect(() => {
    if (open) {
      setLinkText(selectedText || "");
      setLinkUrl("");
    }
  }, [open, selectedText]);

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      setLinkText("");
      setLinkUrl("");
      setIsLoading(false);
    }
  }, [open]);

  /**
   * Handle form submission to create link
   */
  const handleCreate = async () => {
    if (!linkUrl.trim()) {
      toast.error("Please enter a valid URL");
      return;
    }

    if (!linkText.trim()) {
      toast.error("Please enter link text");
      return;
    }

    // Clean up the URL
    let cleanUrl = linkUrl.trim();

    // Fix common URL issues
    if (cleanUrl.includes("https:://")) {
      cleanUrl = cleanUrl.replace("https:://", "https://");
    }
    if (cleanUrl.includes("http:://")) {
      cleanUrl = cleanUrl.replace("http:://", "http://");
    }

    // Add protocol if missing
    if (
      !cleanUrl.startsWith("http://") &&
      !cleanUrl.startsWith("https://") &&
      !cleanUrl.startsWith("mailto:") &&
      !cleanUrl.startsWith("tel:")
    ) {
      cleanUrl = `https://${cleanUrl}`;
    }

    console.log("Original URL:", linkUrl);
    console.log("Cleaned URL:", cleanUrl);

    setIsLoading(true);

    try {
      // Call create callback - let the hook handle the actual creation
      if (onCreate) {
        onCreate({ text: linkText, href: cleanUrl });
      }

      toast.success("Link created successfully");
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating link:", error);
      toast.error("Failed to create link");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle Enter key press in form
   */
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleCreate();
    }
  };

  /**
   * Auto-focus the appropriate field when dialog opens
   */
  useEffect(() => {
    if (open) {
      // Focus URL field if text is already provided, otherwise focus text field
      const timeoutId = setTimeout(() => {
        const fieldToFocus = linkText ? "link-url" : "link-text";
        const element = document.getElementById(fieldToFocus);
        if (element) {
          element.focus();
        }
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [open, linkText]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Create Link
          </DialogTitle>
          <DialogDescription>
            Add a link to your text. Enter the text to display and the URL to link to.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Link Text Input */}
          <div className="space-y-2">
            <Label htmlFor="link-text">Link Text</Label>
            <Input
              id="link-text"
              placeholder="Enter text to display..."
              value={linkText}
              onChange={(e) => setLinkText(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <p className="text-xs text-muted-foreground">
              This is the text that will be displayed and clickable
            </p>
          </div>

          {/* Link URL Input */}
          <div className="space-y-2">
            <Label htmlFor="link-url">URL</Label>
            <Input
              id="link-url"
              placeholder="https://example.com"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <p className="text-xs text-muted-foreground">
              The web address this link will navigate to
            </p>
          </div>

          {/* Preview */}
          {linkText && linkUrl && (
            <div className="p-3 bg-muted rounded-md">
              <p className="text-sm text-muted-foreground mb-1">Preview:</p>
              <div className="flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-blue-600" />
                <span className="text-blue-600 underline cursor-pointer">{linkText}</span>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={isLoading || !linkUrl.trim() || !linkText.trim()}
          >
            {isLoading ? "Creating..." : "Create Link"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
