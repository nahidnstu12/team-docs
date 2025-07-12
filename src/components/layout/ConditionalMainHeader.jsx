"use client";

import { usePathname } from "next/navigation";
import { SidebarTrigger } from "../ui/sidebar";
import ProjectNameDisplay from "./ProjectNameDisplay";
import SearchButton from "@/app/(home)/search/components/SearchButton";
import { useEffect, useState } from "react";

/**
 * Client-side header wrapper that handles conditional rendering
 * based on the current route. This replaces server-side header logic
 * to work with client-side navigation.
 */
export default function ConditionalMainHeader({ workspace }) {
  const pathname = usePathname();
  const [isAssignDevRoute, setIsAssignDevRoute] = useState(false);

  useEffect(() => {
    // Check if current route is an assign-dev route
    const isAssignDev = pathname?.includes("/projects/") && pathname?.includes("/assign-dev");
    setIsAssignDevRoute(isAssignDev);
  }, [pathname]);

  return (
    <header className="flex justify-between items-center px-4 pl-0 h-16 border-b bg-background">
      <div className="flex items-center space-x-2">
        <SidebarTrigger />
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold">{workspace?.name || "workspace name"}</h1>
          {isAssignDevRoute && <ProjectNameDisplay />}
        </div>
      </div>

      {/* Search button - positioned on the right side */}
      <div className="flex items-center">
        <SearchButton />
      </div>
    </header>
  );
}
