import { createZodDto } from "nestjs-zod";
import { z } from "zod";

const CreateUserSchema = z.object({
  username: z.string("Username is required"),
  email: z.email("E-mail is required"),
  password: z.string("Password is required"),
});

export class CreateUserDto extends createZodDto(CreateUserSchema) {}
