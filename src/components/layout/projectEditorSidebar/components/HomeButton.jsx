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
            className="justify-start w-full px-2 py-2 text-sm transition rounded-md text-muted-foreground hover:bg-gray-100 hover:text-primary"
            onClick={() => {
                router.push("/home");
                router.refresh();
                setSelectedPage(null);
            }}
        >
            <Home className="w-4 h-4 mr-2" />
            Go to Home
        </Button>
    );
}