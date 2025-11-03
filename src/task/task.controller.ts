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
} from "@nestjs/common";
import { TaskService } from "./task.service";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { AuthGuard } from "../auth/auth.guard";
import { User } from "../auth/user.decorator";
import type { UserPayload } from "../auth/user-payload";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
} from "@nestjs/swagger";
import { TaskEntity } from "./entities/task.entity";

@ApiBearerAuth()
@Controller("task")
@UseGuards(AuthGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @ApiCreatedResponse({
    type: TaskEntity,
  })
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.taskService.create(createTaskDto);
  }

  @Get()
  @ApiOkResponse({
    type: TaskEntity,
    isArray: true,
  })
  findAll(@User() user: UserPayload) {
    return this.taskService.findAll(+user.sub);
  }

  @Get(":id")
  @ApiOkResponse({
    type: TaskEntity,
  })
  findOne(@Param("id") id: string) {
    return this.taskService.findOne({ id: +id });
  }

  @Patch(":id")
  @ApiOkResponse({
    type: TaskEntity,
  })
  update(@Param("id") id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.taskService.update({ id: +id }, updateTaskDto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.taskService.remove({ id: +id });
  }
}
