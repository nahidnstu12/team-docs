export class PageDTO {
	static toResponse(page) {
		return {
			id: page.id,
			name: page.name,
		};
	}

	static toCollection(pages) {
		return pages.map((page) => this.toResponse(page));
	}
}
