export class PrismaErrorFormatter {
	static format(error, formFields = []) {
		if (!error.code) {
			return {
				field: "_form",
				message: "An unexpected error occurred",
			};
		}

		const errorMap = {
			// Unique constraint violations
			P2002: {
				getMessage: (meta) => {
					const field = meta?.target?.[1] || meta?.target?.[0] || "field";
					return `This ${field} already exists. Please choose a different one.`;
				},
				getField: (meta, fields) => {
					const field = meta?.target?.[0];
					return field && fields.includes(field) ? field : "_form";
				},
			},
			// Foreign key constraint
			P2003: {
				message: "Related record not found",
				field: "_form",
			},
			// Record not found
			P2025: {
				message: "Record not found",
				field: "_form",
			},
			// Default database error
			default: {
				message: "Database operation failed",
				field: "_form",
			},
		};

		const handler = errorMap[error.code] || errorMap.default;

		return {
			field:
				typeof handler.getField === "function"
					? handler.getField(error.meta, formFields)
					: handler.field,
			message:
				typeof handler.getMessage === "function"
					? handler.getMessage(error.meta)
					: handler.message,
		};
	}

	static handle(error, data, formFields = []) {
		const formatted = this.format(error, formFields);
		return {
			success: false,
			type: "fail",
			errors: {
				[formatted.field]: [formatted.message],
			},
			data,
		};
	}
}
