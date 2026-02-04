import z from "zod";

export const doctorFormSchema = z.object({
  speciality: z.string().min(1, "Speciality is required"),
  experiance: z
    .number({ invalid_type_error: "Expriance must be a number" })
    .int()
    .min(1, "Experiance must be at least 1 year")
    .max(70, "Experiance must be less than 70 years"),
  credentialUrl: z
    .string()
    .url("Please enter a valid URL")
    .min(1, "Credential URL is required"),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters")
    .max(1000, "Description cannot exceed 1000 characters"),
});