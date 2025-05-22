"use server";

// Logger not needed in this file
import { Session } from "@/lib/Session";
import { PermissionServices } from "@/system/Services/PermissionServices";

/**
 * Server action to fetch all permissions with pagination support
 * @param {Object} options - Pagination options
 * @param {number} options.page - Current page number (1-indexed)
 * @param {number} options.pageSize - Number of items per page
 * @returns {Promise<{data: Array, totalItems: number, totalPages: number}>}
 */
export async function getAllPermissionsFn(options = {}) {
	const session = await Session.getCurrentUser();
	const { page = 1, pageSize = 10 } = options;

	const whereClause = { ownerId: session.id };

	// Get total count for pagination
	const totalItems = await PermissionServices.countResources({ where: whereClause });
	
	// Calculate pagination parameters
	const skip = (page - 1) * pageSize;
	const take = pageSize;
	const totalPages = Math.ceil(totalItems / pageSize);

	// Get paginated data
	const permissions = await PermissionServices.getAllResources({ 
		where: whereClause,
		pagination: { skip, take }
	});

	return {
		data: permissions,
		totalItems,
		totalPages,
		currentPage: page,
		pageSize
	};
}
