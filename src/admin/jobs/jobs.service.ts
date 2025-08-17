import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateJobDto,
  CreateStaffJobRequestDto,
  verifyStaffJobRequestDto,
} from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { JobRepository } from './job.repository';
import { FilterJobDto } from './dto/filter-job.dto';

@Injectable()
export class JobsService {
  constructor(private readonly Jobrepo: JobRepository) {}

  async create(createJobDto: CreateJobDto) {
    const job = await this.Jobrepo.createJob(createJobDto);
    if (!job) throw new NotFoundException('Job creation failed');

    const { facilityId, ...userWithoutSensitive } = job;
    return {
      Message: 'Job created successfully',
      data: userWithoutSensitive,
    };
  }

  async findAll({
    page = 1,
    filters = {},
  }: {
    page?: number;
    filters?: FilterJobDto;
  }) {
    const JOB_PAGE_LIMIT = Number(process.env.PAGE_LIMIT) || 10;

    const jobList = await this.Jobrepo.findAllJobs(
      page,
      JOB_PAGE_LIMIT,
      filters,
    );

    const data = jobList.data.map((job) => ({
      id: job.id,
      jobTitle: job.jobTitle,
      jobDescription: job.jobDescription,
      startDate: job.startDate,
      endDate: job.endDate,
      shiftType: job.shiftType,
      workerType: job.workerType,
      speciality: job.speciality,
      status: job.status,
    }));

    return {
      message: 'Job list fetched successfully',
      data,
      currentPage: jobList.currentPage,
      totalPages: jobList.totalPages,
      limit: jobList.limit,
      totalRecords: jobList.totalRecords,
    };
  }

  async findOne(id: number) {
    const Job = await this.Jobrepo.findJobById(id);
    if (!Job) throw new NotFoundException('Job not found');

    return { Message: 'Job fetched successfully', data: Job };
  }

  async update(id: number, updateJobDto: UpdateJobDto) {
    const UpdateJobs = await this.Jobrepo.updateStaff(id, updateJobDto);
    if (!UpdateJobs) throw new NotFoundException('Job not found');

    const { facilityId, ...userWithoutSensitive } = UpdateJobs;
    return {
      Message: 'Job updated successfully',
      data: userWithoutSensitive,
    };
  }

  async remove(id: number) {
    const DeleteJobs = await this.Jobrepo.removeStaff(id);
    if (!DeleteJobs) throw new NotFoundException('Job not found');

    return { Message: 'Job deleted successfully' };
  }

  async count() {
    const count = await this.Jobrepo.getStaffcount();
    if (!count) throw new NotFoundException('Job count not found');

    return { Message: 'Job count fetched successfully', data: count };
  }

  async filterJobs(filterDto: FilterJobDto) {
    const filteredJobs = await this.Jobrepo.filterJobs(filterDto);
    if (!filteredJobs) throw new NotFoundException('Job filtering failed');

    return { Message: 'Job filtering successful', data: filteredJobs };
  }

  async findAllStaffJobRequest({
    page = 1,
    limit = 10,
  }: {
    page?: number;
    limit?: number;
  }) {
    const AllStaffJobRequest = await this.Jobrepo.findAllStaffJobRequest(
      page,
      limit,
    );

    if (!AllStaffJobRequest)
      throw new NotFoundException('Staff job request list not found');

    return {
      Message: 'Staff job request list fetched successfully',
      ...AllStaffJobRequest,
    };
  }

  async acceptDeclineStaffJobRequest(
    id: number,
    VerifyJobRequestDto: verifyStaffJobRequestDto,
  ) {
    const job = await this.Jobrepo.VerifyStaffJobRequest(
      id,
      VerifyJobRequestDto,
    );
    if (!job) throw new NotFoundException('Job creation failed');

    return {
      Message: 'Job Update successfully',
      data: {
        id: job.id,
        status: job.status,
      },
    };
  }
}
