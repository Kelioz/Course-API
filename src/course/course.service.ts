import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateCourseBody } from './dto/createModuleBody';
import { randomUUID } from 'crypto';
import { UserService } from 'src/user/user.service';

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
    if (!user) {
      throw new NotFoundException('Не удалось найти пользователя с таким id');
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
  async updateCourse() {}
  async deleteCourse(moduleId: string) {
    return await this.prisma.course.delete({ where: { id: moduleId } });
  }
}
