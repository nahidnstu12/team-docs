"use client";
import { Button } from "@/components/ui/button";
import { useRegistrationStore } from "./store/useRegistrationStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Dynamically import the registration dialog
const RegistrationDialog = dynamic(() => import("./registration"), {
  ssr: false,
});

export default function ActionButton({ isAuthenticated, workspaceId, workspaceStatus }) {
  const { openDialog } = useRegistrationStore();
  const router = useRouter();
  const [buttonText, setButtonText] = useState("Get Started for Free →");

  // Check user authentication and workspace status
  useEffect(() => {
    const checkUserStatus = async () => {
      if (isAuthenticated) {
        if (workspaceId) {
          if (workspaceStatus === "active") {
            setButtonText("Visit your workspace →");
            // router.push(`/workspace/${workspaceId}`);
          } else if (workspaceStatus === "inactive") {
            setButtonText("Your Request are Processing. Please wait...");
          }
        } else {
          setButtonText("Create your workspace →");
        }
      } else {
        setButtonText("Get Started for Free →");
      }
    };

    checkUserStatus();
  }, [router, isAuthenticated, workspaceId, workspaceStatus]);

  return (
    <>
      <Button size="lg" onClick={openDialog} disabled={workspaceStatus === "inactive"}>
        {buttonText}
      </Button>

      {/* Render the registration dialog */}
      <RegistrationDialog isAuthenticated={isAuthenticated} />
    </>
  );
}
