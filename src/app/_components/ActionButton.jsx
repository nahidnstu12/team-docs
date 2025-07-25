"use client";
import { Button } from "@/components/ui/button";
import { useRegistrationStore } from "./store/useRegistrationStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, Clock, AlertCircle, Plus } from "lucide-react";
import dynamic from "next/dynamic";

// Dynamically import the registration dialog
const RegistrationDialog = dynamic(() => import("./registration"), {
  ssr: false,
});

export default function ActionButton({ session, isAuthenticated, workspaceId, workspaceStatus }) {
  const { openDialog, registrationSuccess, registrationData, resetRegistrationState } =
    useRegistrationStore();
  const router = useRouter();
  const [buttonText, setButtonText] = useState("Get Started for Free");
  const [buttonIcon, setButtonIcon] = useState(null);
  const [isDisabled, setIsDisabled] = useState(false);

  // Check user authentication and workspace status
  useEffect(() => {
    const checkUserStatus = async () => {
      // Handle immediate post-registration state
      if (registrationSuccess && registrationData) {
        if (isAuthenticated) {
          // Authenticated user created workspace - show processing state
          setButtonText("Request Processing...");
          setButtonIcon(<Clock className="ml-2 h-4 w-4 animate-spin" />);
          setIsDisabled(true);
        } else {
          // New user registration - show processing state
          setButtonText("Registration Processing...");
          setButtonIcon(<Clock className="ml-2 h-4 w-4 animate-spin" />);
          setIsDisabled(true);
        }
        return;
      }

      if (isAuthenticated) {
        if (session && session?.status !== "ACTIVE") {
          setButtonText("Account Inactive");
          setButtonIcon(<AlertCircle className="ml-2 h-4 w-4" />);
          setIsDisabled(true);
          return;
        }
        if (workspaceId) {
          if (session && session?.status === "ACTIVE" && workspaceStatus === "ACTIVE") {
            setButtonText("Visit your workspace");
            setButtonIcon(<ArrowRight className="ml-2 h-4 w-4" />);
            setIsDisabled(false);
          } else if (workspaceStatus === "PENDING") {
            setButtonText("Request Processing...");
            setButtonIcon(<Clock className="ml-2 h-4 w-4 animate-spin" />);
            setIsDisabled(true);
          } else if (workspaceStatus === "INACTIVE") {
            setButtonText("Workspace Inactive");
            setButtonIcon(<AlertCircle className="ml-2 h-4 w-4" />);
            setIsDisabled(true);
          }
        } else {
          setButtonText("Create your workspace");
          setButtonIcon(<Plus className="ml-2 h-4 w-4" />);
          setIsDisabled(false);
        }
      } else {
        setButtonText("Get Started for Free");
        setButtonIcon(<ArrowRight className="ml-2 h-4 w-4" />);
        setIsDisabled(false);
      }
    };

    checkUserStatus();
  }, [
    isAuthenticated,
    workspaceId,
    workspaceStatus,
    session,
    registrationSuccess,
    registrationData,
  ]);

  // Reset registration state after server props are updated
  useEffect(() => {
    if (registrationSuccess && (workspaceId || session)) {
      // Server props have been updated, reset the registration state
      const timer = setTimeout(() => {
        resetRegistrationState();
      }, 1000); // Small delay to ensure smooth transition

      return () => clearTimeout(timer);
    }
  }, [registrationSuccess, workspaceId, session, resetRegistrationState]);

  const handleButtonClick = () => {
    // Don't allow clicks during registration processing
    if (registrationSuccess) {
      return;
    }

    if (
      isAuthenticated &&
      workspaceId &&
      workspaceStatus === "ACTIVE" &&
      session?.status === "ACTIVE"
    ) {
      // Redirect to workspace when button is clicked
      router.push(`/home`);
    } else {
      // Open registration dialog for other cases
      openDialog();
    }
  };

  return (
    <>
      <Button
        size="lg"
        onClick={handleButtonClick}
        disabled={isDisabled}
        className="flex items-center justify-center mx-auto"
      >
        {buttonText}
        {buttonIcon}
      </Button>

      {/* Render the registration dialog */}
      <RegistrationDialog isAuthenticated={isAuthenticated} />
    </>
  );
}
