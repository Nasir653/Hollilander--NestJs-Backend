import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsOptional, IsDateString, IsEnum } from 'class-validator';
import { DocStatus } from '.prisma/client';

export class CreateStaffDocumentUploadDto {
  @ApiProperty({ example: 's125848c' })
  @IsString()
  userId: string;

  @ApiProperty({ example: 123456 })
  @IsInt()
  docId: number;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  @IsOptional()
  file?: any; // <-- made optional here

  @ApiProperty({ example: '2022-01-01T00:00:00.000Z', required: false })
  @IsOptional()
  @IsDateString()
  docExpire?: string;

}
