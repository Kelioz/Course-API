import { ApiProperty } from '@nestjs/swagger';

// ========== BASIC TYPES ==========
export class CourseBasicDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty({ required: false, nullable: true })
  description?: string | null;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}

export class StepDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty({ required: false, nullable: true })
  description?: string | null;

  @ApiProperty()
  order!: number;

  @ApiProperty({ enum: ['Text', 'Video', 'Quiz', 'Task'] })
  type!: string;

  @ApiProperty({ required: false, nullable: true })
  content?: string | null;

  @ApiProperty({ required: false })
  isCompleted?: boolean;

  @ApiProperty({ required: false, nullable: true })
  completedAt?: Date | null;
}

export class ModuleDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty({ required: false, nullable: true })
  description?: string | null;

  @ApiProperty({ type: StepDto, isArray: true })
  step!: StepDto[];

  @ApiProperty({ required: false })
  progress?: number;
}

// ========== ENROLLMENT ==========
export class Enrollment {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  userId!: string;

  @ApiProperty()
  courseId!: string;

  @ApiProperty()
  progress!: number;

  @ApiProperty({ enum: ['InProgress', 'Completed', 'Dropped'] })
  status!: string;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  @ApiProperty({ type: CourseBasicDto, required: false })
  course?: CourseBasicDto;
}

export class EnrollmentResponse {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  userId!: string;

  @ApiProperty()
  courseId!: string;

  @ApiProperty()
  progress!: number;

  @ApiProperty({ enum: ['InProgress', 'Completed', 'Dropped'] })
  status!: string;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  @ApiProperty({ type: CourseBasicDto, required: false })
  course?: CourseBasicDto;
}

// ========== PROGRESS ==========
export class ProgressResponse {
  @ApiProperty()
  progress!: number;

  @ApiProperty()
  completedSteps!: number;

  @ApiProperty()
  totalSteps!: number;

  @ApiProperty({ enum: ['InProgress', 'Completed', 'Dropped'] })
  status!: string;
}

// ========== COMPLETED STEPS ==========
export class CompletedStepResponse {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  completedAt!: Date;

  @ApiProperty()
  stepId!: string;

  @ApiProperty({ type: StepDto })
  step!: StepDto;
}

// ========== STATS ==========
export class EnrollmentStatsCourseDto {
  @ApiProperty()
  courseId!: string;

  @ApiProperty()
  courseTitle!: string;

  @ApiProperty()
  progress!: number;

  @ApiProperty({ enum: ['InProgress', 'Completed', 'Dropped'] })
  status!: string;

  @ApiProperty()
  enrolledAt!: Date;
}

export class EnrollmentStatsResponse {
  @ApiProperty()
  totalCourses!: number;

  @ApiProperty()
  completedCourses!: number;

  @ApiProperty()
  inProgressCourses!: number;

  @ApiProperty()
  droppedCourses!: number;

  @ApiProperty()
  averageProgress!: number;

  @ApiProperty({ type: EnrollmentStatsCourseDto, isArray: true })
  enrollments!: EnrollmentStatsCourseDto[];
}

// ========== COURSE WITH PROGRESS ==========
export class CourseWithProgressDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty({ required: false, nullable: true })
  description?: string | null;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  @ApiProperty({ type: ModuleDto, isArray: true })
  module!: ModuleDto[];

  @ApiProperty()
  isEnrolled!: boolean;

  @ApiProperty()
  canEnroll!: boolean;

  @ApiProperty({ required: false, nullable: true })
  progress?: number | null;

  @ApiProperty({
    type: 'object',
    properties: {
      id: { type: 'string' },
      progress: { type: 'number' },
      status: { type: 'string' },
      completedStepsCount: { type: 'number' },
      totalStepsCount: { type: 'number' },
    },
    nullable: true,
  })
  enrollment?: {
    id: string;
    progress: number;
    status: string;
    completedStepsCount: number;
    totalStepsCount: number;
  };
}
