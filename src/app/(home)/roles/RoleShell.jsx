"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import DrawerLoading from "@/components/loading/DialogLoading";
import LazyPageLoading from "@/components/loading/LazyPageLoading";

const RoleCreateDialogLazy = dynamic(
  () => import("@/app/(home)/roles/components/RoleCreateDialog"),
  {
    ssr: false,
    loading: () => <DrawerLoading />,
  }
);

const RoleListingsLazy = dynamic(() => import("@/app/(home)/roles/components/RoleListings"), {
  loading: () => <LazyPageLoading>Loading Roles...</LazyPageLoading>,
});

export default function RoleShell({ hasRoles }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [shouldStartFetchRoles, setShouldStartFetchRoles] = useState(hasRoles ? true : false);

  return (
    <>
      {isDialogOpen && (
        <RoleCreateDialogLazy
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          setShouldStartFetchRoles={setShouldStartFetchRoles}
        />
      )}

      <RoleListingsLazy
        hasRoles={hasRoles}
        setIsDialogOpen={setIsDialogOpen}
        shouldStartFetchRoles={shouldStartFetchRoles}
        setShouldStartFetchRoles={setShouldStartFetchRoles}
      />
    </>
  );
}
