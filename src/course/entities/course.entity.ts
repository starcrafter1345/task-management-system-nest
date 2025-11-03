import { Course } from "@prisma/client";
import { ApiProperty } from "@nestjs/swagger";

export class CourseEntity implements Omit<Course, "user_id"> {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  color: string;
}
