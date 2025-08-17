import { PrismaService } from 'src/prisma.service';
import { CreateVisaTypeDto } from './dto/create-visa-type.dto';
import { UpdateVisaTypeDto } from './dto/update-visa-type.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class VisaTypeRepository {
  constructor(private prisma: PrismaService) {}

  async createVisa(createVisaTypeDto: CreateVisaTypeDto) {
    const data: any = { ...createVisaTypeDto };
    return await this.prisma.visaType.create({
      data: data,
    });
  }

  async findAllVisaType() {
    return await this.prisma.visaType.findMany({
      where: {
        deletedAt: null,
        status: 'ACTIVE', // Assuming 'ACTIVE' is a valid status
      },
    });
  }

  async findOneVisaType(id: number) {
    return await this.prisma.visaType.findUnique({
      where: {
        id: Number(id),
        deletedAt: null,
      },
    });
  }

  async updateVisaType(id: number, updateVisaTypeDto: UpdateVisaTypeDto) {
    const data: any = { ...updateVisaTypeDto };
    return await this.prisma.visaType.update({
      where: { id: Number(id) },
      data: data,
    });
  }

  async SoftDeleteVisaType(id: number) {
    return await this.prisma.visaType.update({
      where: { id: Number(id) },
      data: { deletedAt: new Date() },
    });
  }

  async removeVisaType(id: number) {
    return await this.prisma.visaType.delete({
      where: { id: id },
    });
  }

  // async filterVisaType(filters: FilterVisaTypeDto) {
  //   // Start with default filter (soft delete check)
  //   const where: Record<string, any> = { deletedAt: null };

  //   // Loop through DTO keys dynamically
  //   Object.entries(filters).forEach(([key, value]) => {
  //     if (value) {
  //       if (key === 'status') {
  //         // Enum or exact match
  //         where[key] = { equals: value };
  //       } else {
  //         // Default: partial match for strings
  //         where[key] = { contains: value, mode: 'insensitive' };
  //       }
  //     }
  //   });

  //   return this.prisma.visaType.findMany({ where });
  // }
}
