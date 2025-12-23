import { z } from "zod";

export const signupSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.email("Invalid email"),
    password: z.string().min(8, "Password must be at least 8 chars"),
  })
  .strict();

export const signinSchema = z
  .object({
    email: z.email("Invalid email"),
    password: z.string().min(8, "Password must be at least 8 chars"),
  })
  .strict();

export const updateProfileSchema = z
  .object({
    firstName: z.string().trim().min(1).optional(),
    lastName: z.string().trim().min(1).optional(),
  })
  .strict();

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(8, "Current password required"),
  newPassword: z.string().min(8, "New password must be at least 8 chars"),
});
