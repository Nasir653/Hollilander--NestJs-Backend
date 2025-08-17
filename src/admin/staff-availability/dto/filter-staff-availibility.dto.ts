import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsDateString, IsOptional, IsString } from "class-validator";
import { DayAvailability } from "./create-staff-availability.dto";

export class FilterStaffAvailabilityDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  staffId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  startWeekDate?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  endWeekDate?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  daysAvailability?: Record<string, DayAvailability>;
}   