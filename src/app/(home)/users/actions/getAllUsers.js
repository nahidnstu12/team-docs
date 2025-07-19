"use server";

import { Session } from "@/lib/Session";
import { UserServices } from "@/system/Services/UserServices";

/**
 * Server action to fetch all users with pagination and sorting support
 * @param {Object} options - Pagination and sorting options
 * @param {number} options.page - Current page number (1-indexed)
 * @param {number} options.pageSize - Number of items per page
 * @param {string} options.sortOrder - Sort direction ('asc' or 'desc')
 * @returns {Promise<{data: Array, totalItems: number, totalPages: number, currentPage: number, pageSize: number, sortBy: string, sortOrder: string}>}
 */
export async function getAllUsersFn(options = {}) {
  const workspaceId = await Session.getWorkspaceIdForUser();
  const { page = 1, pageSize = 10, sortOrder = "asc" } = options;
  const sortBy = "username";

  const totalItems = await UserServices.countResources({ where: { workspaceId } });

  const skip = (page - 1) * pageSize;
  const take = pageSize;
  const totalPages = Math.ceil(totalItems / pageSize);

  const orderBy = { [sortBy]: sortOrder };

  const users = await UserServices.getAllResources({
    where: {
      workspaceId,
      isWorkspaceOwner: false,
    },
    select: {
      id: true,
      username: true,
      email: true,
      status: true,
    },
    pagination: { skip, take },
    orderBy,
  });

  return {
    data: users,
    totalItems,
    totalPages,
    currentPage: page,
    pageSize,
    sortBy: "username",
    sortOrder,
  };
}
