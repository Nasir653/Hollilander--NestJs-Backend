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
import { JobsService } from './jobs.service';
import {
  CreateJobDto,
  CreateStaffJobRequestDto,
  verifyStaffJobRequestDto,
} from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { FilterJobDto } from './dto/filter-job.dto';

@ApiBearerAuth()
@Controller('admin/jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post('add')
  async createJob(@Body() createJobDto: CreateJobDto) {
    try {
      return await this.jobsService.create(createJobDto);
    } catch (error) {
      return {
        message: 'Job creation failed',
        error: error,
      };
    }
  }

  @Get('list')
  async getJobList(
    @Query('page') page: number = 1,
    @Query() filters: FilterJobDto, // <- all DTO properties will appear
  ) {
    try {
      return this.jobsService.findAll({ page: Number(page), filters });
    } catch (error) {
      return {
        message: 'Staff list fetching failed',
        error: error,
      };
    }
  }

  @Get(':id')
  async searchJob(@Param('id') id: number) {
    try {
      return await this.jobsService.findOne(id);
    } catch (error) {
      return {
        message: 'Job fetching failed',
        error: error,
      };
    }
  }

  @Patch('update/:id')
  async updateJob(@Param('id') id: number, @Body() updateJobDto: UpdateJobDto) {
    try {
      return await this.jobsService.update(id, updateJobDto);
    } catch (error) {
      return {
        message: 'Job update failed',
        error: error,
      };
    }
  }

  @Delete('delete/:id')
  async removeJob(@Param('id') id: number) {
    try {
      return await this.jobsService.remove(id);
    } catch (error) {
      return {
        message: 'Job delete failed',
        error: error,
      };
    }
  }

  @Get('filter')
  async filterJobs(@Query() filterDto: FilterJobDto) {
    try {
      return await this.jobsService.filterJobs(filterDto);
    } catch (error) {
      return {
        message: 'Job filtering failed',
        error: error.message || error,
      };
    }
  }

  @Get('staff/request-list')
  async getStaffJobRequestList(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    try {
      return await this.jobsService.findAllStaffJobRequest({
        page: Number(page),
        limit: Number(limit),
      });
    } catch (error) {
      return {
        message: 'Staff job request list fetching failed',
        error: error,
      };
    }
  }

  @Patch('staff/request/accpet-decline/:id')
  async acceptDeclineStaffJobRequest(
    @Param('id') id: number,
    @Body() VerifyJobRequestDto: verifyStaffJobRequestDto,
  ) {
    try {
      return await this.jobsService.acceptDeclineStaffJobRequest(
        id,
        VerifyJobRequestDto,
      );
    } catch (error) {
      return {
        message: 'Job Update failed',
        error: error,
      };
    }
  }
}
