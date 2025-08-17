import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateStaffAvailabilityDto } from './dto/create-staff-availability.dto';
import { UpdateStaffAvailabilityDto } from './dto/update-staff-availability.dto';

@Injectable()
export class StaffAvailabilityRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createStaffAvailability(
    createStaffAvailabilityDto: CreateStaffAvailabilityDto,
  ) {
    const cleanedDaysAvailability: Record<string, any> = {};

    for (const [day, value] of Object.entries(
      createStaffAvailabilityDto.daysAvailability,
    )) {
      if (!value.isAvailable) {
        cleanedDaysAvailability[day] = { isAvailable: false, shift: null };
      } else {
        if (!value.shift) {
          throw new Error(
            `Shift is required for ${day} when available is true`,
          );
        }
        cleanedDaysAvailability[day] = {
          isAvailable: true,
          shift: value.shift,
        };
      }
    }

    return await this.prisma.staffAvailability.create({
      data: {
        staffId: createStaffAvailabilityDto.staffId,
        startWeekDate: createStaffAvailabilityDto.startWeekDate,
        endWeekDate: createStaffAvailabilityDto.endWeekDate,
        daysAvailability: cleanedDaysAvailability,
      },
    });
  }

  async findAll() {
    return await this.prisma.staffAvailability.findMany({
      where: {
        deletedAt: null,
      },
    });
  }

  async findOne(id: number) {
    return await this.prisma.staffAvailability.findUnique({
      where: {
        id: Number(id),
        deletedAt: null,
      },
    });
  }

  async update(
    id: number,
    updateStaffAvailabilityDto: UpdateStaffAvailabilityDto,
  ) {
    const cleanedDaysAvailability: Record<string, any> = {};


    if (updateStaffAvailabilityDto.daysAvailability) {
      for (const [day, value] of Object.entries(
        updateStaffAvailabilityDto.daysAvailability,
      )) {
        if (!value.isAvailable) {
          cleanedDaysAvailability[day] = { isAvailable: false, shift: null };
        } else {
          if (!value.shift) {
            throw new Error(
              `Shift is required for ${day} when available is true`,
            );
          }
          cleanedDaysAvailability[day] = {
            isAvailable: true,
            shift: value.shift,
          };
        }
      }
    }

    return await this.prisma.staffAvailability.update({
      where: { id: Number(id) },
      data: {
        startWeekDate: updateStaffAvailabilityDto.startWeekDate,
        endWeekDate: updateStaffAvailabilityDto.endWeekDate,
        daysAvailability: cleanedDaysAvailability,
      },
    });
  }

  async remove(id: number) {
    return await this.prisma.staffAvailability.delete({
      where: { id: id },
    });
  }
}
