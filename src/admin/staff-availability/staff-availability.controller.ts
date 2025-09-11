import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { StaffAvailabilityService } from './staff-availability.service';
import { CreateStaffAvailabilityDto } from './dto/create-staff-availability.dto';
import { UpdateStaffAvailabilityDto } from './dto/update-staff-availability.dto';
import { ApiBearerAuth } from '@nestjs/swagger';


@ApiBearerAuth()
@Controller('admin/staff/availability')
export class StaffAvailabilityController {
  constructor(
    private readonly staffAvailabilityService: StaffAvailabilityService,
  ) {}

  @Post('add')
  async addAvailabilty(
    @Body() createStaffAvailabilityDto: CreateStaffAvailabilityDto,
  ) {
    try {
      return this.staffAvailabilityService.create(createStaffAvailabilityDto);
    } catch (error) {
      return {
        message: 'Staff availability creation failed',
        error: error,
      };
    }
  }

  @Get('list')
  async getAllAvailability() {
    try {
      return this.staffAvailabilityService.findAll();
    } catch (error) {
      return {
        message: 'Staff availability list fetching failed',
        error: error,
      };
    }
  }

  // @Get(':id')
  // async findOne(@Param('id') id: number) {
  //   try {
  //     return this.staffAvailabilityService.findOne(id);
  //   } catch (error) {}
  // }

  @Patch('update/:id')
  async updateAvailability(
    @Param('id') id: number,
    @Body() updateStaffAvailabilityDto: UpdateStaffAvailabilityDto,
  ) {
    try {
      return this.staffAvailabilityService.update(
        id,
        updateStaffAvailabilityDto,
      );
    } catch (error) {
      return {
        message: 'Staff availability update failed',
        error: error,
      };
    }
  }

  @Delete(':id')
  async removeAvailability(@Param('id') id: number) {
    try {
      return this.staffAvailabilityService.remove(id);
    } catch (error) {
      return {
        message: 'Staff availability deletion failed',
        error: error,
      };
    }
  }

  @Get('findsss/:id')
  async findAvailability(@Param('id') id: number) {
    try {
      return this.staffAvailabilityService.findOne(id);
    } catch (error) {
      return {
        message: 'Staff availability fetching failed',
        error: error,
      };
    }
  }
}
