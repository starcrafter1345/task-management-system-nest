import { Injectable } from "@nestjs/common";
import { CreateCourseDto } from "./dto/create-course.dto";
import { UpdateCourseDto } from "./dto/update-course.dto";
import { PrismaService } from "../prisma/prisma.service";
import { Prisma } from "@prisma/client";
import type { UserPayload } from "../auth/user-payload";
import { CourseEntity } from "./entities/course.entity";
import { CoursesEntity } from "./entities/courses.entity";
import { CourseWithTasksEntity } from "./entities/courseWithTasks.entity";
import { TaskEntity } from "../task/entities/task.entity";
import { TasksGroupedByDate } from "./entities/tasksGroupedByDate";
import { formatISO } from "date-fns";

@Injectable()
export class CourseService {
  constructor(private prisma: PrismaService) {}

  async create(
    createCourseDto: CreateCourseDto,
    user: UserPayload,
  ): Promise<CourseEntity> {
    return this.prisma.course.create({
      data: {
        ...createCourseDto,
        user: {
          connect: { id: Number(user.sub) },
        },
      },
      omit: {
        user_id: true,
      },
    });
  }

  async findAll(user_id: number): Promise<CoursesEntity> {
    const courses = await this.prisma.course.findMany({
      where: { user_id },
      include: { _count: { select: { tasks: true } } },
      omit: {
        user_id: true,
      },
    });

    return courses.map(({ _count, ...rest }) => ({
      ...rest,
      taskCount: _count?.tasks ?? 0,
    }));
  }

  async findOne(
    courseWhereUniqueInput: Prisma.CourseWhereUniqueInput,
  ): Promise<TasksGroupedByDate | null> {
    const courseWithTasks = await this.prisma.course.findUnique({
      where: courseWhereUniqueInput,
      select: {
        id: true,
        title: true,
        tasks: { orderBy: { due_time: "asc" } },
      },
    });

    if (!courseWithTasks) {
      return null;
    }

    const tasks = courseWithTasks.tasks.reduce(
      (acc, task) => {
        const dueTime = formatISO(task.due_time, { representation: "date" });
        if (!acc[dueTime]) {
          acc[dueTime] = [];
        }
        acc[dueTime].push({
          ...task,
          due_time: formatISO(task.due_time),
          created_at: formatISO(task.created_at),
          updated_at: formatISO(task.updated_at),
        });
        return acc;
      },
      {} as Record<string, TaskEntity[]>,
    );

    return {
      ...courseWithTasks,
      tasks,
    };
  }

  async update(
    courseWhereUniqueInput: Prisma.CourseWhereUniqueInput,
    updateCourseDto: UpdateCourseDto,
  ): Promise<CourseEntity> {
    return this.prisma.course.update({
      where: courseWhereUniqueInput,
      data: updateCourseDto,
      omit: { user_id: true },
    });
  }

  async remove(courseWhereUniqueInput: Prisma.CourseWhereUniqueInput) {
    return this.prisma.course.delete({ where: courseWhereUniqueInput });
  }
}
