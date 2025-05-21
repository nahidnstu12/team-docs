import { useState, useRef } from "react";
import { getAllRolesFn } from "../actions/getAllRoles";
import { useStartFetch } from "@/hooks/useStartFetch";

export function useRoles(shouldStartFetchRoles, setShouldStartFetchRoles) {
  const [openPermissionAssignDialog, setOpenPermissionAssignDialog] = useState(false);
  const selectedRoleId = useRef(null);

  const { data, fetchError, showSkeleton } = useStartFetch(
    getAllRolesFn,
    shouldStartFetchRoles,
    setShouldStartFetchRoles
  );

  return {
    data,
    fetchError,
    showSkeleton,
    selectedRoleId,
    openPermissionAssignDialog,
    setOpenPermissionAssignDialog,
  };
}
