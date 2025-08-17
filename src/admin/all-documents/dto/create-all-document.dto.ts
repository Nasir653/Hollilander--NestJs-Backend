import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Status } from '@prisma/client';

export class CreateAllDocumentDto {
  @ApiProperty({ example: 'Passport Copy' })
  @IsString()
  @IsNotEmpty()
  documentName: string;

  @ApiPropertyOptional({ example: 'Scanned copy of passport' })
  @IsOptional()
  @IsString()
  documentDetails?: string;
}
