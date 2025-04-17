"use server";

import { signOut } from "@/app/auth";

export async function signout() {
	await signOut();
}
