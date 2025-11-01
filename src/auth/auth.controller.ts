import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { CredentialsDto } from "./dto/credentials.dto";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
} from "@nestjs/swagger";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
  @ApiOkResponse({
    example: { access_token: "string" },
  })
  login(@Body() credentialsDto: CredentialsDto) {
    return this.authService.login(credentialsDto);
  }

  @ApiBearerAuth()
  @Get("logout")
  logout() {}
}
