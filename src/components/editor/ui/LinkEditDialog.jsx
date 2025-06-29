"use client";

import React, { useState, useEffect } from "react";
import { ExternalLink, Edit3, Trash2, Copy } from "lucide-react";
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
 * LinkEditDialog Component
 * Modal for editing, visiting, or removing links in the TipTap editor
 *
 * @param {Object} props - Component props
 * @param {boolean} props.open - Dialog open state
 * @param {Function} props.onOpenChange - Dialog state change handler
 * @param {Object} props.editor - TipTap editor instance
 * @param {Object} props.linkData - Current link data { text, href }
 * @param {Function} props.onUpdate - Callback when link is updated
 * @param {Function} props.onRemove - Callback when link is removed
 */
export default function LinkEditDialog({
  open,
  onOpenChange,
  editor,
  linkData = {},
  onUpdate,
  onRemove,
}) {
  const [linkText, setLinkText] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Update form when linkData changes
  useEffect(() => {
    if (linkData) {
      setLinkText(linkData.text || "");
      setLinkUrl(linkData.href || "");
    }
  }, [linkData]);

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      setLinkText("");
      setLinkUrl("");
      setIsLoading(false);
    }
  }, [open]);

  /**
   * Handle form submission to update link
   */
  const handleUpdate = async () => {
    if (!linkUrl.trim()) {
      toast.error("Please enter a valid URL");
      return;
    }

    setIsLoading(true);

    try {
      // Update the link in the editor
      if (editor && !editor.isDestroyed) {
        // If text changed, update both text and link
        if (linkText.trim() && linkText !== linkData.text) {
          editor
            .chain()
            .focus()
            .extendMarkRange("link")
            .insertContent(linkText)
            .setLink({ href: linkUrl })
            .run();
        } else {
          // Just update the URL
          editor.chain().focus().extendMarkRange("link").setLink({ href: linkUrl }).run();
        }
      }

      // Call update callback
      if (onUpdate) {
        onUpdate({ text: linkText, href: linkUrl });
      }

      toast.success("Link updated successfully");
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating link:", error);
      toast.error("Failed to update link");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle link removal
   */
  const handleRemove = () => {
    try {
      if (editor && !editor.isDestroyed) {
        editor.chain().focus().extendMarkRange("link").unsetLink().run();
      }

      if (onRemove) {
        onRemove();
      }

      toast.success("Link removed successfully");
      onOpenChange(false);
    } catch (error) {
      console.error("Error removing link:", error);
      toast.error("Failed to remove link");
    }
  };

  /**
   * Handle visiting the link
   */
  const handleVisit = () => {
    if (linkUrl) {
      // Ensure URL has protocol - check for both http and https
      let url = linkUrl.trim();
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        url = `https://${url}`;
      }
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  /**
   * Handle copying link to clipboard
   */
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(linkUrl);
      toast.success("Link copied to clipboard");
    } catch (error) {
      console.error("Error copying link:", error);
      toast.error("Failed to copy link");
    }
  };

  /**
   * Handle Enter key press in form
   */
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleUpdate();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit3 className="w-5 h-5" />
            Edit Link
          </DialogTitle>
          <DialogDescription>
            Update the link text and URL, or use the actions below.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Link Text Input */}
          <div className="space-y-2">
            <Label htmlFor="link-text">Link Text</Label>
            <Input
              id="link-text"
              placeholder="Enter link text..."
              value={linkText}
              onChange={(e) => setLinkText(e.target.value)}
              onKeyDown={handleKeyDown}
            />
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
          </div>

          {/* Quick Actions */}
          {linkUrl && (
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleVisit}
                className="flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Visit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                Copy
              </Button>
            </div>
          )}
        </div>

        <DialogFooter className="flex justify-between">
          <Button
            variant="destructive"
            onClick={handleRemove}
            className="flex items-center gap-2"
            disabled={isLoading}
          >
            <Trash2 className="w-4 h-4" />
            Remove Link
          </Button>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={isLoading || !linkUrl.trim()}>
              {isLoading ? "Updating..." : "Update Link"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
