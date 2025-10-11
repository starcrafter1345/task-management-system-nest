import { createZodDto } from "nestjs-zod";
import { z } from "zod";

const htmlColorInputSchema = z.string().regex(/^#[0-9a-fA-F]{6}$/, {
  message:
    "Invalid color format. Must be a 7-character hex code (e.g., #RRGGBB).",
});

const UpdateCourseSchema = z.object({
  title: z.string().optional(),
  color: htmlColorInputSchema.optional(),
});

export class UpdateCourseDto extends createZodDto(UpdateCourseSchema) {}
