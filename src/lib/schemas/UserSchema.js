import { z } from "zod";

export const UserSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z
    .string()
    .min(3, "Email must be at least 3 characters")
    .email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters").optional(),
  status: z.string().default("ACTIVE").optional(),
});

// this is probably from landing page user creation
export const RegistrationUserSchema = UserSchema.extend({
  password: z.string().min(8, "Password must be at least 8 characters").optional(),
});

// admin Updating user
export const AdminUpdatingUserSchema = z.object({
  status: z.enum(["ACTIVE", "PENDING", "INACTIVE"], {
    required_error: "Status is required",
  }),
  id: z.string().min(1, "User ID is required"),
});
