import { Spinner } from "../ui/spinner";

export default function DrawerLoading() {
	return (
		<div className="fixed inset-0 z-[9999] bg-black/40 flex items-center justify-center">
			<div className="relative w-[600px] h-[500px] bg-muted border rounded-lg shadow-lg flex items-center justify-center">
				<Spinner size="medium">Opening drawer...</Spinner>
			</div>
		</div>
	);
}
