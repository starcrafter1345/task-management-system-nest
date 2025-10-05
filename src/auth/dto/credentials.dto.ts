import { createZodDto } from "nestjs-zod";
import { z } from "zod";

const CredentialsSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export class CredentialsDto extends createZodDto(CredentialsSchema) {}
