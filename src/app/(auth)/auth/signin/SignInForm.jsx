"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useActionState, useEffect } from "react";
import Link from "next/link";
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
import { signin } from "./signinAction";
import { signInSchema } from "./signinSchema";
import { useRouter } from "next/navigation";
import { Card, CardBody, CardHeader } from "@heroui/card";

export default function SignInForm() {
	const router = useRouter();
	const [formState, formAction, isPending] = useActionState(signin, {
		message: null,
		errors: null,
	});

	const form = useForm({
		resolver: zodResolver(signInSchema),
		defaultValues: {
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

			form.setValue("password", "");
		}

		if (formState?.type === "success") {
			router.push(formState.redirectTo);
		}
	}, [formState, form, router]);

	return (
		<div className="max-w-md w-full mx-auto">
			{formState?.type === "success" ? (
				<Card className="animate-pulse shadow-xl border-blue-200">
					<CardHeader className="text-center">
						<h1 className="text-xl font-semibold text-blue-600">
							Signin is in Process...
						</h1>
					</CardHeader>
					<CardBody className="flex flex-col items-center justify-center space-y-4 py-6">
						<Loader2 className="h-8 w-8 animate-spin text-blue-500" />
						<p className="text-sm text-gray-600">
							Redirecting to your Homepage. Please wait...
						</p>
					</CardBody>
				</Card>
			) : (
				<Form {...form}>
					<form action={formAction} className="space-y-6">
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-lg">Email</FormLabel>
									<FormControl>
										<Input
											placeholder="your@email.com"
											{...field}
											className="h-12 text-lg"
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
											{...field}
											className="h-12 text-lg"
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

						{formState?.errors?._form && (
							<div className="text-red-500 text-sm space-y-1">
								{formState.errors._form.map((msg, index) => (
									<p key={index}>{msg}</p>
								))}
							</div>
						)}

						<SubmitButton isPending={isPending} />

						<div className="text-center pt-4">
							<p className="text-sm text-muted-foreground">
								Don&apos;t have an account?{" "}
								<Link
									href="/auth/signup"
									className="text-blue-600 hover:underline"
								>
									Sign up
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
			{isPending && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
			Sign In
		</Button>
	);
}
