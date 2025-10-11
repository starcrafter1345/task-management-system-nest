import { CourseEntity } from "./course.entity";

export type CoursesEntity = (CourseEntity & { taskCount: number })[];
