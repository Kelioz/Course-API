import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UserModule } from 'src/user/user.module';
import { EnrollmentController } from './enrollment.controller';
import { EnrollmentService } from './enrollment.service';
import { CourseModule } from 'src/course/course.module';

@Module({
  imports: [UserModule, CourseModule],
  controllers: [EnrollmentController],
  providers: [EnrollmentService, PrismaService],
  exports: [EnrollmentService],
})
export class EnrollmentModule {}
