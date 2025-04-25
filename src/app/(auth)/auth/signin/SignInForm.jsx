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
		<div className="w-full max-w-md mx-auto">
			{formState?.type === "success" ? (
				<Card className="border-blue-200 shadow-xl animate-pulse">
					<CardHeader className="text-center">
						<h1 className="text-xl font-semibold text-center text-blue-600">
							Signin is in Process...
						</h1>
					</CardHeader>
					<CardBody className="flex flex-col items-center justify-center py-6 space-y-4">
						<Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
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
							<div className="space-y-1 text-sm text-red-500">
								{formState.errors._form.map((msg, index) => (
									<p key={index}>{msg}</p>
								))}
							</div>
						)}

						<SubmitButton isPending={isPending} />

						<div className="pt-4 text-center">
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
			{isPending && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
			Sign In
		</Button>
	);
}
