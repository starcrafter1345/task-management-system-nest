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
    expect(register.headers["set-cookie"]).toBeDefined();
    expect(register.headers["set-cookie"][0]).toContain("Authentication=");
    expect(register.body).toHaveProperty("id");
    expect(register.body).toHaveProperty("email", user.email);
    expect(register.body).toHaveProperty("name", user.username);
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
    expect(login.headers["set-cookie"]).toBeDefined();
    expect(login.headers["set-cookie"][0]).toContain("Authentication=");
    expect(login.body).toHaveProperty("id");
    expect(login.body).toHaveProperty("email", user.email);
    expect(login.body).toHaveProperty("name", user.username);
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
    expect(login.body).toMatchObject({ message: "Unauthorized" });
  });

  it("GET /verify", async () => {
    const user: CreateUserDto = {
      username: "starc",
      email: "starc@email.com",
      password: "secretpassword",
    };

    const login = await request(app.getHttpServer())
      .post("/auth/login")
      .send(user);

    const cookie = login.headers["set-cookie"];

    const verify = await request(app.getHttpServer())
      .get("/auth/verify")
      .set("Cookie", cookie);

    expect(verify.status).toBe(200);
    expect(verify.body).toHaveProperty("id");
    expect(verify.body).toHaveProperty("email", user.email);
    expect(verify.body).toHaveProperty("name", user.username);
  });

  it("should return unauthorized if no cookie", async () => {
    const verify = await request(app.getHttpServer()).get("/auth/verify");

    expect(verify.status).toBe(401);
  });

  afterAll(async () => {
    await app.close();
  });
});
