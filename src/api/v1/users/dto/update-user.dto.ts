import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, IsOptional, IsEnum } from 'class-validator';
import { Status } from '.prisma/client';

export class UpdateWorkAuthorisationDto {
  @ApiProperty({ example: 1 }) //1 for yes, 0 :no
  @IsString()
  isIreland?: string;

  @ApiProperty({ example: '1234567A' })
  @IsString()
  ppsNumber?: string;

  @ApiProperty({ example: 1 }) //1 for yes, 0 for no
  @IsString()
  isDrive?: string;

  @ApiProperty({ example: 'https://example.com/license.pdf' })
  @IsString()
  visaType?: string;

  @ApiProperty({ example: 'https://example.com/driver-license.pdf' })
  @IsString()
  driverLicenseUrl?: string;
}

export class UpdateUserDto extends UpdateWorkAuthorisationDto {
  @ApiProperty({ example: 'John' })
  @IsString()
  @MinLength(2)
  firstName?: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @MinLength(2)
  lastName?: string;

  @ApiProperty({ example: '1990-01-01' })
  @IsString()
  dob?: string;

  @ApiProperty({ example: '9876543210' })
  @IsString()
  countryCode?: string;

  @ApiProperty({ example: '+91' })
  @IsString()
  phoneNumber?: string;

  @IsString()
  otp?: number;

  @ApiProperty({ example: '123 Main St, City, Country' })
  @IsString()
  address?: string;

  @ApiProperty({ example: 'male' })
  @IsString()
  gender?: string;

  @IsOptional()
  status?: Status;
}
