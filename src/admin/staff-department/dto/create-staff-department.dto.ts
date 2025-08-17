import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateStaffDepartmentDto {
  @ApiProperty({ example: 'Staff Department' })
  @IsString()
  departmentName: string;

}
