import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const RefinedUserSchema = z.object({
  id: z.int(),
  email: z.email(),
  name: z.string(),
});

export class RefinedUserDto extends createZodDto(RefinedUserSchema) {}
