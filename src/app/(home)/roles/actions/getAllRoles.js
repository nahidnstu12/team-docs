"use server";

import { Session } from "@/lib/Session";
import { RoleService } from "@/system/Services/RoleServices";

/**
 * Server action to fetch all roles with pagination and sorting support
 * @param {Object} options - Pagination and sorting options
 * @param {number} options.page - Current page number (1-indexed)
 * @param {number} options.pageSize - Number of items per page
 * @param {string} options.sortBy - Field to sort by (e.g., 'name', 'isSystem')
 * @param {string} options.sortOrder - Sort direction ('asc' or 'desc')
 * @returns {Promise<{data: Array, totalItems: number, totalPages: number, sortBy: string, sortOrder: string}>}
 */
export async function getAllRolesFn(options = {}) {
	const session = await Session.getCurrentUser();
	const { 
		page = 1, 
		pageSize = 10,
		sortBy = 'name',
		sortOrder = 'asc'
	} = options;

	const whereClause = {
		OR: [{ isSystem: true }, { ownerId: session?.id }],
	};

	// Get total count for pagination
	const totalItems = await RoleService.countResources({ where: whereClause });
	
	// Calculate pagination parameters
	const skip = (page - 1) * pageSize;
	const take = pageSize;
	const totalPages = Math.ceil(totalItems / pageSize);

	// Prepare sort options
	const orderBy = { [sortBy]: sortOrder };

	// Get paginated and sorted data
	const roles = await RoleService.getAllResources({ 
		where: whereClause,
		pagination: { skip, take },
		orderBy
	});

	return {
		data: roles,
		totalItems,
		totalPages,
		currentPage: page,
		pageSize,
		sortBy,
		sortOrder
	};
}
