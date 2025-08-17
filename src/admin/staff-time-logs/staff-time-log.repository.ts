import { PrismaService } from 'src/prisma.service';
import { CreateStaffTimeLogDto } from './dto/create-staff-time-log.dto';
import { Injectable } from '@nestjs/common';
import { FilterStaffTimeLogDto } from './dto/filter-staff-time-logs.dto';

@Injectable()
export class StaffTimeLogsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createTimeLogs(createStaffTimeLogDto: CreateStaffTimeLogDto) {
    const {
      jobId,
      staffId,
      checkIn,
      checkOut,
      break: breakTime,
      managerName,
      managerEmail,
      managerSignUrl,
      status,
    } = createStaffTimeLogDto;

    if (
      jobId === undefined ||
      !staffId ||
      !checkIn ||
      !checkOut ||
      breakTime === undefined ||
      !managerName ||
      !managerEmail ||
      !managerSignUrl ||
      !status
    ) {
      throw new Error('Missing required fields for StaffTimeLogs creation');
    }

    const data = {
      jobId,
      staffId,
      checkIn,
      checkOut,
      break: breakTime,
      managerName,
      managerEmail,
      managerSignUrl,
      status,
    };

    return this.prisma.staffTimeLogs.create({ data });
  }

  async findAllTimeLogs(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.staffTimeLogs.findMany({
        where: { deletedAt: null },
        skip,
        take: limit,
      }),
      this.prisma.staffTimeLogs.count({
        where: { deletedAt: null },
      }),
    ]);
    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  // async findOne(id: number) {
  //   return this.prisma.staffTimeLogs.findOne({ where: { id } });
  // }

  async updateTimeLogs(
    id: number,
    updateStaffTimeLogDto: CreateStaffTimeLogDto,
  ) {
    const data = {
      ...updateStaffTimeLogDto,
    };
    return this.prisma.staffTimeLogs.update({
      where: { id: Number(id) },
      data: data,
    });
  }

  async softDeleteTimeLogs(id: number) {
    return this.prisma.staffTimeLogs.update({
      where: { id: Number(id), status: 'DELETED' },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  async removeTimeLogs(id: number) {
    return this.prisma.staffTimeLogs.delete({ where: { id } });
  }

  async filterTimeLogs(filters: FilterStaffTimeLogDto) {
   

    const where: Record<string, any> = { deletedAt: null };

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (key === 'status') {
          // Enum exact match
          where[key] = { equals: value };
        } else if (key === 'jobId') {
          // Number exact match
          where[key] = { equals: Number(value) };
        } else if (key === 'checkIn' || key === 'checkOut') {
          // Date match - parse string to Date
          const dateValue = new Date(value);
          if (!isNaN(dateValue.getTime())) {
            where[key] = {
              gte: new Date(dateValue.setHours(0, 0, 0, 0)),
              lte: new Date(dateValue.setHours(23, 59, 59, 999)),
            };
          }
        } else {
          // String partial match
          where[key] = { contains: String(value), mode: 'insensitive' };
        }
      }
    });

    return this.prisma.staffTimeLogs.findMany({ where });
  }
}
