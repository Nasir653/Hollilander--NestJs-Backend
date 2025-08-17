import { ApiProperty } from '@nestjs/swagger';
import { TimeLogsStatus } from '@prisma/client';
import { IsDate, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateStaffTimeLogDto {
  @ApiProperty()
 
  jobId?: number;

  @ApiProperty()
  @IsString()
  staffId?: string;

  @ApiProperty()
  @IsDate()
  checkIn?: Date;

  @ApiProperty()
  @IsDate()
  checkOut?: Date;

  @ApiProperty()
  @IsNumber()
  break?: number;

  @ApiProperty()
  @IsString()
  managerName?: string;

  @ApiProperty()
  @IsString()
  managerEmail?: string;

  @ApiProperty()
  @IsString()
  managerSignUrl?: string;

  @ApiProperty()
  @IsEnum(TimeLogsStatus)
  status?: TimeLogsStatus;
}
