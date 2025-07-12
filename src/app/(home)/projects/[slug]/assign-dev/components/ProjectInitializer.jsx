"use client";

import { useProjectStore } from "@/app/(home)/projects/store/useProjectStore";
import { useEffect } from "react";

export default function ProjectInitializer({ project }) {
  useEffect(() => {
    if (project) {
      useProjectStore.getState().setProject(project);
    }
  }, [project]);

  return null; // This component doesn't render anything
}
