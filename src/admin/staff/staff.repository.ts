import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DocStatus, Status } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { CreateStaffDocumentDto, CreateStaffDto } from './dto/create-staff.dto';
import { FilterStaffDto } from './dto/filter-staff.dto';

@Injectable()
export class StaffRepository {
  constructor(private prisma: PrismaService) {}

  async addStaff(
    CreateStaffDto: CreateStaffDto & { drivingLicenseUrl?: string },
  ) {
    const data: any = { ...CreateStaffDto };
    return await this.prisma.user.create({
      data: data,
    });
  }

  async findAllStaff(page = 1, limit: number, filters: FilterStaffDto = {}) {
    limit = limit && limit > 0 ? limit : 10;
    const skip = (page - 1) * limit;

    // Base where condition
    const whereCondition: any = {
      deletedAt: null,
      role: { role: 'Staff' },
      status: filters.status? filters.status : 'ACTIVE',
    };

    // Fields that should use 'contains' search (case-insensitive)
    const containsFields: (keyof FilterStaffDto)[] = [
      'firstName',
      'lastName',
      'email',
      'phoneNumber',
      'country',
      'address',
    ];

    // Dynamically apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') return;
      if (key === 'page') return; // <-- make sure page is skipped

      if (containsFields.includes(key as keyof FilterStaffDto)) {
        whereCondition[key] = {
          contains: value as string,
          mode: 'insensitive',
        };
      } else {
        // Direct match for enums, booleans, dates, etc.
        whereCondition[key] = value;
      }
    });

    // Fetch data and count in parallel
    const [data, totalRecords] = await Promise.all([
      this.prisma.user.findMany({
        where: whereCondition,
        skip,
        take: limit,
      }),
      this.prisma.user.count({ where: whereCondition }),
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

  async findStaffById(id: string) {
    console.log(id);
    return await this.prisma.user.findFirst({
      where: {
        id,
        deletedAt: null,
        role: {
          role: 'Staff',
        },
      },
    });
  }

  async findStaffByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: {
        email,
        role: {
          role: 'Staff',
        },
      },
    });
  }

  async updateStaff(id: string, updateStaffDto: UpdateStaffDto) {
    const data: any = { ...updateStaffDto };

    if (data.dob && typeof data.dob === 'string') {
      data.dob = new Date(data.dob);
    }
    return await this.prisma.user.update({
      where: { id },
      data: data,
    });
  }

  async SoftDeleteStaff(id: string) {
    return await this.prisma.user.update({
      where: { id, status: Status.DISABLED },

      data: { deletedAt: new Date() },
    });
  }

  async deleteStaff(id: string) {
    return await this.prisma.user.delete({
      where: { id },
    });
  }

  async filterJobs(filters: FilterStaffDto) {
    // Start with default filter (soft delete check)
    const where: Record<string, any> = { deletedAt: null };

    // Loop through DTO keys dynamically
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        if (key === 'status') {
          // Enum or exact match
          where[key] = { equals: value };
        } else {
          // Default: partial match for strings
          where[key] = { contains: value, mode: 'insensitive' };
        }
      }
    });

    const staff = await this.prisma.user.findMany({ where });
    const safeStaff = staff.map(({ password, otp, ...rest }) => rest);
    return safeStaff;
  }

  async finddocumentById(id: number) {
    return await this.prisma.allDocuments.findUnique({
      where: {
        id: Number(id),
        deletedAt: null,
      },
    });
  }

  async addStaffDocument(CreateStaffDocumentDto: CreateStaffDocumentDto) {
    return await this.prisma.staffDocument.create({
      data: {
        userId: CreateStaffDocumentDto.userId,
        docId: CreateStaffDocumentDto.docId,
        docUrl: CreateStaffDocumentDto.docUrl ?? null,
        docExpire: CreateStaffDocumentDto.docExpire
          ? new Date(CreateStaffDocumentDto.docExpire)
          : null,
        docStatus: CreateStaffDocumentDto.docStatus
          ? CreateStaffDocumentDto.docStatus
          : 'PENDING',
      },
    });
  }

  async findVisaTypeById(id: number) {
    return await this.prisma.visaType.findUnique({
      where: {
        id: Number(id),
        deletedAt: null,
      },
    });
  }
}
