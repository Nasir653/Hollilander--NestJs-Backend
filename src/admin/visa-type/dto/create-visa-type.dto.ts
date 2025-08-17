import { ApiProperty } from '@nestjs/swagger';

export class CreateVisaTypeDto {
  @ApiProperty({ example: 'Visa Type' })
  name: string;
}
