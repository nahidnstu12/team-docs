"use server";

import prisma from "@/lib/prisma";

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
