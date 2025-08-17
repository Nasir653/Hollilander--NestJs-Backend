
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateStaffTimeLogDto } from './dto/create-staff-time-log.dto';
import { UpdateStaffTimeLogDto } from './dto/update-staff-time-log.dto';
import { StaffTimeLogsRepository } from './staff-time-log.repository';
import { FilterStaffTimeLogDto } from './dto/filter-staff-time-logs.dto';

@Injectable()
export class StaffTimeLogsService {
  constructor(private readonly repo: StaffTimeLogsRepository) {}

  async create(createStaffTimeLogDto: CreateStaffTimeLogDto) {
    const staffTimeLogs = await this.repo.createTimeLogs(createStaffTimeLogDto);
    if (!staffTimeLogs) throw new ConflictException('Staff time log creation failed');
    return {
      Message: 'Staff time log created successfully',
      data: staffTimeLogs,
    };
  }

  async findAll({ page = 1, limit = 10 }: { page?: number; limit?: number }) {
    if (page < 1 || limit < 1) {
      throw new ConflictException('Page and limit must be greater than 0');
    }
    const timeLogs = await this.repo.findAllTimeLogs(page, limit);
    if (!timeLogs ) {
      throw new NotFoundException('Staff time log list not found');
    }
    return {
      Message: 'Staff time log list fetched successfully',
      data: timeLogs,
    };
   
  }

  // async findOne(id: number) {
  //   return this.repo.findOne(id);
  // }

  async update(id: number, updateStaffTimeLogDto: UpdateStaffTimeLogDto) {

    const updateStaffTimeLog = await this.repo.updateTimeLogs(id, updateStaffTimeLogDto);
    if (!updateStaffTimeLog) throw new NotFoundException('Staff time log not found');
    return {
      Message: 'Staff time log updated successfully',
      data: updateStaffTimeLog,
    };
  }

  async remove(id: number) {
    const timeLog = await this.repo.removeTimeLogs(id);
    if (!timeLog) throw new NotFoundException('Staff time log not found');
    return {
      Message: 'Staff time log deleted successfully',
    };

  }

  async filter(filterDto: FilterStaffTimeLogDto) {
    const filteredStaffTimeLogs = await this.repo.filterTimeLogs(filterDto);
    if (!filteredStaffTimeLogs) throw new NotFoundException('Staff time log filtering failed');
    return {
      Message: 'Staff time log filtering successful',
      data: filteredStaffTimeLogs,
    };
  }
}
