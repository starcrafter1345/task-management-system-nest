import { z } from "zod";
import { createZodDto } from "nestjs-zod";
import { TaskEntitySchema } from "../../task/entities/task.entity";

const TasksGroupedByDateSchema = z.object({
  id: z.int(),
  title: z.string(),
  tasks: z.record(z.iso.date(), z.array(TaskEntitySchema)),
});

export class TasksGroupedByDate extends createZodDto(
  TasksGroupedByDateSchema,
) {}
