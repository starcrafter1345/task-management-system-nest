import { z } from "zod";
import { createZodDto } from "nestjs-zod";

const StatisticsEntitySchema = z.object({
  total: z.int(),
  completed: z.int(),
  inProgress: z.int(),
  overdue: z.int(),
});

export class StatisticsEntity extends createZodDto(StatisticsEntitySchema) {}
