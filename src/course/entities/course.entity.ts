import { z } from "zod";
import { htmlColorInputSchema } from "../dto/create-course.dto";
import { createZodDto } from "nestjs-zod";

export const CourseEntitySchema = z.object({
  id: z.number(),
  title: z.string(),
  color: htmlColorInputSchema,
});

export class CourseEntity extends createZodDto(CourseEntitySchema) {}
