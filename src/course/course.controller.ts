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
import { AuthGuard } from "../auth/auth.guard";
import { User } from "../auth/user.decorator";
import type { UserPayload } from "../auth/user-payload";
import { ApiBearerAuth, ApiNoContentResponse } from "@nestjs/swagger";
import { CourseEntity } from "./entities/course.entity";
import { ZodResponse } from "nestjs-zod";
import { CoursesEntity } from "./entities/courses.entity";

@ApiBearerAuth()
@Controller("course")
@UseGuards(AuthGuard)
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post()
  @ZodResponse({
    status: HttpStatus.CREATED,
    type: CourseEntity,
  })
  create(
    @User() user: UserPayload,
    @Body() createCourseDto: CreateCourseDto,
  ): Promise<CourseEntity> {
    return this.courseService.create(createCourseDto, user);
  }

  @Get()
  @ZodResponse({
    status: HttpStatus.OK,
    type: CoursesEntity,
  })
  findAll(@User() user: UserPayload) {
    return this.courseService.findAll(+user.sub);
  }

  @Get(":id")
  @ZodResponse({
    status: HttpStatus.OK,
    type: CourseEntity,
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
