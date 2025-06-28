import { usePaginatedFetch } from "@/hooks/usePaginatedFetch";
import { getAllUsersFn } from "../actions/getAllUsers";

/**
 * Custom hook for managing users data, using the reusable usePaginatedFetch hook.
 * @param {boolean} shouldStartFetch - Trigger for starting the fetch.
 * @param {Function} setShouldStartFetch - Function to update the fetch trigger.
 * @returns {Object} An object containing paginated users data, state, and handlers.
 */
export function useUsers(shouldStartFetch, setShouldStartFetch) {
	return usePaginatedFetch(
		getAllUsersFn,
		shouldStartFetch,
		setShouldStartFetch
	);
}
