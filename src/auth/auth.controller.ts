import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { ApiBearerAuth } from "@nestjs/swagger";
import { TokenDto } from "./dto/token.dto";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { User } from "./user.decorator";
import type { Response } from "express";
import { addMilliseconds } from "date-fns";
import { ConfigService } from "@nestjs/config";
import { RefinedUserDto } from "./dto/refined-user.dto";
import { ZodResponse } from "nestjs-zod";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {}

  @Post("register")
  @ZodResponse({
    status: HttpStatus.CREATED,
    description: "User created",
    type: RefinedUserDto,
  })
  async register(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { access_token, user } =
      await this.authService.register(createUserDto);

    const expiresAccessToken = addMilliseconds(
      new Date(),
      parseInt(this.config.getOrThrow<string>("JWT_EXPIRATION_IN_MS")),
    );

    response.cookie("Authentication", access_token, {
      httpOnly: true,
      expires: expiresAccessToken,
    });

    return user;
  }

  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Post("login")
  @UseGuards(LocalAuthGuard)
  @ZodResponse({ status: HttpStatus.OK, type: RefinedUserDto })
  async login(
    @User() user: RefinedUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const expiresAccessToken = addMilliseconds(
      new Date(),
      parseInt(this.config.getOrThrow<string>("JWT_EXPIRATION_IN_MS")),
    );

    const { access_token } = await this.authService.login(user);

    response.cookie("Authentication", access_token, {
      httpOnly: true,
      expires: expiresAccessToken,
      secure: this.config.getOrThrow<string>("NODE_ENV") === "production",
      sameSite: "none",
    });

    return user;
  }

  @ApiBearerAuth()
  @Get("logout")
  logout() {}

  @UseGuards(JwtAuthGuard)
  @Get("verify")
  @ZodResponse({ status: HttpStatus.OK, type: RefinedUserDto })
  verify(@User() user: RefinedUserDto) {
    return user;
  }
}
