import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CourseService } from 'src/course/course.service';
import { PrismaService } from 'src/prisma.service';
import { UserService } from 'src/user/user.service';
import {
  EnrollmentResponse,
  CompletedStepResponse,
} from './dto/enrollment.dto';

@Injectable()
export class EnrollmentService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
    private courseService: CourseService,
  ) {}

  async getAllEnrollmentCoursesByUser(
    userId: string,
  ): Promise<EnrollmentResponse[]> {
    return await this.prisma.enrollment.findMany({
      where: { userId: userId },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            description: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });
  }

  // Получение детальной информации о курсе с прогрессом пользователя
  async getCourseWithUserProgress(userId: string, courseId: string) {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: userId,
          courseId: courseId,
        },
      },
      include: {
        completedSteps: {
          include: {
            step: true,
          },
        },
      },
    });

    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      include: {
        module: {
          include: {
            step: {
              select: {
                id: true,
                title: true,
                description: true,
                order: true,
                type: true,
                content: true,
              },
              orderBy: {
                order: 'asc',
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    if (!enrollment) {
      return {
        id: course.id,
        title: course.title,
        description: course.description,
        createdAt: course.createdAt,
        updatedAt: course.updatedAt,
        module: course.module.map((m) => ({
          id: m.id,
          title: m.title,
          description: m.description,
          step: m.step.map((s) => ({
            ...s,
            isCompleted: false,
            completedAt: null,
          })),
          progress: 0,
        })),
        isEnrolled: false,
        canEnroll: true,
        progress: null,
      };
    }

    // Формируем данные с прогрессом
    const completedStepIds = new Set(
      enrollment.completedSteps.map((cs) => cs.stepId),
    );

    // Обогащаем шаги информацией о выполнении
    const modulesWithProgress = course.module.map((module) => ({
      id: module.id,
      title: module.title,
      description: module.description,
      step: module.step.map((step) => ({
        ...step,
        isCompleted: completedStepIds.has(step.id),
        completedAt: enrollment.completedSteps.find(
          (cs) => cs.stepId === step.id,
        )?.completedAt,
      })),
      progress:
        module.step.length > 0
          ? (module.step.filter((step) => completedStepIds.has(step.id))
              .length /
              module.step.length) *
            100
          : 0,
    }));

    return {
      id: course.id,
      title: course.title,
      description: course.description,
      createdAt: course.createdAt,
      updatedAt: course.updatedAt,
      module: modulesWithProgress,
      isEnrolled: true,
      canEnroll: false,
      enrollment: {
        id: enrollment.id,
        progress: enrollment.progress,
        status: enrollment.status,
        completedStepsCount: enrollment.completedSteps.length,
        totalStepsCount: modulesWithProgress.reduce(
          (acc, m) => acc + m.step.length,
          0,
        ),
      },
    };
  }

  async getUserProgressInCourse(userId: string, courseId: string) {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: userId,
          courseId: courseId,
        },
      },
      include: {
        completedSteps: true,
      },
    });

    if (!enrollment) {
      throw new NotFoundException('User not enrolled in this course');
    }

    const totalSteps = await this.prisma.step.count({
      where: {
        module: {
          courseId: courseId,
        },
      },
    });

    return {
      progress: enrollment.progress,
      completedSteps: enrollment.completedSteps.length,
      totalSteps: totalSteps,
      status: enrollment.status,
    };
  }
  async createEnrollmentCourse(
    userId: string,
    courseId: string,
  ): Promise<EnrollmentResponse> {
    const user = await this.userService.getById(userId);
    if (!user) throw new NotFoundException('User not found');

    const course = await this.courseService.getCoursesById(courseId);
    if (!course) throw new NotFoundException('Course not found');

    const existingEnrollment = await this.prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: userId,
          courseId: courseId,
        },
      },
    });

    if (existingEnrollment) {
      throw new ConflictException('User already enrolled in this course');
    }

    return await this.prisma.enrollment.create({
      data: {
        courseId: courseId,
        userId: userId,
        status: 'InProgress',
        progress: 0,
      },
    });
  }

  async deleteEnrollmentCourse(
    userId: string,
    courseId: string,
  ): Promise<void> {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: userId,
          courseId: courseId,
        },
      },
    });

    if (!enrollment) {
      throw new NotFoundException('Enrollment not found');
    }

    await this.prisma.enrollment.delete({
      where: {
        userId_courseId: {
          userId: userId,
          courseId: courseId,
        },
      },
    });
  }

  async getCompletedSteps(
    userId: string,
    courseId: string,
  ): Promise<CompletedStepResponse[]> {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: userId,
          courseId: courseId,
        },
      },
      include: {
        completedSteps: {
          include: {
            step: {
              select: {
                id: true,
                title: true,
                description: true,
                order: true,
                type: true,
                content: true,
              },
            },
          },
          orderBy: {
            completedAt: 'desc',
          },
        },
      },
    });

    if (!enrollment) {
      throw new NotFoundException('User not enrolled in this course');
    }

    return enrollment.completedSteps;
  }

  async completeStep(userId: string, stepId: string) {
    // Находим шаг и его курс
    const step = await this.prisma.step.findUnique({
      where: { id: stepId },
      include: {
        module: {
          include: {
            course: true,
          },
        },
      },
    });

    if (!step) {
      throw new NotFoundException('Step not found');
    }

    // Находим запись пользователя на курс
    const enrollment = await this.prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: userId,
          courseId: step.module.course.id,
        },
      },
    });

    if (!enrollment) {
      throw new NotFoundException('User not enrolled in this course');
    }

    // Проверяем, не выполнен ли уже шаг
    const existingCompletedStep = await this.prisma.completedStep.findUnique({
      where: {
        enrollmentId_stepId: {
          enrollmentId: enrollment.id,
          stepId: stepId,
        },
      },
    });

    if (existingCompletedStep) {
      throw new ConflictException('Step already completed');
    }

    // Создаем запись о выполненном шаге
    const completedStep = await this.prisma.completedStep.create({
      data: {
        enrollmentId: enrollment.id,
        stepId: stepId,
      },
      include: {
        step: {
          select: {
            id: true,
            title: true,
            description: true,
            order: true,
            type: true,
            content: true,
          },
        },
      },
    });

    // Обновляем прогресс курса
    await this.updateCourseProgress(enrollment.id);

    return completedStep;
  }

  async uncompleteStep(userId: string, stepId: string): Promise<void> {
    // Находим шаг и его курс
    const step = await this.prisma.step.findUnique({
      where: { id: stepId },
      include: {
        module: {
          include: {
            course: true,
          },
        },
      },
    });

    if (!step) {
      throw new NotFoundException('Step not found');
    }

    // Находим запись пользователя на курс
    const enrollment = await this.prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: userId,
          courseId: step.module.course.id,
        },
      },
    });

    if (!enrollment) {
      throw new NotFoundException('User not enrolled in this course');
    }

    // Удаляем запись о выполненном шаге
    await this.prisma.completedStep.delete({
      where: {
        enrollmentId_stepId: {
          enrollmentId: enrollment.id,
          stepId: stepId,
        },
      },
    });

    // Обновляем прогресс курса
    await this.updateCourseProgress(enrollment.id);
  }

  private async updateCourseProgress(enrollmentId: string): Promise<void> {
    // Получаем все шаги курса
    const enrollment = await this.prisma.enrollment.findUnique({
      where: { id: enrollmentId },
      include: {
        course: {
          include: {
            module: {
              include: {
                step: true,
              },
            },
          },
        },
        completedSteps: true,
      },
    });

    if (!enrollment) {
      return;
    }

    // Считаем общее количество шагов
    const totalSteps = enrollment.course.module.reduce(
      (acc, module) => acc + module.step.length,
      0,
    );

    // Считаем количество выполненных шагов
    const completedStepsCount = enrollment.completedSteps.length;

    // Вычисляем прогресс в процентах
    const progress =
      totalSteps === 0 ? 0 : (completedStepsCount / totalSteps) * 100;

    // Определяем статус
    const status = progress === 100 ? 'Completed' : enrollment.status;

    // Обновляем запись
    await this.prisma.enrollment.update({
      where: { id: enrollmentId },
      data: {
        progress: progress,
        status: status,
      },
    });
  }

  async getUserStats(userId: string) {
    const enrollments = await this.prisma.enrollment.findMany({
      where: { userId: userId },
      include: {
        course: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    const totalCourses = enrollments.length;
    const completedCourses = enrollments.filter(
      (e) => e.status === 'Completed',
    ).length;
    const inProgressCourses = enrollments.filter(
      (e) => e.status === 'InProgress',
    ).length;
    const droppedCourses = enrollments.filter(
      (e) => e.status === 'Dropped',
    ).length;

    const averageProgress =
      totalCourses === 0
        ? 0
        : enrollments.reduce((acc, e) => acc + e.progress, 0) / totalCourses;

    return {
      totalCourses,
      completedCourses,
      inProgressCourses,
      droppedCourses,
      averageProgress: Math.round(averageProgress),
      enrollments: enrollments.map((e) => ({
        courseId: e.courseId,
        courseTitle: e.course.title,
        progress: e.progress,
        status: e.status,
        enrolledAt: e.createdAt,
      })),
    };
  }
}
