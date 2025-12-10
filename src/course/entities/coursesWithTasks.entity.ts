import { z } from "zod";
import { CourseWithTasksEntitySchema } from "./courseWithTasks.entity";
import { createZodDto } from "nestjs-zod";

const CoursesWithTasksEntitySchema = z.array(CourseWithTasksEntitySchema);

export class CoursesWithTasksEntity extends createZodDto(
  CoursesWithTasksEntitySchema,
) {}
