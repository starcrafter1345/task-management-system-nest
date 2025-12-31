import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "../auth.service";
import { RefinedUserDto } from "../dto/refined-user.dto";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: "email",
    });
  }

  validate(email: string, password: string): Promise<RefinedUserDto | null> {
    return this.authService.validateUser({ email, password });
  }
}
