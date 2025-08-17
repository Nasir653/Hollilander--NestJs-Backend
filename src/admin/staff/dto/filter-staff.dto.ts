import { ApiPropertyOptional } from '@nestjs/swagger';
import { Status } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class FilterStaffDto {
  @ApiPropertyOptional({required: false})
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(Status)
  status?: Status;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  isIreland?: boolean;

  @IsOptional()
  isDrive?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  ppsNumber?: string;

  @ApiPropertyOptional()
  @IsOptional()
  address?: string;

  @IsOptional()
  country?: string;

  @IsOptional()
  gender?: string;

  @IsOptional()
  deletedAt?: Date;

  @IsOptional()
  createdAt?: Date;
}
