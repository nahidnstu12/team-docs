"use client";

import { usePaginatedFetch } from "@/hooks/usePaginatedFetch";
import { getAllPermissionsFn } from "../actions/getAllPermissions";

/**
 * Custom hook for managing permissions data, using the reusable usePaginatedFetch hook.
 * @param {boolean} shouldStartFetch - Trigger for starting the fetch.
 * @param {Function} setShouldStartFetch - Function to update the fetch trigger.
 * @returns {Object} An object containing paginated permissions data, state, and handlers.
 */
export function usePermissions(shouldStartFetch, setShouldStartFetch) {
  return usePaginatedFetch(
    getAllPermissionsFn,
    shouldStartFetch,
    setShouldStartFetch
  );
}
