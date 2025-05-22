import { useState, useRef, useCallback } from "react";
import { getAllRolesFn } from "../actions/getAllRoles";
import { useStartFetch } from "@/hooks/useStartFetch";
import { useSearchParams } from "next/navigation";

/**
 * Custom hook for managing roles data with pagination
 * @param {boolean} shouldStartFetchRoles - Trigger for starting the fetch
 * @param {Function} setShouldStartFetchRoles - Function to update the fetch trigger
 * @returns {Object} Roles data and pagination information
 */
export function useRoles(shouldStartFetchRoles, setShouldStartFetchRoles) {
  const [openPermissionAssignDialog, setOpenPermissionAssignDialog] = useState(false);
  const selectedRoleId = useRef(null);
  const searchParams = useSearchParams();
  
  // Get current page from URL or default to 1
  const currentPage = Number(searchParams.get("page") || 1);
  const pageSize = 10; // Items per page

  // Use memoized callback to prevent recreation of function on every render
  // and to ensure it captures the latest currentPage value
  const fetchRolesWithPagination = useCallback(async () => {
    return await getAllRolesFn({ page: currentPage, pageSize });
  }, [currentPage, pageSize]);

  // This will only re-run when fetchRolesWithPagination changes (i.e., when page changes)
  const { data: paginatedData, fetchError, showSkeleton } = useStartFetch(
    fetchRolesWithPagination,
    shouldStartFetchRoles,
    setShouldStartFetchRoles
  );

  return {
    data: paginatedData?.data || [],
    totalItems: paginatedData?.totalItems || 0,
    totalPages: paginatedData?.totalPages || 1,
    currentPage: paginatedData?.currentPage || 1,
    pageSize: paginatedData?.pageSize || pageSize,
    fetchError,
    showSkeleton,
    selectedRoleId,
    openPermissionAssignDialog,
    setOpenPermissionAssignDialog,
  };
}
