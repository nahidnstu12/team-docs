import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
	return (
		<Spinner className="flex flex-col items-center justify-center" size="large">
			Loading Homepage...
		</Spinner>
	);
}
