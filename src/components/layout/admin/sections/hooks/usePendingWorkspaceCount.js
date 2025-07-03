"use client";

import { useState, useEffect } from "react";

/**
 * Custom hook to fetch and manage pending workspace count
 * Used in the admin sidebar to show real-time badge count
 */
export function usePendingWorkspaceCount() {
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        setIsLoading(true);
        
        // Create a server action to get the count
        const response = await fetch("/api/admin/workspace-count", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setCount(data.count || 0);
        } else {
          console.error("Failed to fetch pending workspace count");
          setCount(0);
        }
      } catch (error) {
        console.error("Error fetching pending workspace count:", error);
        setCount(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCount();

    // Set up polling to refresh count every 30 seconds
    const interval = setInterval(fetchCount, 30000);

    return () => clearInterval(interval);
  }, []);

  return { count, isLoading };
}
