export class BaseAction {
	constructor(schema) {
		if (!schema) {
			throw new Error("Child class must define a schema");
		}
		this.schema = schema;
	}

	async execute(formData) {
		try {
			// Convert FormData to plain object if needed
			const rawData = this.#parseFormData(formData);

			// Validate the data using the schema
			const result = this.schema.safeParse(rawData);

			if (!result.success) {
				return this.#formatValidationErrors(result.error, rawData);
			}

			return {
				success: true,
				data: result.data,
			};
		} catch (error) {
			console.error("Action execution failed:", error);
			return {
				success: false,
				errors: { _form: ["An unexpected error occurred"] },
				data: this.#parseFormData(formData),
			};
		}
	}

	#parseFormData(formData) {
		if (typeof formData?.entries === "function") {
			// Handle FormData object
			const data = {};
			for (const [key, value] of formData.entries()) {
				// Handle multiple values for same key
				if (data[key] !== undefined) {
					if (Array.isArray(data[key])) {
						data[key].push(value);
					} else {
						data[key] = [data[key], value];
					}
				} else {
					data[key] = value;
				}
			}
			return data;
		}

		if (typeof formData === "object" && formData !== null) {
			return formData;
		}

		throw new Error("Invalid formData passed to execute method");
	}

	#formatValidationErrors(error, rawData) {
		const formatted = error.format();
		const errors = {};

		for (const [key, value] of Object.entries(formatted)) {
			if (key === "_errors") continue;

			if (value?._errors?.length) {
				errors[key] = value._errors;
			}
		}

		return {
			success: false,
			errors,
			data: rawData,
		};
	}
}
