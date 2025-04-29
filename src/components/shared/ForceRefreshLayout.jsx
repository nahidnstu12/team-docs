"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ForceRefreshLayout() {
	const router = useRouter();

	useEffect(() => {
		router.refresh();
	}, [router]);
	return <div className=""></div>;
}
