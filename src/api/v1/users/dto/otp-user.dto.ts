import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class OtpBaseDto {
  @ApiProperty({ example: '123456' })
  @IsString()
  @MinLength(6)
  otp: string;
}

export class VerifyOtpDto extends OtpBaseDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;
}

export class ResendOtpDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;
}
