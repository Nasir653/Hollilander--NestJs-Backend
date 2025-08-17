import { PrismaService } from 'src/prisma.service';
import {
  CreateJobDto,
  CreateStaffJobRequestDto,
  verifyStaffJobRequestDto,
} from './dto/create-job.dto';
import { Injectable } from '@nestjs/common';
import { FilterJobDto } from './dto/filter-job.dto';
import { FilterClientDto } from '../client/dto/filter-client.dto';
import { stat } from 'fs';

@Injectable()
export class JobRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createJob(createJobDto: CreateJobDto) {
    const data: any = { ...createJobDto };

    if (data.startDate && typeof data.startDate === 'string') {
      data.startDate = new Date(data.startDate);
    }
    if (data.endDate && typeof data.endDate === 'string') {
      data.endDate = new Date(data.endDate);
    }

    data.status = 'ACTIVE'; // Default status for new jobs
    return await this.prisma.jobs.create({
      data: data,
    });
  }


  async findAllJobs(page = 1, limit: number, filters: FilterJobDto = {}) {
    limit = limit && limit > 0 ? limit : 10;
    const skip = (page - 1) * limit;

    // Base where condition
    const whereCondition: any = {
      deletedAt: null,
      status: filters.status ? filters.status : 'ACTIVE',
    };

    // Fields that should use 'contains' search (case-insensitive)
    const containsFields: (keyof FilterJobDto)[] = [
      'jobTitle',
      'jobDescription',
      'shiftType',
      'workerType',
      'speciality',
    ];

    // Dynamically apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') return;
      if (key === 'page') return; // skip page param

      if (containsFields.includes(key as keyof FilterJobDto)) {
        whereCondition[key] = {
          contains: value as string,
          mode: 'insensitive',
        };
      } else {
        // Direct match for enums, dates, etc.
        whereCondition[key] = value;
      }
    });

    // Fetch data and count in parallel
    const [data, totalRecords] = await Promise.all([
      this.prisma.jobs.findMany({
        where: whereCondition,
        skip,
        take: limit,
        orderBy: { id: 'asc' }, // optional: keep ordering consistent
      }),
      this.prisma.jobs.count({ where: whereCondition }),
    ]);

    const totalPages = Math.ceil(totalRecords / limit);

    
    return {
      data,
      totalRecords,
      totalPages,
      currentPage: page,
      limit,
    };
  }

  async findJobById(id: number) {
    return await this.prisma.jobs.findUnique({
      where: {
        id: Number(id),
        deletedAt: null,
      },
    });
  }

  async updateStaff(id: number, job: any) {
    const data: any = { ...job };

    if (data.startDate && typeof data.startDate === 'string') {
      data.startDate = new Date(data.startDate);
    }
    if (data.endDate && typeof data.endDate === 'string') {
      data.endDate = new Date(data.endDate);
    }
    return await this.prisma.jobs.update({
      where: {
        id: Number(id),
      },
      data: data,
    });
  }

  async softDeleteStaff(id: number) {
    return await this.prisma.jobs.update({
      where: {
        id: Number(id),
        status: 'DISABLED',
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  async removeStaff(id: number) {
    return await this.prisma.jobs.delete({
      where: {
        id: id,
      },
    });
  }

  async getStaffcount() {
    return await this.prisma.jobs.count({
      where: {
        deletedAt: null,
      },
    });
  }

  async filterJobs(filters: FilterJobDto) {
    const where: Record<string, any> = { deletedAt: null };

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (key === 'status') {
          where[key] = { equals: value };
        } else if (key === 'jobId') {
          where.id = { equals: Number(value) }; // Jobs table uses 'id', not jobId
        } else if (key === 'startDate' || key === 'endDate') {
          const dateValue = new Date(value);
          if (!isNaN(dateValue.getTime())) {
            where[key] = {
              gte: new Date(dateValue.setHours(0, 0, 0, 0)),
              lte: new Date(dateValue.setHours(23, 59, 59, 999)),
            };
          }
        } else {
          where[key] = { contains: String(value), mode: 'insensitive' };
        }
      }
    });

    return this.prisma.jobs.findMany({ where }); // ✅ now we're filtering Jobs
  }

  async findAllStaffJobRequest(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.staffRequest.findMany({
        where: {
          deletedAt: null,
          // Assuming you want to filter out deleted requests
        },
        skip,
        take: limit,
      }),
      this.prisma.staffRequest.count({
        where: {
          deletedAt: null,
        },
      }),
    ]);

    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  async VerifyStaffJobRequest(
    id: number,
    verifyStaffJobRequestDto: verifyStaffJobRequestDto,
  ) {
    const data: any = { ...verifyStaffJobRequestDto };
    return await this.prisma.staffRequest.update({
      where: { id: Number(id) },
      data: data,
    });
  }
}
