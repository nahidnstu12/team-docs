export default function ClientErrorUI({ errorMessage, retry = () => {} }) {
	return (
		<div className="flex flex-col items-center justify-start w-full h-full p-8 text-red-700 border rounded-lg bg-red-50">
			<h2 className="mb-8 text-5xl font-bold">
				Something went wrong while fetching
			</h2>
			<p className="min-h-[320px] w-full px-2 py-2 font-mono text-sm bg-red-200 ">
				{errorMessage}
			</p>
			<button
				className="px-5 py-2 mt-auto text-white transition bg-red-600 rounded hover:bg-red-500"
				onClick={() => retry(true)}
			>
				Retry
			</button>
		</div>
	);
}
