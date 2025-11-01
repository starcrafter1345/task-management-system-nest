import { createZodDto } from "nestjs-zod";
import { z } from "zod";

const UpdateTaskSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  completed: z.boolean().optional(),
  due_time: z.iso.datetime().optional(),
  course_id: z.number().optional(),
});
export class UpdateTaskDto extends createZodDto(UpdateTaskSchema) {}
