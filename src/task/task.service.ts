import { Injectable } from "@nestjs/common";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { PrismaService } from "../prisma/prisma.service";
import { Prisma, Task } from "@prisma/client";

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  create(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.prisma.task.create({ data: createTaskDto });
  }

  findAll(user_id: number): Promise<Task[]> {
    return this.prisma.task.findMany({
      where: { course: { is: { user_id } } },
    });
  }

  findOne(
    taskWhereUniqueInput: Prisma.TaskWhereUniqueInput,
  ): Promise<Task | null> {
    return this.prisma.task.findUnique({ where: taskWhereUniqueInput });
  }

  update(
    taskWhereUniqueInput: Prisma.TaskWhereUniqueInput,
    updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    return this.prisma.task.update({
      where: taskWhereUniqueInput,
      data: updateTaskDto,
    });
  }

  remove(taskWhereUniqueInput: Prisma.TaskWhereUniqueInput): Promise<Task> {
    return this.prisma.task.delete({ where: taskWhereUniqueInput });
  }
}
