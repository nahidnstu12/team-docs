"use client";

import { useState } from "react";
import UserLisitngs from "./components/UserListing";
import dynamic from "next/dynamic";
import DialogLoading from "@/components/loading/DialogLoading";

const UserCreateDialogLazy = dynamic(() => import("./components/UserCreateDialog"), {
  ssr: false,
  loading: () => <DialogLoading />,
});

export default function UserShell() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [shouldRefetch, setShouldRefetch] = useState(false);

  return (
    <>
      {isDialogOpen && (
        <UserCreateDialogLazy
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          onSuccess={() => setShouldRefetch(true)}
        />
      )}

      <UserLisitngs
        setIsDialogOpen={setIsDialogOpen}
        shouldRefetch={shouldRefetch}
        setShouldRefetch={setShouldRefetch}
      />
    </>
  );
}
