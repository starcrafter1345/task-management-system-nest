import { CourseEntitySchema } from "./course.entity";
import { z } from "zod";
import { TaskEntitySchema } from "../../task/entities/task.entity";
import { createZodDto } from "nestjs-zod";

export const CourseWithTasksEntitySchema = CourseEntitySchema.extend({
  tasks: z.array(TaskEntitySchema),
});

export class CourseWithTasksEntity extends createZodDto(
  CourseWithTasksEntitySchema,
) {}
