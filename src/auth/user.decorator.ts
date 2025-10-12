import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { UserPayload } from "./user-payload";
import { Request } from "express";

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx
      .switchToHttp()
      .getRequest<Request & { user: UserPayload }>();
    return request.user as UserPayload;
  },
);
