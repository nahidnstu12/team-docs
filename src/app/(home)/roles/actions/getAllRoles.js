"use server";

import { Session } from "@/lib/Session";
import { RoleService } from "@/system/Services/RoleServices";

/**
 * Server action to fetch all roles with pagination support
 * @param {Object} options - Pagination options
 * @param {number} options.page - Current page number (1-indexed)
 * @param {number} options.pageSize - Number of items per page
 * @returns {Promise<{data: Array, totalItems: number, totalPages: number}>}
 */
export async function getAllRolesFn(options = {}) {
	const session = await Session.getCurrentUser();
	const { page = 1, pageSize = 10 } = options;

	const whereClause = {
		OR: [{ isSystem: true }, { ownerId: session?.id }],
	};

	// Get total count for pagination
	const totalItems = await RoleService.countResources({ where: whereClause });
	
	// Calculate pagination parameters
	const skip = (page - 1) * pageSize;
	const take = pageSize;
	const totalPages = Math.ceil(totalItems / pageSize);

	// Get paginated data
	const roles = await RoleService.getAllResources({ 
		where: whereClause,
		pagination: { skip, take }
	});

	return {
		data: roles,
		totalItems,
		totalPages,
		currentPage: page,
		pageSize
	};
}
