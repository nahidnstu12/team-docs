/**
 * Abstract base class for all application actions
 * Handles common form processing and validation logic
 *
 * @class
 * @abstract
 */
export class BaseAction {
	/**
	 * Creates a BaseAction instance
	 * @param {zod.Schema} schema - Zod schema for validation
	 * @throws {Error} If no schema is provided
	 */
	constructor(schema) {
		if (!schema) {
			throw new Error("Child class must define a schema");
		}
		this.schema = schema;
	}

	/**
	 * Executes the action with form validation
	 * @param {FormData|Object} formData - Input data to process
	 * @returns {Promise<{
	 *   success: boolean,
	 *   errors?: Object,
	 *   data?: Object
	 * }>} Execution result
	 */
	async execute(formData) {
		try {
			const rawData = this.#parseFormData(formData);
			const result = this.schema.safeParse(rawData);

			if (!result.success) {
				return this.#formatValidationErrors(result.error, rawData);
			}

			return { success: true, data: result.data };
		} catch (error) {
			console.error("Action execution failed:", error);
			return {
				success: false,
				errors: { _form: ["An unexpected error occurred"] },
				data: this.#parseFormData(formData),
			};
		}
	}

	/**
	 * Parses FormData into a plain object
	 * @private
	 * @param {FormData|Object} formData - Input to parse
	 * @returns {Object} Parsed data
	 * @throws {Error} If input is invalid
	 */
	#parseFormData(formData) {
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

	/**
	 * Formats Zod validation errors
	 * @private
	 * @param {zod.ZodError} error - Zod error object
	 * @param {Object} rawData - Original form data
	 * @returns {Object} Formatted error response
	 */
	#formatValidationErrors(error, rawData) {
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
