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
import { CourseService } from "./course.service";
import { CreateCourseDto } from "./dto/create-course.dto";
import { UpdateCourseDto } from "./dto/update-course.dto";
import { User } from "../auth/user.decorator";
import { ApiBearerAuth, ApiNoContentResponse } from "@nestjs/swagger";
import { CourseEntity } from "./entities/course.entity";
import { ZodResponse } from "nestjs-zod";
import { TasksGroupedByDate } from "./entities/tasksGroupedByDate";
import { CoursesEntity } from "./entities/courses.entity";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RefinedUserDto } from "../auth/dto/refined-user.dto";

@ApiBearerAuth()
@Controller("course")
@UseGuards(JwtAuthGuard)
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post()
  @ZodResponse({
    status: HttpStatus.CREATED,
    type: CourseEntity,
  })
  create(
    @User() user: RefinedUserDto,
    @Body() createCourseDto: CreateCourseDto,
  ): Promise<CourseEntity> {
    return this.courseService.create(createCourseDto, user);
  }

  @Get()
  @ZodResponse({
    status: HttpStatus.OK,
    type: CoursesEntity,
  })
  findAll(@User() user: RefinedUserDto) {
    return this.courseService.findAll(user.id);
  }

  @Get(":id")
  @ZodResponse({
    status: HttpStatus.OK,
    type: TasksGroupedByDate,
  })
  async findOne(@Param("id") id: string) {
    const course = await this.courseService.findOne({ id: +id });

    if (!course) {
      throw new NotFoundException();
    }

    return course;
  }

  @Patch(":id")
  @ZodResponse({
    status: HttpStatus.OK,
    type: CourseEntity,
  })
  update(@Param("id") id: string, @Body() updateCourseDto: UpdateCourseDto) {
    return this.courseService.update({ id: +id }, updateCourseDto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(":id")
  @ApiNoContentResponse()
  async remove(@Param("id") id: string) {
    await this.courseService.remove({ id: +id });
  }
}
