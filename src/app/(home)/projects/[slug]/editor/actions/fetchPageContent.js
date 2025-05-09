"use server";

import prisma from "@/lib/prisma";

export async function fetchPageContent(pageId) {
	const pageData = await prisma.page.findUnique({
		where: {
			id: pageId,
		},
	});
	console.log(pageData, "pageData from server");
	return pageData;
}
