import { Task } from "@prisma/client";
import { ApiProperty } from "@nestjs/swagger";

export class TaskEntity implements Task {
  @ApiProperty()
  id: number;

  @ApiProperty()
  course_id: number;

  @ApiProperty()
  name: string;

  @ApiProperty({ type: String })
  description: string | null;

  @ApiProperty()
  completed: boolean;

  @ApiProperty({ format: "date-time", type: String })
  due_time: Date;

  @ApiProperty({ format: "date-time", type: String })
  created_at: Date;

  @ApiProperty({ format: "date-time", type: String })
  updated_at: Date;
}
