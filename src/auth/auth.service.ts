import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { CredentialsDto } from "./dto/credentials.dto";
import { UserService } from "../user/user.service";
import bcrypt from "bcrypt";
import { Prisma } from "@prisma/client";
import { JwtService } from "@nestjs/jwt";
import { TokenDto } from "./dto/token.dto";
import { RefinedUserDto } from "./dto/refined-user.dto";

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  private async accessTokenGenerator(
    payload: Record<string, any>,
  ): Promise<{ access_token: string }> {
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async register({ username, password, email }: CreateUserDto) {
    const hashed_password = await bcrypt.hash(password, 10);

    try {
      const newUser = await this.userService.createUser({
        name: username,
        hashed_password,
        email,
      });

      const payload = { sub: newUser.id, email: newUser.email };
      return this.accessTokenGenerator(payload);
    } catch (err: unknown) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2002") {
          throw new BadRequestException("Need to use unique email");
        }
      }
    }
  }

  async login(user: RefinedUserDto) {
    const payload = { sub: user.id, email: user.email };
    return this.accessTokenGenerator(payload);
  }

  async validateUser({
    email,
    password,
  }: CredentialsDto): Promise<RefinedUserDto | null> {
    const user = await this.userService.findUser({ email });

    if (!user) {
      return null;
    }

    const isMatch = await bcrypt.compare(password, user.hashed_password);
    if (isMatch) {
      const { hashed_password, ...result } = user;
      return result;
    }

    return null;
  }

  async verify({ access_token }: TokenDto) {
    try {
      await this.jwtService.verifyAsync(access_token);
    } catch (err: unknown) {
      throw new UnauthorizedException("Invalid token");
    }
  }
}
