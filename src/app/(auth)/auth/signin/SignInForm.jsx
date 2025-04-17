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

export default function SignInForm() {
	const router = useRouter();
	const [message, formAction, isPending] = useActionState(signin, {
		message: "",
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
	}, [message, form]);

	return (
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

				{message?.errors?.form && (
					<p className="text-red-600 mb-2 text-sm">{message.errors.form}</p>
				)}

				<SubmitButton isPending={isPending} />

				<div className="text-center pt-4">
					<p className="text-sm text-muted-foreground">
						Don't have an account?{" "}
						<Link href="/auth/signup" className="text-blue-600 hover:underline">
							Sign up
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
			{isPending && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
			Sign In
		</Button>
	);
}
