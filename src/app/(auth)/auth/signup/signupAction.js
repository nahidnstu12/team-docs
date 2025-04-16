"use server";

import { signIn } from "@/app/auth";
import prisma from "@/lib/prisma";
import { AuthError } from "@auth/core/errors";
import bcrypt from "bcryptjs";
import { signUpSchema } from "./signupSchema";

export async function signup(prevState, formData) {
	try {
		const validatedFields = signUpSchema.safeParse({
			username: formData.get("username"),
			email: formData.get("email"),
			password: formData.get("password"),
		});

		if (!validatedFields.success) {
			return {
				message: "Invalid fields",
				errors: validatedFields.error.flatten().fieldErrors,
			};
		}

		const { username, email, password } = validatedFields.data;

		const existingUser = await prisma.user.findUnique({ where: { email } });
		if (existingUser) {
			return { message: "User already exists with this email" };
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		await prisma.user.create({
			data: {
				name: username,
				email,
				password: hashedPassword,
			},
		});

		// Sign in the user right after signup
		await signIn("credentials", {
			email,
			password,
			redirectTo: "/",
		});
	} catch (error) {
		if (error instanceof AuthError) {
			return {
				message: error.message,
				errors: undefined,
			};
		}
		throw error;
	}
}
