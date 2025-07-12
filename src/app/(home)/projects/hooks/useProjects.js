import { usePaginatedFetch } from "@/hooks/usePaginatedFetch";
import { getAllProjectsFn } from "../actions/getAllProjects";

/**
 * Custom hook for managing projects data, using the reusable usePaginatedFetch hook.
 * @param {boolean} shouldStartFetch - Trigger for starting the fetch.
 * @param {Function} setShouldStartFetch - Function to update the fetch trigger.
 * @returns {Object} An object containing paginated projects data, state, and handlers.
 */
export function useProjects(shouldStartFetch, setShouldStartFetch) {
	return usePaginatedFetch(
		getAllProjectsFn,
		shouldStartFetch,
		setShouldStartFetch
	);
}

