import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateVisaTypeDto } from './create-visa-type.dto';
import { Status } from '@prisma/client';

export class UpdateVisaTypeDto extends PartialType(CreateVisaTypeDto) {
  @ApiProperty({ example: 'Active' })
  status: Status; // Assuming status is a string, adjust as necessary
}
