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
import { User } from "../auth/user.decorator";
import { ApiBearerAuth } from "@nestjs/swagger";
import { ZodResponse } from "nestjs-zod";
import { TaskEntity } from "./entities/task.entity";
import { StatisticsEntity } from "./dto/statistics.entity";
import { TasksGroupedByCourse } from "./entities/tasksGroupedByCourse";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RefinedUserDto } from "../auth/dto/refined-user.dto";

@ApiBearerAuth()
@Controller("task")
@UseGuards(JwtAuthGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get("/stats")
  @ZodResponse({ status: HttpStatus.OK, type: StatisticsEntity })
  stats(@User() user: RefinedUserDto) {
    return this.taskService.stats(user.id);
  }

  @Post()
  @ZodResponse({ status: HttpStatus.CREATED, type: TaskEntity })
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.taskService.create(createTaskDto);
  }

  @Get()
  @ZodResponse({ status: HttpStatus.OK, type: TasksGroupedByCourse })
  findAll(@User() user: RefinedUserDto) {
    return this.taskService.findAll(user.id);
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
