"use client";

import ProjectEditorHeader from "@/components/layout/ProjectEditorHeader";
import NoSectionUI from "./components/NoSectionUI";
import NoPageSelectedUI from "./components/NoPageSelectedUI";
import { CompleteEditor } from "@/components/editor";
import { useProjectStore } from "../../store/useProjectStore";
import { usePreviewStore } from "./store/usePreviewStore";
import { savePageContent } from "./actions/savePageContent";
import { fetchPageContent } from "./actions/fetchPageContent";
import { toast } from "sonner";
import { useCallback, useEffect, useState, useRef } from "react";
import { Spinner } from "@/components/ui/spinner";

/**
 * Enhanced Editor Component with Store Integration
 * Wraps the new TipTap editor with existing store and action integration
 */
function EnhancedEditor({ pageId }) {
  const [pageContent, setPageContent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const isPreviewMode = usePreviewStore((state) => state.isPageInPreviewMode(pageId));
  const editorRef = useRef(null);

  // Handle content saving
  const handleSave = useCallback(
    async (content) => {
      try {
        const result = await savePageContent({ pageId, content: JSON.stringify(content) });
        if (result.success) {
          toast.success("Content saved successfully");
        } else {
          toast.error(result.message || "Failed to save content");
        }
      } catch (error) {
        console.error("Error saving content:", error);
        toast.error("Failed to save content");
      }
    },
    [pageId]
  );

  // Handle content changes
  const handleChange = useCallback((content, instanceId) => {
    // Store the current content for saving
    setPageContent(content);
  }, []);

  // Load page content
  useEffect(() => {
    let isMounted = true;

    async function getPageContent() {
      if (!pageId) return;

      try {
        setIsLoading(true);
        const pageData = await fetchPageContent(pageId);

        if (!isMounted) return;

        if (pageData?.content) {
          try {
            const parsedContent = JSON.parse(pageData.content);
            setPageContent(parsedContent);
          } catch (parseError) {
            console.warn("Failed to parse content as JSON, using as text:", parseError);
            setPageContent(pageData.content);
          }
        } else {
          setPageContent(null);
        }
        setIsLoading(false);
      } catch (error) {
        if (!isMounted) return;
        console.error("Error fetching page content:", error);
        toast.error("Failed to load page content");
        setIsLoading(false);
      }
    }

    getPageContent();

    return () => {
      isMounted = false;
    };
  }, [pageId]);

  // Register save handler with project store
  useEffect(() => {
    if (pageId) {
      useProjectStore.getState().setSaveHandler(() => {
        // Save the current content
        if (pageContent) {
          handleSave(pageContent);
        }
      });
    }
  }, [pageId, pageContent, handleSave]);

  // Editor configuration
  const editorConfig = {
    autofocus: true,
    characterLimit: 50000,
    placeholder: {
      text: "Start writing your documentation...",
    },
    editorProps: {
      attributes: {
        class: "focus:outline-none max-w-none",
      },
      editable: () => !isPreviewMode,
    },
    autoSave: {
      enabled: false, // We handle saving manually
    },
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[500px] bg-gray-50/50 rounded-md mt-6">
        <Spinner className="text-primary" size="large">
          <span className="ml-2 text-sm text-gray-600">Loading content...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div className="mt-6 w-full">
      <div
        className={`w-full p-4 px-0 rounded-md ${
          !isPreviewMode ? "cursor-text" : "cursor-default"
        } max-w-none ${isPreviewMode ? "preview-mode" : ""}`}
      >
        <CompleteEditor
          instanceId={`page-editor-${pageId}`}
          pageId={pageId}
          initialContent={pageContent}
          onSave={handleSave}
          onChange={handleChange}
          config={editorConfig}
          className="w-full p-0 min-h-[500px]"
          editable={!isPreviewMode}
        />
      </div>
    </div>
  );
}

export default function ProjectEditorLayout({ hasSection }) {
  const selectedPage = useProjectStore((state) => state.selectedPage);
  const projectName = useProjectStore((state) => state.project?.name);

  return (
    <>
      <ProjectEditorHeader selectedPage={selectedPage} projectName={projectName} />

      {!hasSection && <NoSectionUI />}
      {hasSection && !selectedPage && <NoPageSelectedUI />}
      {selectedPage && <EnhancedEditor pageId={selectedPage} />}
    </>
  );
}
