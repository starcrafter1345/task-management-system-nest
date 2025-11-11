import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
  HttpCode,
  NotFoundException,
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

@ApiBearerAuth()
@Controller("task")
@UseGuards(AuthGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @ZodResponse({ status: HttpStatus.CREATED, type: TaskEntity })
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.taskService.create(createTaskDto);
  }

  @Get()
  @ZodResponse({ status: HttpStatus.OK, type: [TaskEntity] })
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
