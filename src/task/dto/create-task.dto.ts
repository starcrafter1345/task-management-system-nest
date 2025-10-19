import { createZodDto } from "nestjs-zod";
import { z } from "zod";

const CreateTaskSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  completed: z.boolean(),
  due_time: z.iso.datetime(),
  course_id: z.number(),
});

export class CreateTaskDto extends createZodDto(CreateTaskSchema) {}
