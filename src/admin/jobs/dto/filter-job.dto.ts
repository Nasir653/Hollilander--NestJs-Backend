import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Status } from '@prisma/client';
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';

export class FilterJobDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  jobTitle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  jobDescription?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  startDate?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  endDate?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  shiftType?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  workerType?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  speciality?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(Status)
  status?: Status;
}
