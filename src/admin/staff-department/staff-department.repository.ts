import { PrismaService } from 'src/prisma.service';
import { CreateStaffDepartmentDto } from './dto/create-staff-department.dto';
import { UpdateStaffDepartmentDto } from './dto/update-staff-department.dto';
import { FilterStaffDepartmentDto } from './dto/filter-staff-department.dto';
import { Injectable } from '@nestjs/common';
import { Status } from '@prisma/client';

@Injectable()
export class staffDepartmentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(createstaffDepartmentDto: CreateStaffDepartmentDto) {
    const data: any = { ...createstaffDepartmentDto };
    data.status = Status.ACTIVE; // Default status for new departments
    return await this.prisma.staffDepartment.create({
      data: data,
    });
  }

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.staffDepartment.findMany({
        where: {
          deletedAt: null,
          status: Status.ACTIVE, // Assuming you want to filter out deleted departments
        },
        skip,
        take: limit,
      }),
      this.prisma.staffDepartment.count({
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

  async findOne(id: number) {
    return await this.prisma.staffDepartment.findUnique({
      where: {
        id: Number(id),
        deletedAt: null,
      },
    });
  }

  async update(id: number, updatestaffDepartmentDto: UpdateStaffDepartmentDto) {
    const data: any = { ...updatestaffDepartmentDto };
    return await this.prisma.staffDepartment.update({
      where: {
        id: Number(id),
      },
      data: data,
    });
  }

  async SoftDelete(id: number) {
    return await this.prisma.staffDepartment.update({
      where: {
        id: Number(id), status: Status.DISABLED,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  async remove(id: number) {
    return await this.prisma.staffDepartment.delete({
      where: {
        id: id,
      },
    });
  }

  async filterStaff(filters: FilterStaffDepartmentDto) {
    const where: Record<string, any> = { deletedAt: null };

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

    return this.prisma.staffDepartment.findMany({ where });
  }
}
