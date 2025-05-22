import { useCallback } from "react";
import { useStartFetch } from "@/hooks/useStartFetch";
import { getAllProjectsFn } from "../actions/getAllProjects";
import { useSearchParams } from "next/navigation";

/**
 * Custom hook for managing projects data with pagination
 * @param {boolean} shouldStartFetchProjects - Trigger for starting the fetch
 * @param {Function} setShouldStartFetchProjects - Function to update the fetch trigger
 * @returns {Object} Projects data and pagination information
 */
export function useProjects(
	shouldStartFetchProjects,
	setShouldStartFetchProjects
) {
	const searchParams = useSearchParams();
	
	// Get current page from URL or default to 1
	const currentPage = Number(searchParams.get("page") || 1);
	const pageSize = 10; // Items per page

	// Use memoized callback to prevent recreation of function on every render
	// and to ensure it captures the latest currentPage value
	const fetchProjectsWithPagination = useCallback(async () => {
		return await getAllProjectsFn({ page: currentPage, pageSize });
	}, [currentPage, pageSize]);

	// This will only re-run when fetchProjectsWithPagination changes (i.e., when page changes)
	const { data: paginatedData, fetchError, showSkeleton } = useStartFetch(
		fetchProjectsWithPagination,
		shouldStartFetchProjects,
		setShouldStartFetchProjects
	);

	return {
		data: paginatedData?.data || [],
		totalItems: paginatedData?.totalItems || 0,
		totalPages: paginatedData?.totalPages || 1,
		currentPage: paginatedData?.currentPage || 1,
		pageSize: paginatedData?.pageSize || pageSize,
		fetchError,
		showSkeleton,
	};
}
