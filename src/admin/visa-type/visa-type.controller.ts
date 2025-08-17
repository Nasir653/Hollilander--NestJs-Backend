import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { VisaTypeService } from './visa-type.service';
import { CreateVisaTypeDto } from './dto/create-visa-type.dto';
import { UpdateVisaTypeDto } from './dto/update-visa-type.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('admin/visa-type')
export class VisaTypeController {
  constructor(private readonly visaTypeService: VisaTypeService) {}

  @Post('add')
  createVisaType(@Body() createVisaTypeDto: CreateVisaTypeDto) {
    try {
      return this.visaTypeService.create(createVisaTypeDto);
    } catch (error) {
      return {
        message: 'Visa type creation failed',
        error: error,
      };
    }
  }

  @Get('list')
  getVisaTypeList() {
    try {
      return this.visaTypeService.findAll();
    } catch (error) {}
  }

  @Get(':id')
  searchVisaType(@Param('id') id: number) {
    try {
      return this.visaTypeService.findOne(id);
    } catch (error) {
      return {
        message: 'Visa type fetching failed',
        error: error,
      };
    }
  }

  @Patch('update/:id')
  updateVisaType(
    @Param('id') id: number,
    @Body() updateVisaTypeDto: UpdateVisaTypeDto,
  ) {
    try {
      return this.visaTypeService.update(id, updateVisaTypeDto);
    } catch (error) {}
  }

  @Delete('delete/:id')
  removeVisaType(@Param('id') id: number) {
    try {
      return this.visaTypeService.remove(id);
    } catch (error) {
      return {
        message: 'Visa type delete failed',
        error: error,
      };
    }
  }
}
