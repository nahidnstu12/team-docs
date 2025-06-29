"use client";

import ProjectEditorHeader from "@/components/layout/ProjectEditorHeader";
import NoSectionUI from "./components/NoSectionUI";
import NoPageSelectedUI from "./components/NoPageSelectedUI";
import { EditorService, useEditorContext } from "@/components/editor";
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
import { useCallback, useEffect, useState, useRef, useMemo } from "react";
import { Spinner } from "@/components/ui/spinner";

/**
 * Editor Content Manager - handles save logic with editor context access
 */
function EditorContentManager({ pageId, pageContent, handleSave, instanceId }) {
  const editorContext = useEditorContext();

  console.log("🎯 EditorContentManager rendered with:", {
    pageId,
    instanceId,
    hasContent: !!pageContent,
    hasContext: !!editorContext,
  });

  // Register save handler with project store
  useEffect(() => {
    if (pageId && instanceId) {
      console.log(
        "🔧 Registering save handler for pageId:",
        pageId,
        "instanceId:",
        instanceId,
        "with content:",
        !!pageContent
      );
      useProjectStore.getState().setSaveHandler(() => {
        console.log("🚀 Save handler called! Current pageContent:", pageContent);

        // Always try to get the latest content from the editor instance first
        let contentToSave = null;

        if (editorContext) {
          console.log("🔍 Getting latest content from editor context...");
          try {
            const editorInstance = editorContext.getEditor(instanceId);
            if (editorInstance) {
              contentToSave = editorInstance.getJSON();
              console.log(
                "📄 Got latest content from editor:",
                JSON.stringify(contentToSave).substring(0, 200) + "..."
              );
            } else {
              console.warn("❌ No editor instance found for instanceId:", instanceId);
            }
          } catch (error) {
            console.error("❌ Failed to get content from editor context:", error);
          }
        }

        // Fallback to pageContent if editor content is not available
        if (!contentToSave) {
          console.log("🔄 Falling back to pageContent state");
          contentToSave = pageContent;
        }

        // Save the current content
        if (contentToSave) {
          handleSave(contentToSave);
        } else {
          console.warn("⚠️ No content available to save from either editor or state");
        }
      });
    }
  }, [pageId, instanceId, pageContent, handleSave, editorContext]);

  return null; // This component doesn't render anything
}

/**
 * Enhanced Editor Component with Store Integration
 * Wraps the new TipTap editor with existing store and action integration
 */
function EnhancedEditor({ pageId }) {
  const [pageContent, setPageContent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const isPreviewMode = usePreviewStore((state) => state.isPageInPreviewMode(pageId));
  const editorRef = useRef(null);

  // Handle content saving (manual save - shows toast)
  const handleSave = useCallback(
    async (content) => {
      try {
        console.log("💾 Saving content:", { pageId, content, contentType: typeof content });
        const result = await EditorService.saveContent({
          pageId,
          content,
          showToast: true, // Show toast for manual saves
        });
        console.log("✅ Save result:", result);
      } catch (error) {
        console.error("❌ Error saving content:", error);
        // Error toast is handled by EditorService when showToast=true
      }
    },
    [pageId]
  );

  // Handle content changes - memoized to prevent infinite loops
  const handleChange = useCallback((content, instanceId) => {
    console.log("📝 Content changed:", { content, instanceId, contentType: typeof content });
    console.log("📝 Content preview:", JSON.stringify(content).substring(0, 200) + "...");
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
      >
        <EditorContentManager
          pageId={pageId}
          instanceId={instanceId}
          pageContent={pageContent}
          handleSave={handleSave}
        />
      </CompleteEditor>
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
