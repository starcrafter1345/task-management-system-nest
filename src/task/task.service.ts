import { Injectable } from "@nestjs/common";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { PrismaService } from "../prisma/prisma.service";
import { Prisma } from "@prisma/client";

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  create(createTaskDto: CreateTaskDto) {
    return this.prisma.task.create({ data: createTaskDto });
  }

  findAll(user_id: number) {
    return this.prisma.task.findMany({
      where: { course: { is: { user_id } } },
    });
  }

  findOne(taskWhereUniqueInput: Prisma.TaskWhereUniqueInput) {
    return this.prisma.task.findUnique({ where: taskWhereUniqueInput });
  }

  update(
    taskWhereUniqueInput: Prisma.TaskWhereUniqueInput,
    updateTaskDto: UpdateTaskDto,
  ) {
    return this.prisma.task.update({
      where: taskWhereUniqueInput,
      data: updateTaskDto,
    });
  }

  remove(taskWhereUniqueInput: Prisma.TaskWhereUniqueInput) {
    return this.prisma.task.delete({ where: taskWhereUniqueInput });
  }
}
