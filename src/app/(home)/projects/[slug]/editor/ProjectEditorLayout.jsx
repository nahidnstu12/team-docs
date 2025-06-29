"use client";

import ProjectEditorHeader from "@/components/layout/ProjectEditorHeader";
import NoSectionUI from "./components/NoSectionUI";
import NoPageSelectedUI from "./components/NoPageSelectedUI";
import { EditorService } from "@/components/editor";
import dynamic from "next/dynamic";

// Dynamically import the CompleteEditor to prevent SSR issues
const CompleteEditor = dynamic(
  () => import("@/components/editor").then((mod) => ({ default: mod.CompleteEditor })),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center min-h-[500px] bg-gray-50/50 rounded-md">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <span className="text-sm text-gray-600">Loading editor...</span>
        </div>
      </div>
    ),
  }
);
import { useProjectStore } from "../../store/useProjectStore";
import { usePreviewStore } from "./store/usePreviewStore";
import { fetchPageContent } from "./actions/fetchPageContent";
import { toast } from "sonner";
import { useCallback, useEffect, useState, useMemo } from "react";
import { Spinner } from "@/components/ui/spinner";

/**
 * Enhanced Editor Component with Store Integration
 * Wraps the new TipTap editor with existing store and action integration
 */
function EnhancedEditor({ pageId }) {
  const [pageContent, setPageContent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const isPreviewMode = usePreviewStore((state) => state.isPageInPreviewMode(pageId));

  // Handle content saving (manual save - shows toast)
  const handleSave = useCallback(
    async (content) => {
      try {
        console.log("💾 Saving content:", {
          pageId,
          content,
          contentType: typeof content,
          contentStringified: JSON.stringify(content).substring(0, 500) + "...",
        });
        const result = await EditorService.saveContent({
          pageId,
          content,
          showToast: true, // Show toast for manual saves
        });
        console.log("✅ Save result:", result);

        // Verify what was actually saved
        if (result && result.content) {
          console.log(
            "🔍 Verified saved content:",
            JSON.stringify(result.content).substring(0, 200) + "..."
          );
        }
      } catch (error) {
        console.error("❌ Error saving content:", error);
        // Error toast is handled by EditorService when showToast=true
      }
    },
    [pageId]
  );

  // Handle content changes - memoized to prevent infinite loops
  const handleChange = useCallback((content, instanceId) => {
    console.log("📝 Content changed called!");
    console.log("📝 Content details:", {
      content,
      instanceId,
      contentType: typeof content,
      hasContent: !!content,
      isObject: typeof content === "object",
      keys: typeof content === "object" ? Object.keys(content || {}) : "not object",
    });
    console.log("📝 Content preview:", JSON.stringify(content).substring(0, 200) + "...");
    // Store the current content for saving
    setPageContent(content);
    console.log("📝 pageContent state updated");
  }, []);

  // Register save handler with project store
  useEffect(() => {
    if (pageId) {
      console.log("🔧 Registering save handler for pageId:", pageId);
      useProjectStore.getState().setSaveHandler(() => {
        console.log("🚀 Save handler called! Current pageContent:", pageContent);

        // Save the current content
        if (pageContent) {
          handleSave(pageContent);
        } else {
          console.warn("⚠️ No content available to save");
        }
      });
    }
  }, [pageId, pageContent, handleSave]);

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
            console.log("📖 Loaded content from DB:", {
              contentType: typeof parsedContent,
              contentPreview: JSON.stringify(parsedContent).substring(0, 200) + "...",
              rawContent: pageData.content.substring(0, 200) + "...",
            });
            setPageContent(parsedContent);
          } catch (parseError) {
            console.warn("Failed to parse content as JSON, using as text:", parseError);
            console.log("📖 Using raw content:", pageData.content.substring(0, 200) + "...");
            setPageContent(pageData.content);
          }
        } else {
          console.log("📖 No content found in DB for pageId:", pageId);
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

  // Memoize instanceId to prevent recreation
  const instanceId = useMemo(() => `page-editor-${pageId}`, [pageId]);

  // Editor configuration - memoized to prevent infinite loops
  const editorConfig = useMemo(
    () => ({
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
    }),
    [isPreviewMode]
  );

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
      <CompleteEditor
        instanceId={instanceId}
        pageId={pageId}
        initialContent={pageContent}
        onSave={handleSave}
        onChange={handleChange}
        config={editorConfig}
        className="w-full p-0 min-h-[500px]"
        editable={!isPreviewMode}
      ></CompleteEditor>
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
