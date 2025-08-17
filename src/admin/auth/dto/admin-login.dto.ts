import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class AdminLoginDto {
  @ApiProperty({ example: 'admin@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'admin@123' })
  @IsString()
  @MinLength(6)
  password: string;
}

export class AdminForgotPasswordDto {
  @ApiProperty({ example: 'admin@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'admin@123' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'admin@123' })
  @IsString()
  @MinLength(6)
  rePassword: string;
}
