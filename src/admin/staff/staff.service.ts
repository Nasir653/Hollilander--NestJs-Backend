import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateStaffDocumentDto, CreateStaffDto } from './dto/create-staff.dto';
import { CreateStaffDocumentUploadDto } from './dto/create-staff-document-upload.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { StaffRepository } from './staff.repository';
import { Status } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { FilterStaffDto } from './dto/filter-staff.dto';
import { omit, pick } from 'lodash'; // Add lodash for object manipulation
import fastifyMultipart, { Multipart, MultipartFile } from '@fastify/multipart';
import { FastifyRequest } from 'fastify';
import { join } from 'path';
import { existsSync, mkdirSync, createWriteStream } from 'fs';
import { parseMultipartRequest } from 'src/common/utils/file-upload.util';

@Injectable()
export class StaffService {
  constructor(private readonly staffRepository: StaffRepository) {}

  async create(req: FastifyRequest) {
    const { formData, fileUrl } = await parseMultipartRequest(req);

    const email = formData.email?.toLowerCase();
    const existing = await this.staffRepository.findStaffByEmail(email);
    if (existing) {
      throw new ConflictException('Email already exists.');
    }

    const isIreland =
      formData.isIreland === 'true' || formData.isIreland === true;
    const isDrive = formData.isDrive === 'true' || formData.isDrive === true;
    const uniform = formData.uniform === 'true' || formData.uniform === true;

    // Business validations
    if (isDrive && !fileUrl) {
      throw new BadRequestException(
        'Driving license file is required when isDrive is true.',
      );
    }

    if (!uniform && !formData.uniformType) {
      throw new BadRequestException('Uniform type is required');
    }

    const checkVisaType = await this.staffRepository.findVisaTypeById(
      formData.visaTypeId,
    );
    if (!checkVisaType) {
      throw new BadRequestException('Visa type not found.');
    }

    const password = formData.password ? formData.password : 'staff123';

    const hashedPassword = await bcrypt.hash(password, 10);

    const defaultRoleId = 1; // Default role ID, adjust as needed

    const staffData: CreateStaffDto = {
      ...formData,
      email,
      password: hashedPassword,
      dob: formData.dob ? new Date(formData.dob) : undefined,
      roleId: formData.roleId ? Number(formData.roleId) : defaultRoleId,
      status: formData.status || Status.DISABLED,
      isIreland,
      isDrive,
      uniform,
      driverLicenseUrl: isDrive ? fileUrl : undefined,
      uniformType: uniform ? formData.uniformType : undefined,
      visaTypeId: formData.visaTypeId ? Number(formData.visaTypeId) : undefined,
    } as CreateStaffDto;

    const staff = await this.staffRepository.addStaff(staffData);

    return {
      message: 'Staff created successfully',
      data: {
        id: staff.id,
        email: staff.email,
        firstName: staff.firstName,
        dob: staff.dob,
        driverLicenseUrl: staff.driverLicenseUrl,
        isIreland: staff.isIreland,
        isDrive: staff.isDrive,
        uniform: staff.uniform,
        uniformType: staff.uniformType,
        status: staff.status,
      },
    };
  }

  async findAll({
    page = 1,
    filters = {},
  }: {
    page?: number;
    filters?: FilterStaffDto;
  }) {
    const STAFF_PAGE_LIMIT = Number(process.env.PAGE_LIMIT) || 10;

    const staffList = await this.staffRepository.findAllStaff(
      page,
      STAFF_PAGE_LIMIT,
      filters,
    );

    const data = staffList.data.map((staff) => ({
      id: staff.id,
      email: staff.email,
      firstName: staff.firstName,
      lastName: staff.lastName,
      phoneNumber: staff.phoneNumber,
      dob: staff.dob,
      country: staff.country,
      gender: staff.gender,
      status: staff.status,
    }));

    return {
      message: 'Staff list fetched successfully',
      data,
      currentPage: staffList.currentPage,
      totalPages: staffList.totalPages,
      limit: staffList.limit,
      totalRecords: staffList.totalRecords,
    };
  }

  async update(id: string, req: FastifyRequest) {
    // Parse multipart request inside the service
    const { formData, fileUrl } = await parseMultipartRequest(req);

    const existing = await this.staffRepository.findStaffById(id);
    if (!existing) throw new NotFoundException('Staff not found');

    // Normalize booleans
    const isIreland =
      formData.isIreland === 'true' || formData.isIreland === true;
    const isDrive = formData.isDrive === 'true' || formData.isDrive === true;
    const uniform = formData.uniform === 'true' || formData.uniform === true;

    // Validations
    if (isDrive && !fileUrl && !existing.driverLicenseUrl) {
      throw new BadRequestException(
        'Driving license file is required when isDrive is true.',
      );
    }
    if (uniform && !formData.uniformType) {
      throw new BadRequestException(
        'Uniform type is required when uniform is true.',
      );
    }

    // Build dynamic update object
    const updateData: Partial<UpdateStaffDto> & {
      driverLicenseUrl?: string | null;
      dob?: Date;
    } = {
      ...formData,
      dob: formData.dob ? new Date(formData.dob) : undefined,
      isIreland,
      status: formData.status ? formData.status : 'DISABLED',
      roleId: existing.roleId, // Keep existing roleId
      isDrive,
      uniform,
      driverLicenseUrl: isDrive
        ? fileUrl || existing.driverLicenseUrl
        : existing.driverLicenseUrl,
      uniformType: uniform ? formData.uniformType : undefined,
      visaTypeId: formData.visaTypeId ? Number(formData.visaTypeId) : undefined,
    };

    // Update in repository
    const updatedStaff = await this.staffRepository.updateStaff(id, updateData);

    // Exclude sensitive fields
    const { password: _, otp: __, ...userWithoutSensitive } = updatedStaff;

    return {
      message: 'Staff updated successfully',
      data: userWithoutSensitive,
    };
  }

  async findOne(id: string) {
    const staff = await this.staffRepository.findStaffById(id);
    if (!staff) throw new NotFoundException('Staff not found');

    return { Message: 'Staff fetched successfully', data: staff };
  }

  async remove(id: string) {
    const staff = await this.staffRepository.findStaffById(id);
    if (!staff) throw new NotFoundException('Staff not found');

    const isDeleted = await this.staffRepository.SoftDeleteStaff(id);
    if (!isDeleted) throw new NotFoundException('Staff not found');

    return { Message: 'Staff deleted successfully' };
  }

  async filter(filterDto: FilterStaffDto) {
    const filteredStaff = await this.staffRepository.filterJobs(filterDto);
    if (!filteredStaff) throw new NotFoundException('Staff filtering failed');

    return { Message: 'Staff filtering successful', data: filteredStaff };
  }

  async handleDocumentUpload(req: FastifyRequest) {
    const { formData, fileUrl } = await parseMultipartRequest(req);

    if (!fileUrl) {
      throw new NotFoundException('No file uploaded');
    }

    // Validate staff existence
    const staff = await this.staffRepository.findStaffById(formData.userId);
    if (!staff) {
      throw new NotFoundException('Staff not found');
    }

    // Validate document existence
    const doc = await this.staffRepository.finddocumentById(formData.docId);
    if (!doc) {
      throw new NotFoundException(' Document not found');
    }

    const createStaffDocumentDto: CreateStaffDocumentDto = {
      userId: formData.userId,
      docId: Number(formData.docId),
      docUrl: fileUrl, // parseMultipartRequest already gives correct path
      docExpire: formData.docExpire,
    };

    const staffDocument = await this.staffRepository.addStaffDocument(
      createStaffDocumentDto,
    );

    if (!staffDocument) {
      throw new NotFoundException('Staff document not found');
    }

    return {
      message: 'Staff document added successfully',
      data: staffDocument,
    };
  }
}
