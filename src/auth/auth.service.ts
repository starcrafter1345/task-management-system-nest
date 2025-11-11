import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { CredentialsDto } from "./dto/credentials.dto";
import { UserService } from "../user/user.service";
import bcrypt from "bcrypt";
import { Prisma } from "@prisma/client";
import { JwtService } from "@nestjs/jwt";

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

      const payload = { sub: newUser.id, username: newUser.name };
      return this.accessTokenGenerator(payload);
    } catch (err: unknown) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2002") {
          throw new BadRequestException("Need to use unique email");
        }
      }
    }
  }

  async login({ email, password }: CredentialsDto) {
    const user = await this.userService.findUser({ email });
    if (!user) {
      throw new NotFoundException();
    }

    const isMatch = await bcrypt.compare(password, user.hashed_password);
    if (!isMatch) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const payload = { sub: user.id, username: user.name };
    return this.accessTokenGenerator(payload);
  }
}
