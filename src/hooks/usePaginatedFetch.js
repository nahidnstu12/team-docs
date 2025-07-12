import { useCallback, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useStartFetch } from "./useStartFetch";

/**
 * A generic custom hook for managing paginated data with client-side fetching control.
 * @param {Function} serverAction - The server action to call for fetching data.
 * @param {boolean} shouldStartFetch - Boolean to trigger the initial fetch.
 * @param {Function} setShouldStartFetch - Setter to control the fetch trigger.
 * @returns {Object} - An object containing paginated data, state, and handlers.
 */
export function usePaginatedFetch(
	serverAction,
	shouldStartFetch,
	setShouldStartFetch
) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	// Get current page and sort parameters from URL
	const currentPage = Number(searchParams.get("page") || 1);
	const pageSize = 10; // Items per page
	const sortBy = searchParams.get("sortBy") || "name";
	const sortOrder = searchParams.get("sortOrder") || "asc";

	// Effect to trigger refetch when URL params change
	useEffect(() => {
		setShouldStartFetch(true);
	}, [currentPage, sortBy, sortOrder, setShouldStartFetch]);

	// Function to update sort parameters in the URL
	const updateSort = useCallback(
		(newSortBy, newSortOrder) => {
			const params = new URLSearchParams(searchParams);
			params.set("sortBy", newSortBy);
			params.set("sortOrder", newSortOrder);

			// Keep the current page
			if (!params.has("page")) {
				params.set("page", "1");
			}

			router.push(`${pathname}?${params.toString()}`);
		},
		[pathname, router, searchParams]
	);

	// Handle column header click for sorting
	const handleSort = useCallback(
		(column) => {
			// If clicking the same column, toggle sort order
			if (column === sortBy) {
				const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
				updateSort(column, newSortOrder);
			} else {
				// If clicking a different column, default to ascending
				updateSort(column, "asc");
			}
		},
		[sortBy, sortOrder, updateSort]
	);

	// Use memoized callback to prevent recreation of function on every render
	const fetchPaginatedData = useCallback(async () => {
		return await serverAction({ 
			page: currentPage, 
			pageSize,
			sortBy, 
			sortOrder 
		});
	}, [currentPage, pageSize, sortBy, sortOrder, serverAction]);

	// This will only re-run when fetchPaginatedData changes
	const { data: paginatedData, fetchError, showSkeleton } = useStartFetch(
		fetchPaginatedData,
		shouldStartFetch,
		setShouldStartFetch
	);

	return {
		data: paginatedData?.data || [],
		totalItems: paginatedData?.totalItems || 0,
		totalPages: paginatedData?.totalPages || 1,
		currentPage: paginatedData?.currentPage || 1,
		pageSize: paginatedData?.pageSize || pageSize,
		sortBy,
		sortOrder,
		handleSort,
		fetchError,
		showSkeleton,
	};
}
