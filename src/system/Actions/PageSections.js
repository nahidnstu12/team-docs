"use server";

import { BaseAction } from "./BaseAction";
import { PrismaErrorFormatter } from "@/lib/PrismaErrorFormatter";
import Logger from "@/lib/Logger";
import { Session } from "@/lib/Session";
import { PageSchema } from "@/lib/schemas/PageSchema";
import { PageModel } from "../Models/PageModel";
import { ProjectService } from "../Services/ProjectServices";
import { SectionServices } from "../Services/SectionServices";
import { PageServices } from "../Services/PageServices";
import { revalidatePath } from "next/cache";

class PageActions extends BaseAction {
	static get schema() {
		return PageSchema;
	}

	static async create(formData) {
		const result = await this.execute(formData);

		if (!result.success) return result;

		try {
			const { title, description, sectionId } = result.data;
			const session = await Session.getCurrentUser();
			const section = await SectionServices.getResource({
				where: { id: sectionId },
			});
			const project = await ProjectService.getResource({
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

	static async update(pageId, formData) {
		const result = await this.execute(formData);

		if (!result.success) return result;

		try {
			Logger.debug("Updating page", { pageId, data: result.data });
			const page = await PageServices.getPage(pageId);
			const project = page.section.project;
			
			await PageServices.updateResource(pageId, {
				title: result.data.title,
				description: result.data.description,
			});

			revalidatePath(`/(home)/projects/${project.slug}/editor`, "layout");
			return {
				data: result.data,
				success: true,
				type: "success",
			};
		} catch (error) {
			Logger.error(error.message, "Page update failed:");
			if (error.code)
				return PrismaErrorFormatter.handle(error, result.data, [
					"title",
					"description",
				]);

			return {
				success: false,
				type: "fail",
				errors: { _form: ["Failed to update page"] },
				data: result.data,
			};
		}
	}

	static async delete(pageId) {
		try {
			Logger.debug("Deleting page", { pageId });
			const page = await PageServices.getPage(pageId);
			const project = page.section.project;
			
			await PageServices.deleteResource(pageId);
			
			revalidatePath(`/(home)/projects/${project.slug}/editor`, "layout");
			return {
				success: true,
				type: "success",
				message: "Page successfully deleted",
			};
		} catch (error) {
			Logger.error(error.message, "Page deletion failed:");
			return {
				success: false,
				type: "fail",
				errors: { _form: ["Failed to delete page"] },
			};
		}
	}
}

export async function createPage(prevState, formData) {
	return await PageActions.create(formData);
}

export async function updatePageAction(prevState, { pageId, formData }) {
	return await PageActions.update(pageId, formData);
}

export async function deletePageAction(prevState, pageId) {
	return await PageActions.delete(pageId);
}
