import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CourseService } from './course.service';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { AllCourses } from './dto/getAllCourses';
import { Course } from './dto/getCourses';
import { CreateCourseBody } from './dto/createModuleBody';

@Controller('course')
@UseGuards(RolesGuard)
export class CourseController {
  public constructor(private courseService: CourseService) {}

  @Get()
  @ApiResponse({ type: AllCourses, isArray: true })
  @ApiOperation({ operationId: 'getAllCourses' })
  async getAllCcourses() {
    return await this.courseService.getAllCourses();
  }

  @Post()
  @ApiResponse({ type: Course })
  @ApiOperation({ operationId: 'createCourse' })
  async createCourse(@Body() data: CreateCourseBody) {
    return this.courseService.createCourse(data);
  }

  @Get(':id')
  @ApiResponse({ type: Course })
  @ApiOperation({ operationId: 'getCcourseById' })
  @ApiParam({ name: 'id', type: String })
  async getCcourseById(@Param('id') id: string) {
    return await this.courseService.getCoursesById(id);
  }
}
