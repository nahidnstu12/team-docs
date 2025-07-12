"use client";

import ProjectEditorHeader from "@/components/layout/ProjectEditorHeader";
import NoSectionUI from "./components/NoSectionUI";
import NoPageSelectedUI from "./components/NoPageSelectedUI";
import { EditorService, useEditorContent } from "@/components/editor";
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
import { toast } from "sonner";
import { useCallback, useEffect, useState, useMemo } from "react";
import { Spinner } from "@/components/ui/spinner";

/**
 * Enhanced Editor Component with Store Integration
 * Wraps the new TipTap editor with existing store and action integration
 */
function EnhancedEditor({ pageId, onSaveStateChange }) {
  const isPreviewMode = usePreviewStore((state) => state.isPageInPreviewMode(pageId));

  // Use the editor content hook for content management and save state tracking
  const { content, isLoading, isSaving, hasUnsavedChanges, saveContent, updateContent } =
    useEditorContent({
      pageId,
      autoSave: false, // Manual save only
      onSave: async (content) => {
        // Handle manual save with toast
        try {
          await EditorService.saveContent({
            pageId,
            content,
            showToast: true, // Show toast for manual saves
          });
        } catch (error) {
          console.error("❌ Error saving content:", error);
          // Error toast is handled by EditorService when showToast=true
        }
      },
    });

  // Handle content changes
  const handleChange = useCallback(
    (newContent) => {
      updateContent(newContent);
    },
    [updateContent]
  );

  // Handle manual save
  const handleSave = useCallback(async () => {
    if (content) {
      await saveContent(content);
    } else {
      toast.error("No content available to save");
    }
  }, [content, saveContent]);

  // Register save handler with project store and notify parent of save state changes
  useEffect(() => {
    if (pageId) {
      useProjectStore.getState().setSaveHandler(handleSave);

      // Notify parent component of save state changes
      if (onSaveStateChange) {
        onSaveStateChange({ hasUnsavedChanges, isSaving });
      }
    }
  }, [pageId, handleSave, hasUnsavedChanges, isSaving, onSaveStateChange]);

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
    <div className="mt-6 w-full pb-[50vh]">
      <CompleteEditor
        instanceId={instanceId}
        pageId={pageId}
        initialContent={content}
        onSave={handleSave}
        onChange={handleChange}
        config={editorConfig}
        className={`w-full p-0 min-h-[500px] ${isPreviewMode ? "preview-mode" : ""}`}
        editable={!isPreviewMode}
        showBubbleMenu={!isPreviewMode}
      />
    </div>
  );
}

export default function ProjectEditorLayout({ hasSection }) {
  const selectedPage = useProjectStore((state) => state.selectedPage);
  const projectName = useProjectStore((state) => state.project?.name);
  const selectedSection = useProjectStore((state) => state.selectedSection);
  const sections = useProjectStore((state) => state.sections);
  const getSelectedPageData = useProjectStore((state) => state.getSelectedPageData);

  // Track save state from the editor
  const [saveState, setSaveState] = useState({ hasUnsavedChanges: false, isSaving: false });

  // Get section and page data for header badges
  const selectedSectionData = sections?.find((section) => section.id === selectedSection);
  const selectedPageData = getSelectedPageData();

  const handleSaveStateChange = useCallback((newSaveState) => {
    setSaveState(newSaveState);
  }, []);

  return (
    <>
      <ProjectEditorHeader
        selectedPage={selectedPage}
        projectName={projectName}
        selectedSectionData={selectedSectionData}
        selectedPageData={selectedPageData}
        hasUnsavedChanges={saveState.hasUnsavedChanges}
        isSaving={saveState.isSaving}
      />

      {!hasSection && <NoSectionUI />}
      {hasSection &&
        (!selectedPage || typeof selectedPage !== "string" || selectedPage.trim() === "") && (
          <NoPageSelectedUI />
        )}
      {hasSection &&
        selectedPage &&
        typeof selectedPage === "string" &&
        selectedPage.trim() !== "" && (
          <EnhancedEditor pageId={selectedPage} onSaveStateChange={handleSaveStateChange} />
        )}
    </>
  );
}
