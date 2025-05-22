"use server";

import { Session } from "@/lib/Session";
import { ProjectService } from "@/system/Services/ProjectServices";

/**
 * Server action to fetch all projects with pagination support
 * @param {Object} options - Pagination options
 * @param {number} options.page - Current page number (1-indexed)
 * @param {number} options.pageSize - Number of items per page
 * @returns {Promise<{data: Array, totalItems: number, totalPages: number}>}
 */
export async function getAllProjectsFn(options = {}) {
	const workspaceId = await Session.getWorkspaceIdForUser();
	const { page = 1, pageSize = 10 } = options;

	const whereClause = { workspaceId };

	// Get total count for pagination
	const totalItems = await ProjectService.countResources({ where: whereClause });
	
	// Calculate pagination parameters
	const skip = (page - 1) * pageSize;
	const take = pageSize;
	const totalPages = Math.ceil(totalItems / pageSize);

	// Get paginated data
	const projects = await ProjectService.getAllResources({ 
		where: whereClause,
		pagination: { skip, take }
	});

	return {
		data: projects,
		totalItems,
		totalPages,
		currentPage: page,
		pageSize
	};
}
