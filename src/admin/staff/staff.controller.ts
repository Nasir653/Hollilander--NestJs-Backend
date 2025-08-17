import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';

import { StaffService } from './staff.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import { CreateStaffDocumentUploadDto } from './dto/create-staff-document-upload.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { FilterStaffDto } from './dto/filter-staff.dto';

import { FastifyRequest } from 'fastify';
import { parseMultipartRequest } from 'src/common/utils/file-upload.util';

@Controller('admin/staff')
@ApiBearerAuth()
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Post('add')
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateStaffDto })
  async addStaff(@Req() req: FastifyRequest) {
    return await this.staffService.create(req);
  }

  @Get('list')
  async getStaffList(
    @Query('page') page: number = 1,
    @Query() filters: FilterStaffDto, // <- all DTO properties will appear
  ) {
    try {
      return this.staffService.findAll({ page: Number(page), filters });
    } catch (error) {
      
      return {
        message: 'Staff list fetching failed',
        error: error,
      };
    }
    
  }

  @Get(':id')
  async searchStaff(@Param('id') id: string) {
    try {
      return await this.staffService.findOne(id);
    } catch (error) {
      return {
        message: 'Staff fetching failed',
        error: error,
      };
    }
  }

  @Patch('update/:id')
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateStaffDto })
  async updateStaff(@Param('id') id: string, @Req() req: FastifyRequest) {
    try {
      return await this.staffService.update(id, req);
    } catch (error) {
      return {
        message: 'Staff update failed',
        error,
      };
    }
  }

  @Delete('delete/:id')
  async removeStaff(@Param('id') id: string) {
    try {
      return await this.staffService.remove(id);
    } catch (error) {
      return {
        message: 'Staff delete failed',
        error: error,
      };
    }
  }

  @Get('filter')
  async filterJobs(@Query() filterDto: FilterStaffDto) {
    try {
      return await this.staffService.filter(filterDto);
    } catch (error) {
      return {
        message: 'Job filtering failed',
        error: error.message || error,
      };
    }
  }

  @Post('document/upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateStaffDocumentUploadDto })
  async documentUpload(@Req() req: FastifyRequest) {
    try {
      return await this.staffService.handleDocumentUpload(req);
    } catch (error) {
      return {
        message: 'Document upload failed',
        error: error,
      };
    }
  }
}
