import { PrismaService } from 'src/prisma.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Status } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { FilterClientDto } from './dto/filter-client.dto';

@Injectable()
export class ClientRepository {
  constructor(private readonly prisma: PrismaService) {}

  async addClient(createClientDto: CreateClientDto) {
    const data: any = { ...createClientDto };
    return await this.prisma.facility.create({
      data: data,
    });
  }

  async findAllClient(page = 1, limit: number, filters: FilterClientDto = {}) {
    // Default limit
    limit = limit && limit > 0 ? limit : 10;
    const skip = (page - 1) * limit;

    // Base where condition
    const whereCondition: any = {
      deletedAt: null,
    };
    // Fields that should use 'contains' search (case-insensitive)
    const containsFields: (keyof FilterClientDto)[] = [
      'hospitalName',
      'alias',
      'contactNumber',
      'address',
      'city',
      'state',
      'country',
      'landmark',
    ];

    // Dynamically apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') return;
      if (key === 'page') return; // skip page

      if (containsFields.includes(key as keyof FilterClientDto)) {
        whereCondition[key] = {
          contains: value as string,
          mode: 'insensitive',
        };
      } else {
        // Direct match for any other types (if added later)
        whereCondition[key] = value;
      }
    });

    // Fetch data and count in parallel
    const [data, totalRecords] = await Promise.all([
      this.prisma.facility.findMany({
        where: whereCondition,
        skip,
        take: limit,
      }),
      this.prisma.facility.count({ where: whereCondition }),
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

  async findClientById(id: number) {
    return await this.prisma.facility.findFirst({
      where: {
        id: Number(id),
        deletedAt: null,
      },
    });
  }

  async updateClient(id: number, updateClientDto: UpdateClientDto) {
    const data: any = { ...updateClientDto };
    return await this.prisma.facility.update({
      where: { id: Number(id) },
      data: data,
    });
  }

  async softDeleteClient(id: number) {
    return await this.prisma.facility.update({
      where: { id: Number(id) },
      data: { deletedAt: new Date() },
    });
  }

  async deleteClient(id: number) {
    return await this.prisma.facility.delete({
      where: { id },
    });
  }

  async filterClients(filters: FilterClientDto) {
    // Start with default filter (soft delete check)
    const where: Record<string, any> = { deletedAt: null };

    // Loop through DTO keys dynamically
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        where[key] = {
          contains: value,
          mode: 'insensitive',
        };
      }
    });

    return this.prisma.facility.findMany({ where });
  }

  // async getClientJobs(id: number) {
  //   return await this.prisma.facility.findMany({
  //     where: {
  //       id: Number(id),
  //       deletedAt: null,
  //     },
  //     include: {
  //       jobs: true,
  //     },
  //   });
  // }
}
