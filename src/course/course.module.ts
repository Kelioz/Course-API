import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [UserModule],
  controllers: [CourseController],
  providers: [CourseService, PrismaService],
  exports: [CourseService],
})
export class CourseModule {}
