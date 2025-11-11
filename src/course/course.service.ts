import { Injectable } from "@nestjs/common";
import { CreateCourseDto } from "./dto/create-course.dto";
import { UpdateCourseDto } from "./dto/update-course.dto";
import { PrismaService } from "../prisma/prisma.service";
import { Prisma } from "@prisma/client";
import type { UserPayload } from "../auth/user-payload";
import { CourseEntity } from "./entities/course.entity";

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

  async findAll(user_id: number): Promise<CourseEntity[]> {
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
  ): Promise<CourseEntity | null> {
    return this.prisma.course.findUnique({
      where: courseWhereUniqueInput,
      include: {
        tasks: true,
      },
      omit: { user_id: true },
    });
  }

  update(
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
