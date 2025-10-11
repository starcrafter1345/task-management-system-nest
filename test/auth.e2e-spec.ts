import request from "supertest";
import { INestApplication } from "@nestjs/common";
import { PrismaService } from "../src/prisma/prisma.service";
import { settingUpApp } from "./utils";
import { CreateUserDto } from "../src/auth/dto/create-user.dto";

describe("auth", () => {
  let app: INestApplication;
  const prisma = new PrismaService();

  beforeAll(async () => (app = await settingUpApp(prisma)));

  it("POST /register", async () => {
    const user: CreateUserDto = {
      username: "starc",
      email: "starc@email.com",
      password: "secretpassword",
    };

    const register = await request(app.getHttpServer())
      .post("/auth/register")
      .send(user);

    expect(register.status).toBe(201);
    expect(register.body).toHaveProperty("access_token");
  });

  it("should not make new user, if one is already there", async () => {
    const user: CreateUserDto = {
      username: "starc",
      email: "starc@email.com",
      password: "secretpassword",
    };

    const register = await request(app.getHttpServer())
      .post("/auth/register")
      .send(user);

    expect(register.status).toBe(400);
    expect(register.body).toMatchObject({
      message: "Need to use unique email",
    });
  });

  it("should not make new user, if object don't have some properties", async () => {
    const user = {
      email: "starc@email.com",
    };

    const register = await request(app.getHttpServer())
      .post("/auth/register")
      .send(user);

    expect(register.status).toBe(400);
    expect(register.body).toMatchObject({
      errors: [
        {
          message: "Username is required",
        },
        {
          message: "Password is required",
        },
      ],
    });
  });

  it("POST /login", async () => {
    const user: CreateUserDto = {
      username: "starc",
      email: "starc@email.com",
      password: "secretpassword",
    };

    const login = await request(app.getHttpServer())
      .post("/auth/login")
      .send(user);

    expect(login.status).toBe(200);
    expect(login.body).toHaveProperty("access_token");
  });

  it("should return unauthorized error, if typed wrong password", async () => {
    const user: CreateUserDto = {
      username: "starc",
      email: "starc@email.com",
      password: "secret",
    };

    const login = await request(app.getHttpServer())
      .post("/auth/login")
      .send(user);

    expect(login.status).toBe(401);
    expect(login.body).toMatchObject({ message: "Invalid credentials" });
  });

  afterAll(async () => {
    await app.close();
  });
});
