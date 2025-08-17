
import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsDateString, IsObject, IsBoolean, IsOptional, IsIn } from "class-validator";

export class DayAvailability {
  @ApiProperty({ example: true, description: "Whether the staff is available on this day" })
  @IsBoolean()
  isAvailable: boolean;

  @ApiProperty({
    example: "Day",
    description: "Shift type: 'Day' or 'Night'. Required if isAvailable = true",
    nullable: true
  })
  @IsOptional()
  @IsIn(["Day", "Night", null], { message: "Shift must be either 'Day', 'Night', or null" })
  shift: string | null;
}

export class CreateStaffAvailabilityDto {
  @ApiProperty({ example: "123", description: "Staff member's ID" })
  @IsString()
  staffId: string;

  @ApiProperty({ example: "2025-07-07T00:00:00.000Z" })
  @IsDateString()
  startWeekDate: Date;

  @ApiProperty({ example: "2025-07-13T00:00:00.000Z" })
  @IsDateString()
  endWeekDate: Date;

  @ApiProperty({
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
  daysAvailability: Record<string, DayAvailability>;
}
