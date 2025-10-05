import { Body, Controller, Get, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { CredentialsDto } from "./dto/credentials.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post("login")
  login(@Body() credentialsDto: CredentialsDto) {
    return this.authService.login(credentialsDto);
  }

  @Get("logout")
  logout() {}
}
