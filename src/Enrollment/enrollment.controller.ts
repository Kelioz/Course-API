import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { EnrollmentService } from './enrollment.service';
import { ApiOperation, ApiResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import {
  EnrollmentResponse,
  EnrollmentStatsResponse,
  ProgressResponse,
  CompletedStepResponse,
  CourseWithProgressDto,
} from './dto/enrollment.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Auth } from 'src/auth/decorators/auth.decorator';

@ApiTags('enrollment')
@Controller('enrollment')
@UseGuards(RolesGuard)
export class EnrollmentController {
  public constructor(private enrollmentService: EnrollmentService) {}

  @Get()
  @ApiResponse({ type: EnrollmentResponse, isArray: true })
  @ApiOperation({
    operationId: 'getAllEnrollmentCoursesByUser',
    summary: 'Получение всех курсов на которые записан пользователь',
    description:
      'Возвращает список всех курсов, на которые записан текущий пользователь',
  })
  @Auth()
  async getAllEnrollmentCoursesByUser(@CurrentUser('id') id: string) {
    return await this.enrollmentService.getAllEnrollmentCoursesByUser(id);
  }

  @Post(':courseId')
  @ApiResponse({ type: EnrollmentResponse, status: HttpStatus.CREATED })
  @ApiOperation({
    operationId: 'createEnrollmentCourse',
    summary: 'Запись пользователя на курс',
    description: 'Создает новую запись пользователя на курс',
  })
  @ApiParam({ name: 'courseId', type: String, description: 'ID курса' })
  @Auth()
  async createEnrollmentCourse(
    @CurrentUser('id') userId: string,
    @Param('courseId') courseId: string,
  ) {
    return await this.enrollmentService.createEnrollmentCourse(
      userId,
      courseId,
    );
  }

  @Delete(':courseId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @ApiOperation({
    operationId: 'deleteEnrollmentCourse',
    summary: 'Отказ от курса (удаление записи)',
    description: 'Удаляет запись пользователя на курс',
  })
  @ApiParam({ name: 'courseId', type: String, description: 'ID курса' })
  @Auth()
  async deleteEnrollmentCourse(
    @CurrentUser('id') userId: string,
    @Param('courseId') courseId: string,
  ) {
    return await this.enrollmentService.deleteEnrollmentCourse(
      userId,
      courseId,
    );
  }

  @Get('progress/:courseId')
  @ApiResponse({ type: ProgressResponse })
  @ApiOperation({
    operationId: 'getUserProgressInCourse',
    summary: 'Получение прогресса пользователя по конкретному курсу',
    description:
      'Возвращает информацию о прогрессе пользователя в конкретном курсе',
  })
  @ApiParam({ name: 'courseId', type: String, description: 'ID курса' })
  @Auth()
  async getUserProgressInCourse(
    @CurrentUser('id') userId: string,
    @Param('courseId') courseId: string,
  ) {
    return await this.enrollmentService.getUserProgressInCourse(
      userId,
      courseId,
    );
  }

  @Get('completed/:courseId')
  @ApiResponse({ type: CompletedStepResponse, isArray: true })
  @ApiOperation({
    operationId: 'getCompletedSteps',
    summary: 'Получение всех выполненных шагов по курсу',
    description: 'Возвращает список всех выполненных шагов в конкретном курсе',
  })
  @ApiParam({ name: 'courseId', type: String, description: 'ID курса' })
  @Auth()
  async getCompletedSteps(
    @CurrentUser('id') userId: string,
    @Param('courseId') courseId: string,
  ) {
    return await this.enrollmentService.getCompletedSteps(userId, courseId);
  }

  @Post('step/:stepId/complete')
  @ApiResponse({ type: Object, status: HttpStatus.CREATED })
  @ApiOperation({
    operationId: 'completeStep',
    summary: 'Отметить шаг как выполненный',
    description: 'Создает запись о выполнении шага пользователем',
  })
  @ApiParam({ name: 'stepId', type: String, description: 'ID шага' })
  @Auth()
  async completeStep(
    @CurrentUser('id') userId: string,
    @Param('stepId') stepId: string,
  ) {
    return await this.enrollmentService.completeStep(userId, stepId);
  }

  @Delete('step/:stepId/uncomplete')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @ApiOperation({
    operationId: 'uncompleteStep',
    summary: 'Отменить выполнение шага',
    description: 'Удаляет запись о выполнении шага',
  })
  @ApiParam({ name: 'stepId', type: String, description: 'ID шага' })
  @Auth()
  async uncompleteStep(
    @CurrentUser('id') userId: string,
    @Param('stepId') stepId: string,
  ) {
    return await this.enrollmentService.uncompleteStep(userId, stepId);
  }

  @Get('stats')
  @ApiResponse({ type: EnrollmentStatsResponse })
  @ApiOperation({
    operationId: 'getUserStats',
    summary: 'Получение статистики пользователя по всем курсам',
    description:
      'Возвращает агрегированную статистику по всем курсам пользователя',
  })
  @Auth()
  async getUserStats(@CurrentUser('id') userId: string) {
    return await this.enrollmentService.getUserStats(userId);
  }

  @Get('course/:courseId')
  @ApiResponse({ type: CourseWithProgressDto })
  @ApiOperation({
    operationId: 'getCourseWithUserProgress',
    summary: 'Получение курса с прогрессом пользователя',
    description:
      'Возвращает подробную информацию о курсе с прогрессом пользователя по каждому модулю и шагу',
  })
  @ApiParam({ name: 'courseId', type: String })
  @Auth()
  async getCourseWithUserProgress(
    @CurrentUser('id') userId: string,
    @Param('courseId') courseId: string,
  ) {
    return await this.enrollmentService.getCourseWithUserProgress(
      userId,
      courseId,
    );
  }
}
