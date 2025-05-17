"use server";

import { BaseAction } from "./BaseAction";
import { PrismaErrorFormatter } from "@/lib/PrismaErrorFormatter";
import Logger from "@/lib/Logger";
import { Session } from "@/lib/Session";
import { revalidatePath } from "next/cache";
import { SectionSchema } from "@/lib/schemas/SectionSchema";
import { SectionModel } from "../Models/SectionModel";
import { ProjectService } from "../Services/ProjectServices";

class SectionActions extends BaseAction {
	static get schema() {
		return SectionSchema;
	}

	static async create(formData) {
		const result = await this.execute(formData);

		if (!result.success) return result;

		try {
			const { name, description, projectId } = result.data;
			const session = await Session.getCurrentUser();
			const project = await ProjectService.getResource({ id: projectId });

			await SectionModel.create({
				name,
				description,
				projectId: project.id,
				ownerId: session.id,
			});

			revalidatePath(`/(home)/projects/${project.slug}/editor`, "layout");
			// revalidatePath(`/projects/${project.slug}/editor`, "page");
			return {
				data: result.data,
				success: true,
				type: "success",
				redirectTo: `/projects/${project.slug}/editor`,
			};
		} catch (error) {
			Logger.error(error.message, `Section Create fail`);
			if (error.code)
				return PrismaErrorFormatter.handle(error, result.data, [
					"name",
					"description",
				]);

			return {
				success: false,
				type: "fail",
				errors: { _form: ["Failed to create Section"] },
				data: result.data,
			};
		}
	}
}

export async function createSection(prevState, formData) {
	return await SectionActions.create(formData);
}
