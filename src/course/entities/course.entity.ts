import { Course } from "@prisma/client";

export type CourseEntity = Omit<Course, "user_id">;
