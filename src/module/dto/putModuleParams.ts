import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateModuleParams {
  @ApiProperty({ example: '01ARZ3NDEKTSV4RRFFQ69G5FAV' })
  @IsString()
  id!: string;
}
