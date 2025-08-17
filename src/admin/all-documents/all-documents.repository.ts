import { Injectable } from '@nestjs/common';
import { CreateAllDocumentDto } from './dto/create-all-document.dto';
import { UpdateAllDocumentDto } from './dto/update-all-document.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AllDocumentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createAllDocuments(createAllDocumentDto: CreateAllDocumentDto) {
    const data: any = { ...createAllDocumentDto };
    return await this.prisma.allDocuments.create({
      data: data,
    });
  }

  async findAllAllDocuments() {
    return await this.prisma.allDocuments.findMany({
      where: {
        deletedAt: null,
        status: 'ACTIVE',
      },
    });
  }

  async findAllOne(id: number) {
    return await this.prisma.allDocuments.findUnique({
      where: {
        id: Number(id),
        deletedAt: null,
      },
    });
  }

  async updateAllDocuments(
    id: number,
    updateAllDocumentDto: UpdateAllDocumentDto,
  ) {
    const data: any = { ...updateAllDocumentDto };
    return await this.prisma.allDocuments.update({
      where: { id: Number(id) },
      data: data,
    });
  }

  async softDeleteAllDocuments(id: number) {
    return await this.prisma.allDocuments.update({
      where: { id: Number(id) },
      data: { deletedAt: new Date() },
    });
  }

  async deleteAllDocuments(id: number) {
    return await this.prisma.allDocuments.delete({
      where: { id },
    });
  }
}
