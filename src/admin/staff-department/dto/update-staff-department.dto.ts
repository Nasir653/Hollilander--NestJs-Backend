import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateStaffDepartmentDto } from './create-staff-department.dto';
import { Status } from '@prisma/client';

export class UpdateStaffDepartmentDto extends PartialType(CreateStaffDepartmentDto) {

    @ApiPropertyOptional({ example: 'ACTIVE' })
    status?: Status;    
   
}