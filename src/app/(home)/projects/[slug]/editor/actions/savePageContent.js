"use server";

import Logger from "@/lib/Logger";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function savePageContent({ pageId, content }) {
  try {
    // Ensure content is properly stringified for database storage
    const contentString = typeof content === "string" ? content : JSON.stringify(content);

    const updatedPage = await prisma.page.update({
      where: { id: pageId },
      data: {
        content: contentString,
      },
    });

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
