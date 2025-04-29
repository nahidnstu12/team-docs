import ForceRefreshLayout from "../../../../../components/shared/ForceRefreshLayout";

export default async function ProjectEditorPage({ params }) {
	const { slug } = await params;
	return (
		<div className="">
			ProjectEditorPage: {slug}
			<ForceRefreshLayout />
		</div>
	);
}
