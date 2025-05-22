"use client";

import { useCallback } from "react";
import { getAllPermissionsFn } from "../actions/getAllPermissions";
import { useStartFetch } from "@/hooks/useStartFetch";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

/**
 * Custom hook for managing permissions data with pagination
 * @param {boolean} startFetchPermissions - Trigger for starting the fetch
 * @param {Function} setStartFetchPermissions - Function to update the fetch trigger
 * @returns {Object} Permissions data and pagination information
 */
export function usePermissions(startFetchPermissions, setStartFetchPermissions) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Get current page and sort parameters from URL
  const currentPage = Number(searchParams.get("page") || 1);
  const pageSize = 10; // Items per page
  const sortBy = searchParams.get("sortBy") || "name";
  const sortOrder = searchParams.get("sortOrder") || "asc";

  // Function to update sort parameters in the URL
  const updateSort = useCallback((newSortBy, newSortOrder) => {
    const params = new URLSearchParams(searchParams);
    params.set("sortBy", newSortBy);
    params.set("sortOrder", newSortOrder);
    
    // Keep the current page
    if (!params.has("page")) {
      params.set("page", "1");
    }
    
    router.push(`${pathname}?${params.toString()}`);
  }, [pathname, router, searchParams]);

  // Handle column header click for sorting
  const handleSort = useCallback((column) => {
    // If clicking the same column, toggle sort order
    if (column === sortBy) {
      const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
      updateSort(column, newSortOrder);
    } else {
      // If clicking a different column, default to ascending
      updateSort(column, "asc");
    }
    
    // Trigger refetch with new sort parameters
    setStartFetchPermissions(true);
  }, [sortBy, sortOrder, setStartFetchPermissions, updateSort]);

  // Use memoized callback to prevent recreation of function on every render
  const fetchPermissionsWithPagination = useCallback(async () => {
    return await getAllPermissionsFn({ 
      page: currentPage, 
      pageSize,
      sortBy, 
      sortOrder 
    });
  }, [currentPage, pageSize, sortBy, sortOrder]);

  // This will only re-run when fetchPermissionsWithPagination changes
  const { data: paginatedData, fetchError, showSkeleton } = useStartFetch(
    fetchPermissionsWithPagination,
    startFetchPermissions,
    setStartFetchPermissions
  );

  return {
    data: paginatedData?.data || [],
    totalItems: paginatedData?.totalItems || 0,
    totalPages: paginatedData?.totalPages || 1,
    currentPage: paginatedData?.currentPage || 1,
    pageSize: paginatedData?.pageSize || pageSize,
    sortBy,
    sortOrder,
    handleSort,
    fetchError,
    showSkeleton
  };
}
