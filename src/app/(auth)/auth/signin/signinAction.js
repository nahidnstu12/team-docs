"use server";

import { signIn } from "@/app/auth";
import { signInSchema } from "./signinSchema";
import prisma from "@/lib/prisma";

export async function signin(prevState, formData) {
	try {
		const validatedFields = signInSchema.safeParse({
			email: formData.get("email"),
			password: formData.get("password"),
		});

		if (!validatedFields.success)
			return {
				type: "error",
				message: "Invalid fields",
				errors: validatedFields.error.flatten().fieldErrors,
			};

		const { email, password } = validatedFields.data;

		const existingUser = await prisma.user.findUnique({
			where: { email },
		});

		if (!existingUser) {
			return {
				type: "error",
				errors: { _form: ["Invalid email or password"] },
			};
		}

		let result;
		try {
			result = await signIn("credentials", {
				email,
				password,
				redirect: false,
			});
		} catch (authError) {
			console.error("authjs signin error:", authError);
			return {
				type: "fail",
				errors: { _form: ["Invalid email or password"] },
			};
		}

		if (result?.error) {
			return {
				type: "fail",
				errors: { _form: ["Invalid email or password"] },
			};
		}

		return {
			type: "success",
			message: "Signin successful!",
			redirectTo: "/",
		};
	} catch (error) {
		console.error("signin error (outer):", error);

		return {
			type: "fail",
			errors: { _form: ["Something went wrong on our side"] },
		};
	}
}
