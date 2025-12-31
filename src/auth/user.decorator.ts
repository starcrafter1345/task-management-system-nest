import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";
import { RefinedUserDto } from "./dto/refined-user.dto";

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx
      .switchToHttp()
      .getRequest<Request & { user: RefinedUserDto }>();
    return request.user as RefinedUserDto;
  },
);
