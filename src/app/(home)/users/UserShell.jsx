"use client";

import { useState } from "react";
import UserLisitngs from "./components/UserListing";
import dynamic from "next/dynamic";
import DrawerLoading from "@/components/loading/DrawerLoading";

const UserCreateDrawerLazy = dynamic(() => import("./components/UserCreateDrawer"), {
  ssr: false,
  loading: () => <DrawerLoading />,
});

export default function UserShell({ userId }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [shouldRefetch, setShouldRefetch] = useState(false);

  const handleUserCreated = () => {
    setShouldRefetch(true);
    setIsDrawerOpen(false);
  };

  return (
    <>
      {isDrawerOpen && (
        <UserCreateDrawerLazy
          isDrawerOpen={isDrawerOpen}
          setIsDrawerOpen={setIsDrawerOpen}
          onSuccess={handleUserCreated}
        />
      )}

      <UserLisitngs
        userId={userId}
        setIsDrawerOpen={setIsDrawerOpen}
        shouldRefetch={shouldRefetch}
        setShouldRefetch={setShouldRefetch}
      />
    </>
  );
}
