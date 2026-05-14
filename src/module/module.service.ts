import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateModuleBody } from './dto/createModuleBody';
import { UpdateModuleParams } from './dto/putModuleParams';
import { UpdateModuleBody } from './dto/putModuleBody';
import { CourseService } from 'src/course/course.service';

@Injectable()
export class ModuleService {
  constructor(
    private prisma: PrismaService,
    private courseService: CourseService,
  ) {}

  async getAllModules() {
    return await this.prisma.module.findMany({
      include: {
        step: {
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async getModuleById(id: string) {
    const module = await this.prisma.module.findUnique({
      where: { id: id },
      include: {
        step: {
          orderBy: { order: 'asc' },
        },
      },
    });
    if (!module) throw new NotFoundException('Модуль не найден');
    return module;
  }

  async createModule(data: CreateModuleBody) {
    // Проверяем существование курса
    if (data.courseId) {
      await this.courseService.getCoursesById(data.courseId);
    }

    const module = await this.prisma.module.create({
      data: {
        title: data.title,
        description: data.description,
        courseId: data.courseId,
      },
      include: {
        step: {
          orderBy: { order: 'asc' },
        },
      },
    });

    return module;
  }

  async updateModule(params: UpdateModuleParams, data: UpdateModuleBody) {
    const existingModule = await this.getModuleById(params.id);
    if (!existingModule) throw new NotFoundException('Модуль не найден');

    const module = await this.prisma.module.update({
      where: { id: params.id },
      data: {
        title: data.title,
        description: data.description,
      },
      include: {
        step: {
          orderBy: { order: 'asc' },
        },
      },
    });

    return module;
  }
}
