export class SectionDTO {
	static toResponse(section) {
		const base = {
			id: section.id,
			name: section.name,
			projectId: section.projectId,
		};

		// Only include pages if they are present in the object
		if (section.pages) {
			base.pages = section.pages.map((page) => ({
				id: page.id,
				title: page.title,
			}));
		}

		return base;
	}

	static toCollection(sections) {
		return sections.map((section) => this.toResponse(section));
	}
}
