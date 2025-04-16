"use server";

import { signIn } from "@/app/auth";
import { AuthError } from "@auth/core/errors";
import { signInSchema } from "./signinSchema";

export async function signin(prevState, formData) {
	try {
		const validatedFields = signInSchema.safeParse({
			email: formData.get("email"),
			password: formData.get("password"),
		});

		console.log("server action signin message", validatedFields);

		if (!validatedFields.success) {
			return {
				message: "Invalid fields",
				errors: validatedFields.error.flatten().fieldErrors,
			};
		}

		await signIn("credentials", {
			email: validatedFields.data.email,
			password: validatedFields.data.password,
			redirectTo: "/",
		});
	} catch (error) {
		if (error instanceof AuthError) {
			console.log("authenticate error", error);
			return {
				message: error.message,
				errors: undefined,
			};
		}
		throw error;
	}
}
