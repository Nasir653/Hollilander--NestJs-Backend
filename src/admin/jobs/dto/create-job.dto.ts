import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsInt,
  IsDateString,
} from 'class-validator';
import { StaffRequestStatus, Status } from '@prisma/client'; // Assuming Status is an enum from Prisma

export class CreateJobDto {
  @ApiProperty({ example: 1, description: 'Facility ID' })
  @IsInt()
  facilityId: number;

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
}

export class CreateStaffJobRequestDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  jobId: number;

  @ApiProperty()
  @IsString()
  staffId: string;

  @ApiProperty()
  @IsString()
  acceptRejectId: string;

  @ApiProperty({
    enum: StaffRequestStatus,
    description: 'Status of the staff request',
  })
  @IsOptional()
  @IsEnum(StaffRequestStatus)
  status?: StaffRequestStatus;
}

export class verifyStaffJobRequestDto {
  @ApiProperty({
    enum: StaffRequestStatus,
    description: 'Status of the staff request',
  })
  @IsOptional()
  @IsEnum(StaffRequestStatus)
  status?: StaffRequestStatus;
}
