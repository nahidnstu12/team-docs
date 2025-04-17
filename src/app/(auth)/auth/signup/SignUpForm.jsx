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
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { signup } from "./signupAction";
import { signUpSchema } from "./signupSchema";
import { useRouter } from "next/navigation";

export default function SignUpForm() {
	const router = useRouter();
	const [message, formAction, isPending] = useActionState(signup, {
		message: "",
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
		if (message?.errors) {
			Object.entries(message.errors).forEach(([field, messages]) => {
				form.setError(field, {
					type: "server",
					message: Array.isArray(messages) ? messages[0] : messages,
				});
			});

			form.setValue("password", "");
		}

		if (message?.type === "success" && message.redirectTo) {
			router.push(message.redirectTo);
		}
	}, [message?.errors, form]);

	return (
		<Form {...form}>
			<form action={formAction} className="space-y-6">
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

				{message?.message && !message?.errors && (
					<div className="text-red-500 text-sm">{message.message}</div>
				)}

				<SubmitButton isPending={isPending} />

				<div className="text-center pt-4">
					<p className="text-sm text-muted-foreground">
						Already have an account?{" "}
						<Link href="/auth/signin" className="text-blue-600 hover:underline">
							Sign in
						</Link>
					</p>
				</div>
			</form>
		</Form>
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
