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
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
} from "@nestjs/swagger";
import { CourseEntity } from "./entities/course.entity";

@ApiBearerAuth()
@Controller("course")
@UseGuards(AuthGuard)
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post()
  @ApiCreatedResponse({
    type: CourseEntity,
  })
  create(
    @User() user: UserPayload,
    @Body() createCourseDto: CreateCourseDto,
  ): Promise<CourseEntity> {
    return this.courseService.create(createCourseDto, user);
  }

  @Get()
  @ApiOkResponse({
    type: CourseEntity,
    isArray: true,
    example: [
      {
        id: 0,
        title: "Math101",
        color: "#ff0000",
        taskCount: 2,
      },
      {
        id: 1,
        title: "English",
        color: "#0000ff",
        taskCount: 0,
      },
    ],
  })
  findAll(@User() user: UserPayload) {
    return this.courseService.findAll(+user.sub);
  }

  @Get(":id")
  @ApiOkResponse({
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
  @ApiOkResponse({
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
