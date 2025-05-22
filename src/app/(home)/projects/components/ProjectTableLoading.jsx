"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableRow } from "@/components/ui/table";

/**
 * Project-specific table loading skeleton that matches the exact column structure
 * of the projects table for consistent width distribution
 */
export default function ProjectTableLoading() {
  return [...Array(5)].map((_, i) => (
    <TableRow key={`project-skeleton-${i}`} className="animate-pulse">
      <TableCell className="px-6 py-5 w-[160px]">
        <Skeleton className="w-3/4 h-4 rounded-md" />
      </TableCell>
      <TableCell className="px-6 py-5 w-[300px]">
        <Skeleton className="w-5/6 h-4 rounded-md" />
      </TableCell>
      <TableCell className="px-6 py-5 text-center w-[320px]">
        <div className="flex gap-3 justify-center items-center">
          <Skeleton className="w-20 h-8 rounded-md" />
          <Skeleton className="w-20 h-8 rounded-md" />
          <Skeleton className="w-20 h-8 rounded-md" />
        </div>
      </TableCell>
    </TableRow>
  ));
}
