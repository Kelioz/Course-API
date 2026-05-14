import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AllModule } from './dto/getAllModule';
import { ModuleService } from './module.service';
import { Module } from './dto/getModule';
import { CreateModuleBody } from './dto/createModuleBody';
import { UpdateModuleParams } from './dto/putModuleParams';
import { UpdateModuleBody } from './dto/putModuleBody';
import { Auth } from 'src/auth/decorators/auth.decorator';

@ApiTags('modules')
@Controller('modules')
@UseGuards(RolesGuard)
export class ModuleController {
  public constructor(private moduleService: ModuleService) {}

  @Get()
  @ApiResponse({ type: AllModule, isArray: true })
  @ApiOperation({
    operationId: 'getAllModules',
    summary: 'Получить все модули',
    description: 'Возвращает список всех модулей со всеми шагами',
  })
  @Auth()
  async getAllModules() {
    return await this.moduleService.getAllModules();
  }

  @Post()
  @ApiResponse({ type: Module, status: HttpStatus.CREATED })
  @ApiOperation({
    operationId: 'createModule',
    summary: 'Создать новый модуль',
    description: 'Создает новый модуль для курса',
  })
  @Auth()
  async createModule(@Body() data: CreateModuleBody) {
    return this.moduleService.createModule(data);
  }

  @Get(':id')
  @ApiResponse({ type: Module })
  @ApiOperation({
    operationId: 'getModuleById',
    summary: 'Получить модуль по ID',
    description: 'Возвращает модуль со всеми его шагами',
  })
  @ApiParam({ name: 'id', type: String, description: 'ID модуля' })
  @Auth()
  async getModuleById(@Param('id') id: string) {
    return await this.moduleService.getModuleById(id);
  }

  @Put(':id')
  @ApiResponse({ type: Module })
  @ApiOperation({
    operationId: 'updateModule',
    summary: 'Обновить модуль',
    description: 'Обновляет информацию о модуле',
  })
  @ApiParam({ name: 'id', type: String, description: 'ID модуля' })
  @Auth()
  async putModule(
    @Param() params: UpdateModuleParams,
    @Body() data: UpdateModuleBody,
  ) {
    return await this.moduleService.updateModule(params, data);
  }
}
