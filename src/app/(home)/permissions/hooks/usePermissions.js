"use client";

import { useCallback } from "react";
import { getAllPermissionsFn } from "../actions/getAllPermissions";
import { useStartFetch } from "@/hooks/useStartFetch";
import { useSearchParams } from "next/navigation";

/**
 * Custom hook for managing permissions data with pagination
 * @param {boolean} startFetchPermissions - Trigger for starting the fetch
 * @param {Function} setStartFetchPermissions - Function to update the fetch trigger
 * @returns {Object} Permissions data and pagination information
 */
export function usePermissions(startFetchPermissions, setStartFetchPermissions) {
  const searchParams = useSearchParams();
  
  // Get current page from URL or default to 1
  const currentPage = Number(searchParams.get("page") || 1);
  const pageSize = 10; // Items per page

  // Use memoized callback to prevent recreation of function on every render
  // and to ensure it captures the latest currentPage value
  const fetchPermissionsWithPagination = useCallback(async () => {
    return await getAllPermissionsFn({ page: currentPage, pageSize });
  }, [currentPage, pageSize]);

  // This will only re-run when fetchPermissionsWithPagination changes (i.e., when page changes)
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
    fetchError,
    showSkeleton
  };
}
