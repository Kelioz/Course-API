import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';

export class Course {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsUUID()
  id!: string;
  @ApiProperty()
  createdAt!: string;
  @ApiProperty()
  updatedAt!: string;
  @ApiProperty()
  title!: string;
  @ApiProperty()
  @IsOptional()
  description!: string;
  @ApiProperty()
  @IsOptional()
  @IsUUID()
  user!: string;
}
