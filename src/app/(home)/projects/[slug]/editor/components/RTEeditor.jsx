import { editorExtensions } from "@/lib/editor-extensions/editor-extensions";
import { useEditor, EditorContent } from "@tiptap/react";
import { useCallback, useEffect, useRef, useState } from "react";
import SlashCommandMenu from "./SlashCommandMenu";
import { LinkDialog } from "./LinkDialog";
import BubbleMenu from "@/components/editor/ui/BubbleMenu";
import { savePageContent } from "../actions/savePageContent";
import { toast } from "sonner";
import { fetchPageContent } from "../actions/fetchPageContent";
import { useProjectStore } from "../../../store/useProjectStore";
import { usePreviewStore } from "../store/usePreviewStore";
import { Spinner } from "@/components/ui/spinner";

export default function RTEeditor({ pageId }) {
  const ref = useRef(null);
  const [pageContent, setPageContent] = useState(null);
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [initialText, setInitialText] = useState("");
  const [initialUrl, setInitialUrl] = useState("");
  const [dialogMode, setDialogMode] = useState("create");
  const isPreviewMode = usePreviewStore((state) => state.isPageInPreviewMode(pageId));
  const [isLoading, setIsLoading] = useState(true);

  const editorKey = `editor-${pageId}`; // Use pageId as key to force recreation

  const editor = useEditor({
    immediatelyRender: false,
    extensions: editorExtensions,
    autofocus: true,
    content: pageContent,
    editorProps: {
      attributes: {
        class: "focus:outline-none max-w-none",
      },
      editable: () => !isPreviewMode,
    },
  });

  useEffect(() => {
    if (editor) {
      editor.commands.focus("end");
    }
  }, [editor, pageId]);

  // for link
  useEffect(() => {
    if (!editor) return;

    const handler = (event) => {
      const target = event.target;
      if (target.dataset.type === "link") {
        event.preventDefault();

        const url = target.dataset.href;
        const text = target.textContent;

        setInitialText(text);
        setInitialUrl(url);
        setDialogMode("edit");
        setLinkDialogOpen(true);
      }
    };

    const dom = editor.view.dom;
    dom.addEventListener("click", handler);
    return () => dom.removeEventListener("click", handler);
  }, [editor]);

  const handleSubmit = useCallback(async () => {
    if (!editor) return;

    // Get the JSON output
    const rawContent = editor.getJSON();

    // Strip functions if any accidentally included
    const content = JSON.parse(JSON.stringify(rawContent));

    const result = await savePageContent({
      pageId,
      content,
    });

    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message || "Something went wrong");
    }
  }, [editor, pageId]);

  useEffect(() => {
    // Reset page content when page changes to avoid showing stale content
    setPageContent(null);
    setIsLoading(true);

    let isMounted = true;

    async function getPageContent() {
      try {
        // First destroy the editor to prevent DOM manipulation errors
        if (editor && editor.view) {
          // Only destroy if it hasn't been destroyed already
          if (!editor.isDestroyed) {
            editor.destroy();
          }
        }

        const res = await fetchPageContent(pageId);

        // Check if the component is still mounted before updating state
        if (!isMounted) return;

        const content = res.content;

        // Only update if we're still on the same page
        if (pageId === useProjectStore.getState().selectedPage) {
          setPageContent(content);

          // The editor will be recreated with the useEditor hook
          // Don't manipulate it here, just update the state

          // Set loading to false after content is loaded
          setIsLoading(false);
        }
      } catch (error) {
        if (!isMounted) return;
        console.error("Error fetching page content:", error);
        toast.error("Failed to load page content");
        setIsLoading(false);
      }
    }

    getPageContent();

    // Cleanup function to prevent state updates on unmounted component
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageId]);

  useEffect(() => {
    if (editor && pageContent && !isLoading) {
      if (pageContent) {
        editor.commands.setContent(pageContent);
      } else {
        editor.commands.clearContent();
      }
      editor.commands.focus("end");
    }
  }, [editor, pageContent, isLoading]);

  useEffect(() => {
    if (editor) {
      // Register the save function into Zustand
      useProjectStore.getState().setSaveHandler(handleSubmit);
    }
  }, [editor, handleSubmit]);

  // Update editor's editable state when preview mode changes
  useEffect(() => {
    if (editor) {
      editor.setEditable(!isPreviewMode);
    }
  }, [editor, isPreviewMode, pageId]);

  return (
    <form className="mt-6 w-full">
      <div className="relative w-full">
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[500px] bg-gray-50/50 rounded-md">
            <Spinner className="text-primary" size="large">
              <span className="ml-2 text-sm text-gray-600">Loading content...</span>
            </Spinner>
          </div>
        ) : (
          <div
            key={editorKey}
            onClick={() => !isPreviewMode && editor?.commands.focus()}
            className={`w-full p-4 px-0 rounded-md ${
              !isPreviewMode ? "cursor-text" : "cursor-default"
            } max-w-none ${isPreviewMode ? "preview-mode" : ""}`}
          >
            <BubbleMenu editor={editor} />
            <EditorContent editor={editor} className="w-full p-0 min-h-[500px]" />
          </div>
        )}

        {/* Link dialog */}
        <LinkDialog
          open={linkDialogOpen}
          onOpenChange={setLinkDialogOpen}
          editor={editor}
          initialText={initialText}
          initialUrl={initialUrl}
          mode={dialogMode}
        />

        {/* Slash command menu */}
        {editor && (
          <SlashCommandMenu
            open={linkDialogOpen}
            onOpenChange={setLinkDialogOpen}
            editor={editor}
            setInitialText={setInitialText}
            setInitialUrl={setInitialUrl}
            setDialogMode={setDialogMode}
          />
        )}
      </div>
      <input type="hidden" name="content" ref={ref} />
    </form>
  );
}
