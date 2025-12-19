import request from "supertest";
import { INestApplication } from "@nestjs/common";
import { CreateCourseDto } from "../src/course/dto/create-course.dto";
import { PrismaService } from "../src/prisma/prisma.service";
import { settingUpApp } from "./utils";
import { CourseEntity } from "../src/course/entities/course.entity";

describe("course", () => {
  let app: INestApplication;
  const prisma = new PrismaService();
  let token: string;
  let course: CourseEntity;
  let secondCourse: CourseEntity;

  beforeAll(async () => (app = await settingUpApp(prisma)));

  beforeAll(async () => {
    const req = await request(app.getHttpServer())
      .post("/auth/register")
      .send({ username: "test", email: "test@test.com", password: "test" });
    token = req.body.access_token;
  });

  it("POST /course", async () => {
    const newCourse: CreateCourseDto = { title: "Math 101", color: "#ffffff" };

    const req = await request(app.getHttpServer())
      .post("/course")
      .send(newCourse)
      .set("Authorization", `Bearer ${token}`);

    expect(req.status).toBe(201);
    expect(req.body).toMatchObject(newCourse);

    course = req.body as CourseEntity;
  });

  it("GET /course", async () => {
    let allCourses = await request(app.getHttpServer())
      .get("/course")
      .set("Authorization", `Bearer ${token}`);

    expect(allCourses.status).toBe(200);
    expect(allCourses.body).toMatchObject([course]);

    const engCourse: CreateCourseDto = { title: "English", color: "#2d16e2" };

    const engCourseRes = await request(app.getHttpServer())
      .post("/course")
      .send(engCourse)
      .set("Authorization", `Bearer ${token}`);

    allCourses = await request(app.getHttpServer())
      .get("/course")
      .set("Authorization", `Bearer ${token}`);

    expect(allCourses.status).toBe(200);
    expect(allCourses.body).toMatchObject([course, engCourseRes.body]);

    secondCourse = engCourseRes.body as CourseEntity;
  });

  it("GET /course/:id", async () => {
    let mathCourse = await request(app.getHttpServer())
      .get(`/course/${course.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(mathCourse.status).toBe(200);
    expect(mathCourse.body).toMatchObject({
      id: course.id,
      title: course.title,
      tasks: {},
    });
    expect(mathCourse.body).toHaveProperty("tasks");
  });

  it("PATCH /course/:id", async () => {
    const changedCourse = await request(app.getHttpServer())
      .patch(`/course/${course.id}`)
      .send({ color: "#ff0000" })
      .set("Authorization", `Bearer ${token}`);

    expect(changedCourse.status).toBe(200);
    expect(changedCourse.body).toStrictEqual({ ...course, color: "#ff0000" });

    course = changedCourse.body as CourseEntity;
  });

  it("DELETE /course/:id", async () => {
    let deleteCourse = await request(app.getHttpServer())
      .delete(`/course/${course.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(deleteCourse.status).toBe(204);

    let courses = await request(app.getHttpServer())
      .get("/course")
      .set("Authorization", `Bearer ${token}`);

    expect(courses.body).toMatchObject([secondCourse]);
  });

  it("should return an error, if wrong color passed", async () => {
    const newCourse = await request(app.getHttpServer())
      .post("/course")
      .send({ title: "Course", color: "#ff" })
      .set("Authorization", `Bearer ${token}`);

    expect(newCourse.status).toBe(400);
    expect(newCourse.body).toMatchObject({
      errors: [
        {
          message:
            "Invalid color format. Must be a 7-character hex code (e.g., #RRGGBB).",
        },
      ],
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
