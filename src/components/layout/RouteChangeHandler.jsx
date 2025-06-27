"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useProjectStore } from "@/app/(home)/projects/store/useProjectStore";

export default function RouteChangeHandler() {
  const pathname = usePathname();

  useEffect(() => {
    // Clear project state when navigating away from assign-dev routes
    if (!pathname?.includes("/projects/") || !pathname?.includes("/assign-dev")) {
      useProjectStore.getState().setProject(null);
    }
  }, [pathname]);

  return null; // This component doesn't render anything
}
