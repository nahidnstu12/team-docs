"use client";

import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useProjectStore } from "@/app/(home)/projects/store/useProjectStore";

export default function HomeButton() {
  const router = useRouter();
  const setSelectedPage = useProjectStore((state) => state.setSelectedPage);

  return (
    <Button
      variant="ghost"
      className="justify-start px-2 py-2 w-full text-sm rounded-md transition text-muted-foreground hover:bg-gray-100 hover:text-primary"
      onClick={() => {
        router.push("/home");
        router.refresh();
      }}
    >
      <Home className="mr-2 w-4 h-4" />
      Go to Home
    </Button>
  );
}
