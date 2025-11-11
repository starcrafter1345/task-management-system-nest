import { CourseEntitySchema } from "./course.entity";
import { z } from "zod";
import { createZodDto } from "nestjs-zod";

const CoursesEntitySchema = z.array(
  CourseEntitySchema.extend({
    taskCount: z.number(),
  }),
);

export class CoursesEntity extends createZodDto(CoursesEntitySchema) {}
