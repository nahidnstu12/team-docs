"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { signup } from "./signupAction";
import { signUpSchema } from "./signupSchema";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardBody, CardHeader } from "@heroui/card";

export default function SignUpForm() {
	const router = useRouter();
	const [formState, formAction, isPending] = useActionState(signup, {
		message: null,
		errors: null,
	});

	const form = useForm({
		resolver: zodResolver(signUpSchema),
		defaultValues: {
			username: "",
			email: "",
			password: "",
		},
	});

	console.log(formState);

	useEffect(() => {
		if (!formState) return;

		if (formState?.errors) {
			Object.entries(formState.errors).forEach(([field, message]) => {
				form.setError(field, {
					type: "server",
					message: Array.isArray(message) ? message[0] : message,
				});

				if (field === "_form") toast.error(message[0]);
			});

			if (formState.data) {
				form.reset(formState.data, { keepErrors: true });
			}
		}

		if (formState?.type === "success") {
			router.push(formState.redirectTo);
		}
	}, [
		formState.errors,
		form,
		formState.redirectTo,
		formState?.type,
		router,
		formState,
	]);

	return (
		<div className="max-w-md w-full mx-auto">
			{formState?.type === "success" ? (
				<Card className="animate-pulse shadow-xl border-blue-200">
					<CardHeader className="text-center">
						<h1 className="text-xl font-semibold text-blue-600">
							Creating your account...
						</h1>
					</CardHeader>
					<CardBody className="flex flex-col items-center justify-center space-y-4 py-6">
						<Loader2 className="h-8 w-8 animate-spin text-blue-500" />
						<p className="text-sm text-gray-600">
							Redirecting to your dashboard. Please wait...
						</p>
					</CardBody>
				</Card>
			) : (
				<Form {...form}>
					<form action={formAction} className="space-y-6">
						{/* Username Field */}
						<FormField
							control={form.control}
							name="username"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-lg">Username</FormLabel>
									<FormControl>
										<Input
											placeholder="username"
											className="h-12 text-lg"
											{...field}
											onChange={(e) => {
												form.clearErrors("username");
												field.onChange(e);
											}}
										/>
									</FormControl>
									<FormMessage className="text-base" />
								</FormItem>
							)}
						/>

						{/* Email Field */}
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-lg">Email</FormLabel>
									<FormControl>
										<Input
											type="email"
											placeholder="your@email.com"
											className="h-12 text-lg"
											{...field}
											onChange={(e) => {
												form.clearErrors("email");
												field.onChange(e);
											}}
										/>
									</FormControl>
									<FormMessage className="text-base" />
								</FormItem>
							)}
						/>

						{/* Password Field */}
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-lg">Password</FormLabel>
									<FormControl>
										<Input
											type="password"
											placeholder="••••••••"
											className="h-12 text-lg"
											{...field}
											onChange={(e) => {
												form.clearErrors("password");
												field.onChange(e);
											}}
										/>
									</FormControl>
									<FormMessage className="text-base" />
								</FormItem>
							)}
						/>

						{/* Form-wide Errors */}
						{formState?.errors?._form && (
							<div className="text-red-500 text-sm space-y-1">
								{formState.errors._form.map((msg, index) => (
									<p key={index}>{msg}</p>
								))}
							</div>
						)}

						{/* Submit */}
						<SubmitButton isPending={isPending} />

						{/* Link to Sign In */}
						<div className="text-center pt-4">
							<p className="text-sm text-muted-foreground">
								Already have an account?{" "}
								<Link
									href="/auth/signin"
									className="text-blue-600 hover:underline"
								>
									Sign in
								</Link>
							</p>
						</div>
					</form>
				</Form>
			)}
		</div>
	);
}

function SubmitButton({ isPending }) {
	return (
		<Button
			type="submit"
			className="w-full h-12 text-lg font-semibold"
			disabled={isPending}
		>
			{isPending ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
			Create Account
		</Button>
	);
}
