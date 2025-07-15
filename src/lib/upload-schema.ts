import { z } from "zod";

/**
 * Schema for validating upload form data.
 * - `year`: must be a 4-digit string between 2015 and the current year.
 * - `files`: must be a FileList with at least one image file.
 */
export const schema = z.object({
  year: z
    .string()
    .regex(/^\d{4}$/, "Must be a 4-digit year")
    .refine((v) => {
      const n = Number(v);
      return n >= 2015 && n <= new Date().getFullYear();
    }, "Out of range"),
  files: z
    .custom<FileList>()
    .refine((list) => list.length > 0, "Select at least one image")
    .refine(
      (list) => Array.from(list).every((f) => f.type.startsWith("image/")),
      "All files must be images"
    ),
});

export type FormValues = z.infer<typeof schema>;
