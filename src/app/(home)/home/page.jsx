import ForceRefreshLayout from "@/components/shared/ForceRefreshLayout";

export default async function MainPage() {
	// await new Promise(() => {}); // infinite pending

	return (
		<div className="">
			MainPage
			<ForceRefreshLayout />
		</div>
	);
}
