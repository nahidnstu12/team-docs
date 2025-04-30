export class SectionDTO {
	static toResponse(section) {
		return {
			id: section.id,
			name: section.name,
		};
	}

	static toCollection(sections) {
		return sections.map((section) => this.toResponse(section));
	}
}
