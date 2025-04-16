import SignUpForm from "./SignUpForm";

export default function SignUpPage() {
	return (
		<div className="p-8 space-y-8">
			<div className="text-center space-y-2">
				<h1 className="text-3xl font-bold text-gray-900">Create an account</h1>
				<p className="text-gray-600">Get started with our platform</p>
			</div>
			<SignUpForm />
		</div>
	);
}
