import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
  IsDateString,
  IsInt,
  IsBoolean,
  MaxLength,
} from 'class-validator';
import { DocStatus, Status } from '.prisma/client';

export class UpdateStaffDto {
  @ApiPropertyOptional({ example: 'staff@example.com' })
  @IsOptional()
  @IsEmail()
  @MaxLength(150)
  email?: string;

  @ApiPropertyOptional({ example: 'John' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  firstName?: string;

  @ApiPropertyOptional({ example: 'Doe' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  lastName?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  roleId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(Status)
  status?: Status;

  @ApiPropertyOptional({ example: '9876543210' })
  @IsOptional()
  @IsString()
  @MaxLength(15)
  phoneNumber?: string;

  @ApiPropertyOptional({ example: '1995-06-15', description: 'Date of Birth in YYYY-MM-DD format' })
  @IsOptional()
  @IsDateString()
  dob?: Date;

  @ApiPropertyOptional({ example: 'India' })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({ example: 'Male' })
  @IsOptional()
  @IsString()
  gender?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isIreland?: boolean;

  @ApiPropertyOptional({ example: 'PPS1234567' })
  @IsOptional()
  @IsString()
  ppsNumber?: string;

  @ApiPropertyOptional({ example: 2 })
  @IsOptional()
  @IsInt()
  visaTypeId?: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isDrive?: boolean;

  @ApiPropertyOptional({ type: 'string', format: 'binary', description: 'Upload driving license file' })
  @IsOptional()
  driverLicenseUrl?: any;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  uniform?: boolean;

  @ApiPropertyOptional({ example: 'TypeA' })
  @IsOptional()
  @IsString()
  @MaxLength(6)
  uniformType?: string;
}
