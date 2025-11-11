import { Injectable } from "@nestjs/common";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { PrismaService } from "../prisma/prisma.service";
import { Prisma, Task } from "@prisma/client";
import { TaskEntity } from "./entities/task.entity";

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  async create(createTaskDto: CreateTaskDto): Promise<TaskEntity> {
    const task = await this.prisma.task.create({ data: createTaskDto });
    return {
      ...task,
      created_at: task.created_at.toISOString(),
      updated_at: task.updated_at.toISOString(),
      due_time: task.due_time.toISOString(),
    };
  }

  async findAll(user_id: number): Promise<TaskEntity[]> {
    const tasks = await this.prisma.task.findMany({
      where: { course: { is: { user_id } } },
    });

    return tasks.map((task) => ({
      ...task,
      created_at: task.created_at.toISOString(),
      updated_at: task.updated_at.toISOString(),
      due_time: task.due_time.toISOString(),
    }));
  }

  async findOne(
    taskWhereUniqueInput: Prisma.TaskWhereUniqueInput,
  ): Promise<TaskEntity | null> {
    const task = await this.prisma.task.findUnique({
      where: taskWhereUniqueInput,
    });

    if (!task) {
      return null;
    }

    return {
      ...task,
      created_at: task.created_at.toISOString(),
      updated_at: task.updated_at.toISOString(),
      due_time: task.due_time.toISOString(),
    };
  }

  async update(
    taskWhereUniqueInput: Prisma.TaskWhereUniqueInput,
    updateTaskDto: UpdateTaskDto,
  ): Promise<TaskEntity> {
    const task = await this.prisma.task.update({
      where: taskWhereUniqueInput,
      data: updateTaskDto,
    });

    return {
      ...task,
      created_at: task.created_at.toISOString(),
      updated_at: task.updated_at.toISOString(),
      due_time: task.due_time.toISOString(),
    };
  }

  remove(taskWhereUniqueInput: Prisma.TaskWhereUniqueInput): Promise<Task> {
    return this.prisma.task.delete({ where: taskWhereUniqueInput });
  }
}
