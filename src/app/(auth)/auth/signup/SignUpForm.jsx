"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Eye, EyeOff } from "lucide-react";

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
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import { signup } from "./signupAction";
import { signUpSchema } from "./signupSchema";

export default function SignUpForm() {
	const router = useRouter();
	const [showPassword, setShowPassword] = useState(false);

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

	useEffect(() => {
		if (!formState) return;

		if (formState?.errors) {
			Object.entries(formState.errors).forEach(([field, message]) => {
				form.setError(field, {
					type: "server",
					message: Array.isArray(message) ? message[0] : message,
				});
			});

			if (formState.data) {
				form.reset(formState.data, { keepErrors: true });
			}
		}

		if (formState?.type === "success") {
			router.push(formState.redirectTo);
		}
	}, [formState, form, router]);

	return (
		<div className="w-full max-w-md mx-auto">
			{formState?.type === "success" ? (
				<Card className="border-blue-200 shadow-xl animate-pulse">
					<CardHeader className="text-center">
						<CardTitle className="text-xl text-blue-600">
							Creating your account...
						</CardTitle>
					</CardHeader>
					<CardContent className="flex flex-col items-center justify-center py-6 space-y-4">
						<Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
						<p className="text-sm text-center text-gray-600">
							Redirecting to your Homepage. Please wait...
						</p>
					</CardContent>
				</Card>
			) : (
				<Form {...form}>
					<form action={formAction} className="space-y-6">
						{/* Username */}
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

						{/* Email */}
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

						{/* Password */}
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-lg">Password</FormLabel>
									<FormControl>
										<div className="relative">
											<Input
												type={showPassword ? "text" : "password"}
												placeholder="••••••••"
												className="h-12 text-lg pr-10"
												{...field}
												onChange={(e) => {
													form.clearErrors("password");
													field.onChange(e);
												}}
											/>
											<Button 
												type="button"
												variant="ghost" 
												size="icon" 
												className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground hover:text-foreground"
												onClick={() => setShowPassword(!showPassword)}
												tabIndex={-1}
											>
												{showPassword ? (
													<EyeOff className="h-5 w-5" />
												) : (
													<Eye className="h-5 w-5" />
												)}
												<span className="sr-only">
													{showPassword ? "Hide password" : "Show password"}
												</span>
											</Button>
										</div>
									</FormControl>
									<FormMessage className="text-base" />
								</FormItem>
							)}
						/>

						{/* Global Form Errors */}
						{formState?.errors?._form && (
							<div className="space-y-1 text-sm text-red-500">
								{formState.errors._form.map((msg, index) => (
									<p key={index}>{msg}</p>
								))}
							</div>
						)}

						{/* Submit Button */}
						<SubmitButton isPending={isPending} />

						{/* Auth redirect */}
						<div className="pt-4 text-center">
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
			{isPending ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : null}
			Create Account
		</Button>
	);
}
