import { ReactNode } from "react";

export default function AuthLayout({ children }) {
	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
			<div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
				{children}
			</div>
		</div>
	);
}
