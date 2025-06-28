import { useState, useRef } from "react";
import { usePaginatedFetch } from "@/hooks/usePaginatedFetch";
import { getAllRolesFn } from "../actions/getAllRoles";

/**
 * Custom hook for managing roles data, using the reusable usePaginatedFetch hook.
 * It also includes logic for managing the permission assignment dialog.
 * @param {boolean} shouldStartFetch - Trigger for starting the fetch.
 * @param {Function} setShouldStartFetch - Function to update the fetch trigger.
 * @returns {Object} An object containing paginated roles data, state, and handlers.
 */
export function useRoles(shouldStartFetch, setShouldStartFetch) {
  const [openPermissionAssignDialog, setOpenPermissionAssignDialog] = useState(false);
  const selectedRoleId = useRef(null);

  const paginatedData = usePaginatedFetch(
    getAllRolesFn,
    shouldStartFetch,
    setShouldStartFetch
  );

  return {
    ...paginatedData,
    selectedRoleId,
    openPermissionAssignDialog,
    setOpenPermissionAssignDialog,
  };
}
