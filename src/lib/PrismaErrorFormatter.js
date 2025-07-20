import Logger from "./Logger";

export class PrismaErrorFormatter {
  static format(error, data, formFields = []) {
    // when error code does not exist, produce general error
    if (!error.code) {
      return {
        field: "_form",
        message: "An unexpected error occurred",
      };
    }

    // mapping to specific error code
    const errorMap = {
      // Unique constraint violations
      P2002: {
        getMessage: (meta) => {
          // produce message
          const field = meta?.target?.[1] || meta?.target?.[0] || "field";
          return `This (${data[field]}) ${field} already exists. Please choose a different one.`;
        },
        getField: (meta, fields) => {
          // produce field
          const field = meta?.target?.[1] || meta?.target?.[0];
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

    // returning final error field and message
    return {
      field:
        typeof handler.getField === "function"
          ? handler.getField(error.meta, formFields)
          : handler.field,
      message:
        typeof handler.getMessage === "function" ? handler.getMessage(error.meta) : handler.message,
    };
  }

  static handle(error, data, formFields = []) {
    const formatted = this.format(error, data, formFields);

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
