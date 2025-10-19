import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  NotFoundException,
} from "@nestjs/common";
import { CourseService } from "./course.service";
import { CreateCourseDto } from "./dto/create-course.dto";
import { UpdateCourseDto } from "./dto/update-course.dto";
import { AuthGuard } from "../auth/auth.guard";
import { User } from "../auth/user.decorator";
import type { UserPayload } from "../auth/user-payload";

@Controller("course")
@UseGuards(AuthGuard)
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post()
  create(@User() user: UserPayload, @Body() createCourseDto: CreateCourseDto) {
    return this.courseService.create(createCourseDto, user);
  }

  @Get()
  findAll(@User() user: UserPayload) {
    return this.courseService.findAll(+user.sub);
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    const course = await this.courseService.findOne({ id: +id });
    if (!course) {
      throw new NotFoundException();
    }

    return course;
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateCourseDto: UpdateCourseDto) {
    return this.courseService.update({ id: +id }, updateCourseDto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(":id")
  async remove(@Param("id") id: string) {
    await this.courseService.remove({ id: +id });
  }
}
