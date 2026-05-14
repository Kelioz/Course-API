import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateStepBody } from './dto/createStep.dto';
import { UpdateStepDto } from './dto/updateStep.dto';

@Injectable()
export class StepService {
  constructor(private prisma: PrismaService) {}

  async getStepById(stepId: string) {
    const step = await this.prisma.step.findUnique({
      where: { id: stepId },
    });
    if (!step) throw new NotFoundException('Шаг не найден');
    return step;
  }

  async getStepsByModuleId(moduleId: string) {
    return await this.prisma.step.findMany({
      where: { moduleId: moduleId },
      orderBy: { order: 'asc' },
    });
  }

  async createStep(data: CreateStepBody) {
    // Проверяем существование модуля
    const module = await this.prisma.module.findUnique({
      where: { id: data.moduleId },
    });
    if (!module) throw new NotFoundException('Модуль не найден');

    const step = await this.prisma.step.create({
      data: {
        title: data.title,
        description: data.description,
        type: data.type,
        order: data.order,
        content: data.content,
        moduleId: data.moduleId,
      },
    });

    return step;
  }

  async updateStep(stepId: string, data: UpdateStepDto) {
    await this.getStepById(stepId);

    const step = await this.prisma.step.update({
      where: { id: stepId },
      data: {
        title: data.title,
        description: data.description,
        type: data.type,
        order: data.order,
        content: data.content,
      },
    });

    return step;
  }

  async deleteStep(stepId: string) {
    await this.getStepById(stepId);

    await this.prisma.step.delete({
      where: { id: stepId },
    });
  }
}
