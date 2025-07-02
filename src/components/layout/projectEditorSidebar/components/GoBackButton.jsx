import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function GoBackButton() {
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      className="justify-start px-2 py-2 w-full text-sm rounded-md transition text-muted-foreground hover:bg-gray-100 hover:text-primary"
      onClick={() => {
        router.push("/projects");
      }}
    >
      <ArrowLeft className="mr-2 w-4 h-4" />
      Go Back
    </Button>
  );
}
