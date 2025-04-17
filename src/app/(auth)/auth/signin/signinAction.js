"use server";

import { signIn } from "@/app/auth";
import { signInSchema } from "./signinSchema";

export async function signin(prevState, formData) {
	try {
		const validatedFields = signInSchema.safeParse({
			email: formData.get("email"),
			password: formData.get("password"),
		});

		if (!validatedFields.success) {
			return {
				type: "error",
				message: "Invalid fields",
				errors: validatedFields.error.flatten().fieldErrors,
			};
		}

		const result = await signIn("credentials", {
			email: validatedFields.data.email,
			password: validatedFields.data.password,
			redirect: false,
		});

		if (result?.error) {
			return {
				type: "error",
				message: "Invalid email or password",
				errors: { form: result.error },
			};
		}

		return {
			type: "success",
			message: "Singin successful!",
			redirectTo: "/",
		};
	} catch (error) {
		console.error("signin error: ", error);

		return {
			type: "error",
			message: "Invalid email or password",
			errors: { form: "Invalid email or password" },
		};
	}
}
