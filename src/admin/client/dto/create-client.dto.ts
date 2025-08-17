import { ApiProperty } from '@nestjs/swagger';
import { Status } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateClientDto {
  @ApiProperty({ example: 'Noora hospital' })
  @IsString()
  hospitalName: string;

  @ApiProperty({ example: 'Noora' })
  @IsString()
  alias: string;

  @ApiProperty({ example: 123456 })
  @IsString()
  contactNumber: string;

  @ApiProperty({ example: 'New Delhi' })
  @IsString()
  address: String;

  @ApiProperty({ example: 'Noida' })
  @IsString()
  city: string;

  @ApiProperty({ example: 'Delhi' })
  @IsString()
  state: string;

  @ApiProperty({ example: 'India' })
  @IsString()
  country: string;

  @ApiProperty({ example: 'Near Bank' })
  @IsString()
  landmark: string;
}
