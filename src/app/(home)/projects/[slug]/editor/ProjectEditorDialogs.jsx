"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import DialogLoading from "@/components/loading/DialogLoading";
import { usePageDialogStore } from "../../store/usePageDialogStore";
import { useSectionDialogStore } from "./store/useSectionDialogStore";

const CreateSectionDialogLazy = dynamic(
  () => import("@/app/(home)/projects/[slug]/editor/components/CreateSectionDialog"),
  {
    ssr: false,
    loading: () => <DialogLoading />,
  }
);

const CreatePageDialogLazy = dynamic(
  () => import("@/app/(home)/projects/[slug]/editor/components/createPageDialog"),
  {
    ssr: false,
    loading: () => <DialogLoading />,
  }
);

export default function ProjectEditorDialogs({ project, selectedSectionId }) {
  // Add hydration check to prevent SSR/client mismatch
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const isPageDialogOpen = usePageDialogStore((state) => state.isPageDialogOpen);
  const closePageDialog = usePageDialogStore((state) => state.closePageDialog);
  const isSectionDialogOpen = useSectionDialogStore((state) => state.isSectionDialogOpen);
  const closeSectionDialog = useSectionDialogStore((state) => state.closeSectionDialog);
  const openSectionDialog = useSectionDialogStore((state) => state.openSectionDialog);

  // Don't render dialogs until hydration is complete
  if (!isHydrated) {
    return null;
  }

  return (
    <>
      {/* section dialog */}
      {isSectionDialogOpen && (
        <CreateSectionDialogLazy
          project={project}
          isDialogOpen={isSectionDialogOpen}
          setIsDialogOpen={closeSectionDialog}
        />
      )}

      {/* page dialog */}
      {isPageDialogOpen && (
        <CreatePageDialogLazy
          sectionId={selectedSectionId}
          isDialogOpen={isPageDialogOpen}
          setIsDialogOpen={closePageDialog}
        />
      )}
    </>
  );
}
