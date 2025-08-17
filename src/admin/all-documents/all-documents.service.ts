import { ConflictException, Injectable } from '@nestjs/common';
import { CreateAllDocumentDto } from './dto/create-all-document.dto';
import { UpdateAllDocumentDto } from './dto/update-all-document.dto';
import { AllDocumentsRepository } from './all-documents.repository';

@Injectable()
export class AllDocumentsService {
  constructor(
    private readonly allDocumentsRepository: AllDocumentsRepository,
  ) {}

  async create(createAllDocumentDto: CreateAllDocumentDto) {
    const document =
      await this.allDocumentsRepository.createAllDocuments(
        createAllDocumentDto,
      );
    if (!document) throw new ConflictException('Document creation failed');
    return {
      message: 'All documents created successfully',
      data: document,
    };
  }

  async findAll() {
    const findallDocuments =
      await this.allDocumentsRepository.findAllAllDocuments();
    if (!findallDocuments)
      throw new ConflictException('ALL Documents list fetching failed');
    return {
      message: 'All documents list fetched successfully',
      data: findallDocuments,
    };
  }

  async findOne(id: number) {
    const document = await this.allDocumentsRepository.findAllOne(id);
    if (!document) throw new ConflictException('Document not found');
    return {
      message: 'All documents fetched successfully',
      data: document,
    };
  }

  async update(id: number, updateAllDocumentDto: UpdateAllDocumentDto) {
    const updatedDocument =
      await this.allDocumentsRepository.updateAllDocuments(
        id,
        updateAllDocumentDto,
      );
    if (!updatedDocument) throw new ConflictException('Document update failed');
    return {
      message: 'Document updated successfully',
      data: updatedDocument,
    };
  }

  async remove(id: number) {
    const deletedDocument =
      await this.allDocumentsRepository.softDeleteAllDocuments(id);
    if (!deletedDocument) throw new ConflictException('Document delete failed');
    return {
      message: 'Document deleted successfully',
    };
  }
}
