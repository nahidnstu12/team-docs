"use server";

import { BaseAction } from "./BaseAction";
import { PrismaErrorFormatter } from "@/lib/PrismaErrorFormatter";
import Logger from "@/lib/Logger";
import { Session } from "@/lib/Session";
import { PageSchema } from "@/lib/schemas/PageSchema";
import { PageModel } from "../Models/PageModel";
import { ProjectService } from "../Services/ProjectServices";
import { SectionServices } from "../Services/SectionServices";
import { revalidatePath } from "next/cache";

class pageActions extends BaseAction {
	static get schema() {
		return PageSchema;
	}

	static async create(formData) {
		const result = await this.execute(formData);

		if (!result.success) return result;

		try {
			const { title, description, sectionId } = result.data;
			const session = await Session.getCurrentUser();
			const section = await SectionServices.getSection({ sectionId });
			const project = await ProjectService.getProject({
				id: section.projectId,
			});

			await PageModel.create({
				title,
				description,
				section: {
					connect: {
						id: sectionId,
					},
				},
				creator: {
					connect: {
						id: session.id,
					},
				},
			});

			revalidatePath(`/(home)/projects/${project.slug}/editor`, "layout");
			return {
				data: result.data,
				success: true,
				type: "success",
				redirectTo: `/projects/${project.slug}/editor`,
			};
		} catch (error) {
			Logger.error(error.message, `Page Create fail`);
			if (error.code)
				return PrismaErrorFormatter.handle(error, result.data, [
					"name",
					"description",
				]);

			return {
				success: false,
				type: "fail",
				errors: { _form: ["Failed to create Page"] },
				data: result.data,
			};
		}
	}
}

export async function createPage(prevState, formData) {
	return await pageActions.create(formData);
}
