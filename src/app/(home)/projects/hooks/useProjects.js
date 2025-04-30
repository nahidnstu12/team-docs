import { useStartFetch } from "@/hook/useStartFetch";
import { getAllProjectsFn } from "../actions/getAllProjects";

export function useProjects(
	shouldStartFetchProjects,
	setShouldStartFetchProjects
) {
	const { data, fetchError, showSkeleton } = useStartFetch(
		getAllProjectsFn,
		shouldStartFetchProjects,
		setShouldStartFetchProjects
	);

	return {
		data,
		fetchError,
		showSkeleton,
	};
}
