import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateJobDto } from './create-job.dto';
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { Status } from '@prisma/client';

export class UpdateJobDto {
  @ApiPropertyOptional({ example: 'Nurse', description: 'Job title' })
  @IsOptional()
  @IsString()
  jobTitle?: string;

  @ApiPropertyOptional({
    example: 'Responsible for patient care',
    description: 'Job description',
  })
  @IsOptional()
  @IsString()
  jobDescription?: string;

  @ApiPropertyOptional({
    example: '2025-08-10T08:00:00Z',
    description: 'Start date of the job',
  })
  @IsOptional()
  @IsDateString()
  startDate?: Date;

  @ApiPropertyOptional({
    example: '2025-08-15T17:00:00Z',
    description: 'End date of the job',
  })
  @IsOptional()
  @IsDateString()
  endDate?: Date;

  @ApiPropertyOptional({ example: 'Day', description: 'Shift type' })
  @IsOptional()
  @IsString()
  shiftType?: string;

  @ApiPropertyOptional({ example: 'Full-time', description: 'Worker type' })
  @IsOptional()
  @IsString()
  workerType?: string;

  @ApiPropertyOptional({ example: 'Cardiology', description: 'Speciality' })
  @IsOptional()
  @IsString()
  speciality?: string;

  @ApiProperty({ enum: Status, description: 'Status of the job' })
  @IsEnum(Status)
  status: Status;
}
