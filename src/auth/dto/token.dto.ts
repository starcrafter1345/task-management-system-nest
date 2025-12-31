import { z } from "zod";
import { createZodDto } from "nestjs-zod";

const TokenSchema = z.object({
  access_token: z.jwt(),
});

export class TokenDto extends createZodDto(TokenSchema) {}
