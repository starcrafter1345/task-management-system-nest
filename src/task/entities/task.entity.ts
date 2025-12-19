import { z } from "zod";
import { createZodDto } from "nestjs-zod";

export const TaskEntitySchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  completed: z.boolean(),
  due_time: z.iso.datetime({ offset: true }),
  created_at: z.iso.datetime({ offset: true }),
  updated_at: z.iso.datetime({ offset: true }),
  course_id: z.number(),
});

export class TaskEntity extends createZodDto(TaskEntitySchema) {}
