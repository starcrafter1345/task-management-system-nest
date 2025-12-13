import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { TaskService } from "./task.service";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { AuthGuard } from "../auth/auth.guard";
import { User } from "../auth/user.decorator";
import type { UserPayload } from "../auth/user-payload";
import { ApiBearerAuth } from "@nestjs/swagger";
import { ZodResponse } from "nestjs-zod";
import { TaskEntity } from "./entities/task.entity";
import { StatisticsEntity } from "./dto/statistics.entity";
import { TasksGroupedByCourse } from "./entities/tasksGroupedByCourse";

@ApiBearerAuth()
@Controller("task")
@UseGuards(AuthGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get("/stats")
  @ZodResponse({ status: HttpStatus.OK, type: StatisticsEntity })
  stats(@User() user: UserPayload) {
    return this.taskService.stats(+user.sub);
  }

  @Post()
  @ZodResponse({ status: HttpStatus.CREATED, type: TaskEntity })
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.taskService.create(createTaskDto);
  }

  @Get()
  @ZodResponse({ status: HttpStatus.OK, type: TasksGroupedByCourse })
  findAll(@User() user: UserPayload) {
    return this.taskService.findAll(+user.sub);
  }

  @Get(":id")
  @ZodResponse({ status: HttpStatus.OK, type: TaskEntity })
  async findOne(@Param("id") id: string) {
    const task = await this.taskService.findOne({ id: +id });
    if (!task) {
      throw new NotFoundException();
    }

    return task;
  }

  @Patch(":id")
  @ZodResponse({ status: HttpStatus.OK, type: TaskEntity })
  update(@Param("id") id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.taskService.update({ id: +id }, updateTaskDto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.taskService.remove({ id: +id });
  }
}
