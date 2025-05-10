import slugify from "slugify";

export class Helpers {
	/**
	 * Generates URL-friendly slug from name
	 * @private
	 * @param {string} name - Workspace name
	 * @returns {string} Generated slug
	 */
	static generateSlug(name) {
		return slugify(name, {
			lower: true,
			strict: true,
			remove: /[*+~.()'"!:@]/g,
		});
	}
}
