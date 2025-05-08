"use server";

import Logger from "@/lib/Logger";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function savePageContent({ pageId, content }) {
	Logger.success(pageId, "server side content");
	try {
		const updatedPage = await prisma.page.update({
			where: { id: pageId },
			data: {
				content: content,
			},
		});

		// revalidatePath(`/project/${pageId}`); // Optional: revalidate cache

		return {
			success: true,
			message: "Page content saved successfully.",
			page: updatedPage,
		};
	} catch (error) {
		console.error("Failed to save page content:", error);
		return {
			success: false,
			message: "Failed to save page content.",
			error: error.message,
		};
	}
}
