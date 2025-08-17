import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AllDocumentsService } from './all-documents.service';
import { CreateAllDocumentDto } from './dto/create-all-document.dto';
import { UpdateAllDocumentDto } from './dto/update-all-document.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('admin/documents')
export class AllDocumentsController {
  constructor(private readonly allDocumentsService: AllDocumentsService) {}

  @Post('add')
  async addDocuments(@Body() createAllDocumentDto: CreateAllDocumentDto) {
    try {
      return await this.allDocumentsService.create(createAllDocumentDto);
    } catch (error) {
      return {
        message: 'All documents creation failed',
        error: error,
      };
    }
  }

  @Get('list')
  async getAllDocuments() {
    try {
      return await this.allDocumentsService.findAll();
    } catch (error) {
      return {
        message: 'All documents list fetching failed',
        error: error,
      };
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    try {
      return await this.allDocumentsService.findOne(id);
    } catch (error) {}
  }

  @Patch('update/:id')
  async updateAllDocuments(
    @Param('id') id: number,
    @Body() updateAllDocumentDto: UpdateAllDocumentDto,
  ) {
    try {
      return await this.allDocumentsService.update(id, updateAllDocumentDto);
    } catch (error) {
      return {
        message: 'All documents update failed',
        error: error,
      };
    }
  }

  @Delete('delete/:id')
  async removeAllDocuments(@Param('id') id: number) {
    try {
      return await this.allDocumentsService.remove(id);
    } catch (error) {
      return {
        message: 'All documents delete failed',
        error: error,
      };
    }
  }
}
