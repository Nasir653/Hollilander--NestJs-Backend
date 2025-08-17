import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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

export class CreateStaffDto {
 @ApiProperty({ example: 'staff@example.com' })
  @IsEmail()
  @MaxLength(150)
  email: string;

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


  @IsInt()
  roleId: number;

  @IsEnum(Status)
  status: Status;


  @ApiPropertyOptional({ example: '9876543210' })
  @IsOptional()
  @IsString()
  @MaxLength(15)
  phoneNumber?: string;

 
  @IsOptional()
  @IsString()
  password?: string;

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

export class CreateStaffDocumentDto {
  @ApiProperty({ example: 's125848c' })
  @IsString()
  userId: string

  @ApiProperty({ example: 123456 })
  @IsInt()
  docId: number; 

  @ApiProperty({ example: 'https://www.example.com/document.pdf' })
  @IsOptional()
  @IsString()
  docUrl?: string; 

  @ApiProperty({ example: '2022-01-01T00:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  docExpire?: string; 

  @IsOptional()
  @IsEnum(DocStatus)
  docStatus?: DocStatus; 
}
