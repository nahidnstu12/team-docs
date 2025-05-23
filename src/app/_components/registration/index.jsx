"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

// Dynamically import the dialog component for better performance
const RegistrationDialogComponent = dynamic(
  () => import("./RegistrationDialog"),
  {
    loading: () => (
      <div className="flex items-center justify-center min-h-[100px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    ),
    ssr: false,
  }
);

export default function RegistrationDialog() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[100px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <RegistrationDialogComponent />
    </Suspense>
  );
}
