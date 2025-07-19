import { TableCell, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export default function DevListingsSkeleton() {
  return (
    <>
      {[1, 2, 3].map((i) => (
        <TableRow key={i}>
          <TableCell className="px-6 py-5">
            <Skeleton className="h-6 w-[200px]" />
          </TableCell>
          <TableCell className="px-6 py-5">
            <Skeleton className="h-6 w-[300px]" />
          </TableCell>
          <TableCell className="px-6 py-5">
            <div className="flex items-center justify-center gap-3">
              <Skeleton className="h-10 w-[100px]" />
              <Skeleton className="h-10 w-[100px]" />
            </div>
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}
