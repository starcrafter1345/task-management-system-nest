import { z } from "zod";
import { TaskEntitySchema } from "./task.entity";
import { createZodDto } from "nestjs-zod";

const TasksGroupedByCourseSchema = z.array(
  z.object({
    id: z.int(),
    title: z.string(),
    tasks: z.array(TaskEntitySchema),
  }),
);

export class TasksGroupedByCourse extends createZodDto(
  TasksGroupedByCourseSchema,
) {}
