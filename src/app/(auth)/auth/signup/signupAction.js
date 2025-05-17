"use server";

import { signIn } from "@/app/auth";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signUpSchema } from "./signupSchema";

export async function signup(prevState, formData) {
	try {
		const validatedFields = signUpSchema.safeParse({
			username: formData.get("username"),
			email: formData.get("email"),
			password: formData.get("password"),
		});

		if (!validatedFields.success)
			return {
				type: "error",
				message: "Invalid fields",
				errors: validatedFields.error.flatten().fieldErrors,
			};

		const { username, email, password } = validatedFields.data;

		const existingUserName = await prisma.user.findUnique({
			where: { username },
		});
		if (existingUserName)
			return {
				type: "error",
				errors: { _form: ["User already exists with this username"] },
			};

		const existingUserEmail = await prisma.user.findUnique({
			where: { email },
		});
		if (existingUserEmail)
			return {
				type: "error",
				errors: { _form: ["User already exists with this email"] },
			};

		const hashedPassword = await bcrypt.hash(password, 10);

		const userCreate = await prisma.user.create({
			data: {
				username,
				email,
				password: hashedPassword,
			},
		});

		if (!userCreate)
			return {
				type: "fail",
				success: false,
				errors: { _form: ["Something went wrong while creating the user"] },
			};

		const result = await signIn("credentials", {
			email,
			password,
			redirect: false,
		});

		if (result?.error) {
			return {
				type: "fail",
				success: false,
				errors: { _form: ["signin error"] },
			};
		}

		return {
			type: "success",
			success: true,
			message: "Signup successful!",
			redirectTo: "/",
		};
	} catch (error) {
		console.error("signup error: ", error);

		return {
			success: false,
			type: "fail",
			errors: { _form: ["Something went wrong on our side"] },
		};
	}
}
