import { z } from "zod";
import { createZodDto } from "nestjs-zod";

const TaskEntitySchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  completed: z.boolean(),
  due_time: z.iso.datetime(),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
  course_id: z.number(),
});

export class TaskEntity extends createZodDto(TaskEntitySchema) {}
