import AssignDevHeader from "./components/AssignDevHeader";
import DevListings from "./components/DevListings";

export default async function ProjectAssignDevPage({ params }) {
	const { slug } = await params;
	return (
		<div className="">
			<AssignDevHeader projectName={slug} />
			<DevListings />
		</div>
	);
}
