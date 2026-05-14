import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StepService } from './step.service';
import { CreateStepBody, GetStepDto, UpdateStepDto } from './dto';
import { Auth } from 'src/auth/decorators/auth.decorator';

@ApiTags('steps')
@Controller('steps')
@UseGuards(RolesGuard)
export class StepController {
  constructor(private stepService: StepService) {}

  @Get(':stepId')
  @ApiResponse({ type: GetStepDto })
  @ApiOperation({
    operationId: 'getStepById',
    summary: 'Получить шаг по ID',
    description: 'Возвращает информацию о конкретном шаге',
  })
  @Auth()
  @ApiParam({ name: 'stepId', type: String, description: 'ID шага' })
  async getStepById(@Param('stepId') stepId: string) {
    return await this.stepService.getStepById(stepId);
  }

  @Get('module/:moduleId')
  @ApiResponse({ type: GetStepDto, isArray: true })
  @ApiOperation({
    operationId: 'getStepsByModule',
    summary: 'Получить все шаги модуля',
    description:
      'Возвращает все шаги конкретного модуля, отсортированные по порядку',
  })
  @ApiParam({ name: 'moduleId', type: String, description: 'ID модуля' })
  @Auth()
  async getStepsByModuleId(@Param('moduleId') moduleId: string) {
    return await this.stepService.getStepsByModuleId(moduleId);
  }

  @Post()
  @ApiResponse({ type: GetStepDto, status: HttpStatus.CREATED })
  @ApiOperation({
    operationId: 'createStep',
    summary: 'Создать новый шаг',
    description: 'Создает новый шаг в модуле',
  })
  @Auth()
  async createStep(@Body() data: CreateStepBody) {
    return await this.stepService.createStep(data);
  }

  @Put(':stepId')
  @ApiResponse({ type: GetStepDto })
  @ApiOperation({
    operationId: 'updateStep',
    summary: 'Обновить шаг',
    description: 'Обновляет информацию о шаге',
  })
  @ApiParam({ name: 'stepId', type: String, description: 'ID шага' })
  @Auth()
  async updateStep(
    @Param('stepId') stepId: string,
    @Body() data: UpdateStepDto,
  ) {
    return await this.stepService.updateStep(stepId, data);
  }

  @Delete(':stepId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @ApiOperation({
    operationId: 'deleteStep',
    summary: 'Удалить шаг',
    description: 'Удаляет шаг из модуля',
  })
  @Auth()
  @ApiParam({ name: 'stepId', type: String, description: 'ID шага' })
  async deleteStep(@Param('stepId') stepId: string) {
    return await this.stepService.deleteStep(stepId);
  }
}
