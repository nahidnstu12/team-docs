import SignInForm from "./SignInForm";

export default async function SignInPage() {
	return (
		<div className="p-8 space-y-8">
			<div className="space-y-2 text-center">
				<h1 className="text-3xl font-bold text-gray-900">Welcome back</h1>
				<p className="text-gray-600">
					Enter your credentials to access your account
				</p>
			</div>
			<SignInForm />
		</div>
	);
}
