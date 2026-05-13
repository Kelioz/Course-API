import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateCourseBody } from './dto/createCourseBody';
import { randomUUID } from 'crypto';
import { UserService } from 'src/user/user.service';
import { UpdateCourseParams } from './dto/putCourseParams';
import { UpdateCourseBody } from './dto/putCourseBody';

@Injectable()
export class CourseService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
  ) {}

  async getAllCourses() {
    return await this.prisma.course.findMany({ orderBy: { createdAt: 'asc' } });
  }

  async getCoursesById(id: string) {
    const course = await this.prisma.course.findUnique({ where: { id: id } });
    if (!course) throw new NotFoundException('курс не найден');
    return course;
  }

  async getCoursesByUserId(userId: string) {
    return await this.prisma.course.findMany({ where: { userId: userId } });
  }
  async createCourse(data: CreateCourseBody) {
    let user;
    if (data.userId) {
      user = await this.userService.getById(data.userId);
    }

    const course = await this.prisma.course.create({
      data: {
        id: randomUUID(),
        title: data.title,
        description: data.description,
        userId: data.userId,
      },
    });

    return course;
  }
  async updateCourse(params: UpdateCourseParams, data: UpdateCourseBody) {
    const exisitingCourse = await this.getCoursesById(params.id);
    if (!exisitingCourse) throw new NotFoundException('Курс не найден');

    const course = await this.prisma.course.update({
      where: { id: params.id },
      data: {
        title: data.title,
        description: data.description,
      },
    });

    return course;
  }
  async deleteCourse(courseId: string) {
    const existingCourse = await this.getCoursesById(courseId);
    if (!existingCourse) throw new NotFoundException('Курс не найден');

    const enrollments = await this.prisma.enrollment.count({
      where: { courseId: courseId },
    });

    if (enrollments > 0) {
      throw new ConflictException(
        'Cannot delete course with active enrollments',
      );
    }

    return await this.prisma.course.delete({ where: { id: courseId } });
  }
}
