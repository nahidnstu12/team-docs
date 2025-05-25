import { Skeleton } from "../ui/skeleton";
import { TableCell, TableRow } from "../ui/table";

export default function TableLoading() {
	return [...Array(5)].map((_, i) => (
		<TableRow key={`skeleton-${i}`} className="animate-pulse">
			<TableCell className="px-6 py-5">
				<Skeleton className="w-3/4 h-4 rounded-md" />
			</TableCell>
			<TableCell className="px-6 py-5">
				<Skeleton className="w-5/6 h-4 rounded-md" />
			</TableCell>
			<TableCell className="px-6 py-5 text-center">
				<Skeleton className="w-10 h-4 mx-auto rounded-md" />
			</TableCell>
			<TableCell className="px-6 py-5 text-center">
				<Skeleton className="w-1/2 h-10 mx-auto rounded-md" />
			</TableCell>
		</TableRow>
	));
}
