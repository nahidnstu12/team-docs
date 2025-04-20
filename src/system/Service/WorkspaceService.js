import slugify from "slugify";
import { BaseService } from "./BaseService";

export class WorkspaceService extends BaseService {
	// constructor(model) {
	// 	super(model);
	// }

	async createWorkspace(data) {
		// Modify data as needed (add slug, etc.)
		const processedData = {
			...data,
			slug: this.#generateSlug(data.name),
		};

		return processedData;
	}

	#generateSlug(name) {
		return slugify(name, {
			lower: true,
			strict: true,
			remove: /[*+~.()'"!:@]/g,
		});
	}
}
