import { Injectable } from '@nestjs/common';
import { CreateStaffAvailabilityDto } from './dto/create-staff-availability.dto';
import { UpdateStaffAvailabilityDto } from './dto/update-staff-availability.dto';
import { StaffAvailabilityRepository } from './staff-availability.repository';

@Injectable()
export class StaffAvailabilityService {
  constructor(
    private staffAvailabilityRepository: StaffAvailabilityRepository,
  ) {}
  async create(createStaffAvailabilityDto: CreateStaffAvailabilityDto) {
    // Call repo function
    return await this.staffAvailabilityRepository.createStaffAvailability(
      createStaffAvailabilityDto,
    );
  }

  async findAll() {
    const orderedDays = [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ];

    const records = await this.staffAvailabilityRepository.findAll();

    return records.map((record) => {
      const days = record.daysAvailability ?? {}; // fallback to empty object

      return {
        ...record,
        daysAvailability: Object.fromEntries(
          orderedDays.map((day) => [
            day,
            days[day] ?? { isAvailable: false, shift: null },
          ]),
        ),
      };
    });
  }

  async findOne(id: number) {
    return this.staffAvailabilityRepository.findOne(id);
  }

  async update(
    id: number,
    updateStaffAvailabilityDto: UpdateStaffAvailabilityDto,
  ) {
    return this.staffAvailabilityRepository.update(
      id,
      updateStaffAvailabilityDto,
    );
  }

  async remove(id: number) {
    return this.staffAvailabilityRepository.remove(id);
  }
}
