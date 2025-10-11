import { createZodDto } from "nestjs-zod";
import { z } from "zod";

const htmlColorInputSchema = z.string().regex(/^#[0-9a-fA-F]{6}$/, {
  message:
    "Invalid color format. Must be a 7-character hex code (e.g., #RRGGBB).",
});

const CreateCourseSchema = z.object({
  title: z.string(),
  color: htmlColorInputSchema,
});

export class CreateCourseDto extends createZodDto(CreateCourseSchema) {}
