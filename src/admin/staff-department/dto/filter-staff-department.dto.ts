import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class FilterStaffDepartmentDto {
  @ApiPropertyOptional()
  @IsString()
  departmentName?: string;

  @ApiPropertyOptional()
  @IsString()
  status?: string;

  deletedAt?: Date;

  createdAt?: Date;
}
