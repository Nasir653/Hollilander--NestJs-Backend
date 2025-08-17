import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { StaffDepartmentService } from './staff-department.service';
import { CreateStaffDepartmentDto } from './dto/create-staff-department.dto';
import { UpdateStaffDepartmentDto } from './dto/update-staff-department.dto';
import { FilterStaffDepartmentDto } from './dto/filter-staff-department.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('admin/staff-department')
export class StaffDepartmentController {
  constructor(
    private readonly staffDepartmentService: StaffDepartmentService,
  ) {}

  @Post('add')
  createStaffDepartment(
    @Body() createStaffDepartmentDto: CreateStaffDepartmentDto,
  ) {
    try {
      return this.staffDepartmentService.create(createStaffDepartmentDto);
    } catch (error) {
      return {
        message: 'Nurse department creation failed',
        error: error,
      };
    }
  }

  @Get('list')
  getStaffDepartmentList(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    try {
      return this.staffDepartmentService.findAll({
        page: Number(page),
        limit: Number(limit),
      });
    } catch (error) {
      return {
        message: 'Nurse department list fetching failed',
        error: error,
      };
    }
  }

  @Get(':id')
  searchStaffDepartment(@Param('id') id: number) {
    try {
      return this.staffDepartmentService.findOne(id);
    } catch (error) {
      return {
        message: 'Nurse department fetching failed',
        error: error,
      };
    }
  }

  @Patch('update/:id')
  updateStaffDepartment(
    @Param('id') id: number,
    @Body() updateStaffDepartmentDto: UpdateStaffDepartmentDto,
  ) {
    return this.staffDepartmentService.update(id, updateStaffDepartmentDto);
  }

  @Delete('delete/:id')
  removeStaffDepartment(@Param('id') id: number) {
    return this.staffDepartmentService.remove(id);
  }

  @Get('filter')
  async filterStaffDepartments(@Query() filterDto: FilterStaffDepartmentDto) {
    try {
      return await this.staffDepartmentService.filter(filterDto);
    } catch (error) {
      return {
        message: 'Job filtering failed',
        error: error.message || error,
      };
    }
  }
}
