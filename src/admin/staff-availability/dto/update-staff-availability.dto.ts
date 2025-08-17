import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, IsDateString, IsObject, IsBoolean, IsOptional, IsIn } from "class-validator";

export class DayAvailability {
  @ApiPropertyOptional({ example: true, description: "Whether the staff is available on this day" })
  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;

  @ApiPropertyOptional({
    example: "Day",
    description: "Shift type: 'Day' or 'Night'. Required if isAvailable = true",
    nullable: true
  })
  @IsOptional()
  @IsIn(["Day", "Night", null], { message: "Shift must be either 'Day', 'Night', or null" })
  shift?: string | null;
}

export class UpdateStaffAvailabilityDto {

  @ApiPropertyOptional({ example: "2025-07-07T00:00:00.000Z" })
  @IsDateString()
  @IsOptional()
  startWeekDate?: Date;

  @ApiPropertyOptional({ example: "2025-07-13T00:00:00.000Z" })
  @IsDateString()
  @IsOptional()
  endWeekDate?: Date;

  @ApiPropertyOptional({
    description: "Availability for each day of the week",
    example: {
      Monday: { isAvailable: true, shift: "Night" },
      Tuesday: { isAvailable: true, shift: "Day" },
      Wednesday: { isAvailable: true, shift: "Day" },
      Thursday: { isAvailable: true, shift: "Night" },
      Friday: { isAvailable: true, shift: "Night" },
      Saturday: { isAvailable: false, shift: null },
      Sunday: { isAvailable: false, shift: null }
    }
  })
  @IsObject()
  @IsOptional()
  daysAvailability?: Record<string, DayAvailability>;
}
