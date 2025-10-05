import { createZodDto } from "nestjs-zod";
import { z } from "zod";

const CreateUserSchema = z.object({
  username: z.string(),
  email: z.email(),
  password: z.string(),
});

export class CreateUserDto extends createZodDto(CreateUserSchema) {}
