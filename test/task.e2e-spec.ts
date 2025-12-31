import request from "supertest";
import { INestApplication } from "@nestjs/common";
import { PrismaService } from "../src/prisma/prisma.service";
import { settingUpApp } from "./utils";
import { CourseEntity } from "../src/course/entities/course.entity";
import { CreateTaskDto } from "../src/task/dto/create-task.dto";
import { TaskEntity } from "../src/task/entities/task.entity";

describe("task", () => {
  let app: INestApplication;
  const prisma = new PrismaService();
  let token: string;
  let course: CourseEntity;
  let task: TaskEntity;
  let secondTask: TaskEntity;

  beforeAll(async () => (app = await settingUpApp(prisma)));

  beforeAll(async () => {
    const req = await request(app.getHttpServer())
      .post("/auth/register")
      .send({ username: "test", email: "test2@test.com", password: "test" });
    token = req.body.access_token;

    const newCourse = await request(app.getHttpServer())
      .post("/course")
      .send({ title: "Math 101", color: "#ffffff" })
      .set("Cookie", `Authentication=${token}`);

    course = newCourse.body as CourseEntity;
  });

  it("POST /task", async () => {
    const newTask = {
      name: "Quadratic function",
      description: "test task",
      due_time: new Date().toISOString(),
      completed: false,
      course_id: course.id,
    };

    const req = await request(app.getHttpServer())
      .post("/task")
      .send(newTask)
      .set("Cookie", `Authentication=${token}`);

    expect(req.status).toBe(201);
    expect(req.body).toMatchObject(newTask);

    task = req.body;
  });

  it("GET /task", async () => {
    let allTasks = await request(app.getHttpServer())
      .get("/task")
      .set("Cookie", `Authentication=${token}`);

    expect(allTasks.status).toBe(200);
    expect(allTasks.body).toMatchObject([
      {
        id: course.id,
        title: course.title,
        tasks: [task],
      },
    ]);

    const secondTaskObj: CreateTaskDto = {
      name: "second task",
      due_time: new Date().toISOString(),
      completed: true,
      course_id: course.id,
    };

    const secondTaskRes = await request(app.getHttpServer())
      .post("/task")
      .send(secondTaskObj)
      .set("Cookie", `Authentication=${token}`);
    secondTask = secondTaskRes.body as TaskEntity;

    allTasks = await request(app.getHttpServer())
      .get("/task")
      .set("Cookie", `Authentication=${token}`);

    expect(allTasks.status).toBe(200);
    expect(allTasks.body).toMatchObject([
      {
        id: course.id,
        title: course.title,
        tasks: expect.arrayContaining([task, secondTask]),
      },
    ]);
  });

  it("GET /task/:id", async () => {
    let mathTask = await request(app.getHttpServer())
      .get(`/task/${task.id}`)
      .set("Cookie", `Authentication=${token}`);

    expect(mathTask.status).toBe(200);
    expect(mathTask.body).toMatchObject(task);
  });

  it("PATCH /task/:id", async () => {
    const changedTask = await request(app.getHttpServer())
      .patch(`/task/${task.id}`)
      .send({ description: "normal description" })
      .set("Cookie", `Authentication=${token}`);

    expect(changedTask.status).toBe(200);
    expect(changedTask.body).toMatchObject({
      ...task,
      description: changedTask.body.description,
      updated_at: changedTask.body.updated_at,
    });

    task = changedTask.body;
  });

  it("GET /task/stats", async () => {
    const stats = await request(app.getHttpServer())
      .get("/task/stats")
      .set("Cookie", `Authentication=${token}`);

    expect(stats.status).toBe(200);
    expect(stats.body).toEqual({
      total: 2,
      inProgress: 0,
      completed: 1,
      overdue: 1,
    });
  });

  it("DELETE /task/:id", async () => {
    let deleteTask = await request(app.getHttpServer())
      .delete(`/task/${task.id}`)
      .set("Cookie", `Authentication=${token}`);

    expect(deleteTask.status).toBe(204);

    let allTasks = await request(app.getHttpServer())
      .get("/task")
      .set("Cookie", `Authentication=${token}`);

    expect(allTasks.body).toMatchObject([
      {
        id: course.id,
        title: course.title,
        tasks: [secondTask],
      },
    ]);
  });

  afterAll(async () => {
    await app.close();
  });
});
