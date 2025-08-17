import { ApiPropertyOptional } from '@nestjs/swagger';

export class FilterStaffTimeLogDto {
  @ApiPropertyOptional()
  jobId?: number;

  @ApiPropertyOptional()
  staffId?: string;

  @ApiPropertyOptional()
  checkIn?: Date;

  @ApiPropertyOptional()
  checkOut?: Date;

  @ApiPropertyOptional()
  break?: number;

  @ApiPropertyOptional()
  managerName?: string;

  @ApiPropertyOptional()
  managerEmail?: string;

  @ApiPropertyOptional()
  managerSignUrl?: string;

  @ApiPropertyOptional()
  status?: string;
}
