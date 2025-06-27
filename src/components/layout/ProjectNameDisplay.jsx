"use client";

import { useProjectStore } from "@/app/(home)/projects/store/useProjectStore";

export default function ProjectNameDisplay() {
  const { project } = useProjectStore();

  return <span className="text-sm text-muted-foreground">{project?.name}</span>;
}
