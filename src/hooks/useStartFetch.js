import Logger from "@/lib/Logger";
import { useEffect, useState, useTransition } from "react";

/**
 * A custom hook to fetch data on client-side with skeleton loading management.
 *
 * @param {Function} serverAction - The function that returns a promise (server action / API call).
 * @param {boolean} shouldStartFetch - Boolean to start fetching data.
 * @param {Function} setShouldStartFetch - Setter to control when to start fetching.
 */
export function useStartFetch(
	serverAction,
	shouldStartFetch,
	setShouldStartFetch
) {
	const [data, setData] = useState([]);
	const [fetchError, setFetchError] = useState(null);
	const [isLoading, startTransition] = useTransition();
	const [showSkeleton, setShowSkeleton] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const res = await serverAction();
				startTransition(() => setData(res));
				setFetchError(null); // clear old errors
			} catch (error) {
				Logger.error(
					error.message,
					"Error while fetching data in [useStartFetch] HOOK"
				);
				const message =
					error?.message || "Something went wrong while fetching.";
				setFetchError(message);
			} finally {
				setShouldStartFetch(false); // disable trigger
				setShowSkeleton(false); // hide skeleton
			}
		};

		if (shouldStartFetch) {
			fetchData();
		}
	}, [shouldStartFetch, serverAction, setShouldStartFetch]);

	return {
		data,
		fetchError,
		isLoading,
		showSkeleton,
	};
}
