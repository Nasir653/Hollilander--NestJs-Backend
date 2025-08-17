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
import { StaffTimeLogsService } from './staff-time-logs.service';
import { CreateStaffTimeLogDto } from './dto/create-staff-time-log.dto';
import { UpdateStaffTimeLogDto } from './dto/update-staff-time-log.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { FilterStaffTimeLogDto } from './dto/filter-staff-time-logs.dto';

@ApiBearerAuth()
@Controller('admin/staff-time-logs')
export class StaffTimeLogsController {
  constructor(private readonly staffTimeLogsService: StaffTimeLogsService) {}

  @Post('add')
  createTimeLogs(@Body() createStaffTimeLogDto: CreateStaffTimeLogDto) {
    try {
      return this.staffTimeLogsService.create(createStaffTimeLogDto);
    } catch (error) {
      return {
        message: 'Staff time log creation failed',
        error: error,
      };
    }
  }

  @Get('list')
  getAllTimeLogs(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    try {
      return this.staffTimeLogsService.findAll({
        page: Number(page),
        limit: Number(limit),
      });
    } catch (error) {
      return {
        message: 'Staff time logs fetching failed',
        error: error,
      };
    }
  }

  // @Get(':id')
  // findOne(@Param('id') id: number) {
  //   try {
  //     return this.staffTimeLogsService.findOne(id);

  //   } catch (error) {
  //     return {
  //       message: 'Staff time log fetching failed',
  //       error: error,
  //     };
  //   }

  // }

  @Patch('update:id')
  updateTimeLogs(
    @Param('id') id: number,
    @Body() updateStaffTimeLogDto: UpdateStaffTimeLogDto,
  ) {
    try {
      return this.staffTimeLogsService.update(id, updateStaffTimeLogDto);
    } catch (error) {
      return {
        message: 'Staff time log updating failed',
        error: error,
      };
    }
  }

  @Delete('delete:id')
  removeTimeLogs(@Param('id') id: number) {
    try {
      return this.staffTimeLogsService.remove(id);
    } catch (error) {
      return {
        message: 'Staff time log deleting failed',
        error: error,
      };
    }
  }

  @Get('filter')
  async filterTimeLogs(@Query() filterDto: FilterStaffTimeLogDto) {
    try {
      
      return await this.staffTimeLogsService.filter(filterDto);
    } catch (error) {
      return {
        message: 'Staff time log filtering failed',
        error: error.message || error,
      };
    }
  }

}
