export class BaseAction {
	static get schema() {
		throw new Error("Child class must override `schema` getter");
	}

	static async execute(formData) {
		try {
			const rawData = BaseAction.#parseFormData(formData);
			const result = this.schema.safeParse(rawData); // <- will use child's getter

			if (!result.success) {
				return BaseAction.#formatValidationErrors(result.error, rawData);
			}

			return { success: true, data: result.data };
		} catch (error) {
			console.error("Action execution failed:", error);
			return {
				success: false,
				errors: { _form: ["An unexpected error occurred"] },
				data: BaseAction.#parseFormData(formData),
			};
		}
	}

	static #parseFormData(formData) {
		if (typeof formData?.entries === "function") {
			const data = {};
			for (const [key, value] of formData.entries()) {
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

	static #formatValidationErrors(error, rawData) {
		const formatted = error.format();
		const errors = {};

		for (const [key, value] of Object.entries(formatted)) {
			if (key === "_errors") continue;
			if (value?._errors?.length) {
				errors[key] = value._errors;
			}
		}

		return { success: false, errors, data: rawData };
	}
}
