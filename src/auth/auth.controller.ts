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
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
} from "@nestjs/swagger";
import { TokenDto } from "./dto/token.dto";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { User } from "./user.decorator";
import type { Response } from "express";
import { addMilliseconds } from "date-fns";
import { ConfigService } from "@nestjs/config";
import { RefinedUserDto } from "./dto/refined-user.dto";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {}

  @Post("register")
  @ApiCreatedResponse({
    description: "User created",
    example: { access_token: "string" },
  })
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Post("login")
  @UseGuards(LocalAuthGuard)
  @ApiOkResponse()
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
    });
  }

  @ApiBearerAuth()
  @Get("logout")
  logout() {}

  @HttpCode(HttpStatus.OK)
  @Post("verify")
  async verify(@Body() tokenDto: TokenDto) {
    return this.authService.verify(tokenDto);
  }
}
