import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  MinLength,
  IsBoolean,
  IsNumber,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { Status } from '.prisma/client';

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  password: string;

  //@ApiProperty({ example: 123456 })
  @IsNumber()
  @MinLength(6)
  otp: number;

  //@ApiProperty({ example: 'ACTIVE' })
  @IsEnum(Status)
  status: Status;

  //@ApiProperty({ example: '1', description: 'Role ID for the user', required: false })
  @IsNumber()
  roleId?: Number;
}
