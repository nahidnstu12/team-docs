"use client";

import { useState, useEffect, useTransition } from "react";
import { getPendingWorkspaceCount } from "@/system/Actions/WorkspaceAction";

/**
 * Custom hook to fetch and manage pending workspace count
 * Used in the admin sidebar to show badge count
 * Uses server action instead of API route for better performance
 * Refreshes on page load and when refresh trigger changes
 */
export function usePendingWorkspaceCount(refreshTrigger = 0) {
  const [count, setCount] = useState(0);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const fetchCount = async () => {
      try {
        // Call server action to get the count
        const result = await getPendingWorkspaceCount();

        if (result && result.success) {
          const newCount = result.data?.count || 0;
          setCount(newCount);
        } else {
          console.error(
            "Failed to fetch pending workspace count:",
            result?.errors || "Unknown error"
          );
          setCount(0);
        }
      } catch (error) {
        console.error("Error fetching pending workspace count:", error);
        setCount(0);
      }
    };

    // Fetch count when component mounts or refresh trigger changes
    startTransition(() => {
      fetchCount();
    });
  }, [refreshTrigger]); // Re-run when refreshTrigger changes

  return { count, isLoading: isPending };
}
