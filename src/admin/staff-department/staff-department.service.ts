import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateStaffDepartmentDto } from './dto/create-staff-department.dto';
import { UpdateStaffDepartmentDto } from './dto/update-staff-department.dto';
import { FilterStaffDepartmentDto } from './dto/filter-staff-department.dto';
import { staffDepartmentRepository } from './staff-department.repository';

@Injectable()
export class StaffDepartmentService {
  constructor(private staffDepartmentRepository: staffDepartmentRepository) {}
  async create(createStaffDepartmentDto: CreateStaffDepartmentDto) {
    const StaffDepartment = await this.staffDepartmentRepository.create(
      createStaffDepartmentDto,
    );
    if (!StaffDepartment) throw new ConflictException('Something went wrong');
    return {
      Message: 'Staff department created successfully',
      data: StaffDepartment,
    };
  }

  async findAll({ page = 1, limit = 10 }: { page?: number; limit?: number }) {
    const AllStaffDepartments = await this.staffDepartmentRepository.findAll(page, limit);
    if (!AllStaffDepartments || !AllStaffDepartments.data || AllStaffDepartments.data.length === 0)
      throw new NotFoundException('Staff Department List not found');

    return {
      Message: 'Staff Department List fetched successfully',
      ...AllStaffDepartments,
    };
  }

  async findOne(id: number) {
    const StaffDepartment = await this.staffDepartmentRepository.findOne(id);
    if (!StaffDepartment)
      throw new NotFoundException('Staff Department not found');

    return {
      Message: 'Staff Department fetched successfully',
      data: StaffDepartment,
    };
  }

  async update(id: number, UpdateStaffDepartmentDto: UpdateStaffDepartmentDto) {
    const updateStaffDepartment = await this.staffDepartmentRepository.update(
      id,
      UpdateStaffDepartmentDto,
    );
    if (!updateStaffDepartment)
      throw new NotFoundException('Staff Department not found');

    return {
      Message: 'Staff Department updated successfully',
      data: updateStaffDepartment,
    };
  }

  async remove(id: number) {

    const DeleteDepartment = await this.staffDepartmentRepository.SoftDelete(id);
    if (!DeleteDepartment)
      throw new NotFoundException('Staff Department not found');

    return { Message: 'Staff Department deleted successfully' };
  }

  async filter(filterDto: FilterStaffDepartmentDto) {
    const filteredStaffDepartments =
      await this.staffDepartmentRepository.filterStaff(filterDto);
    if (!filteredStaffDepartments)
      throw new NotFoundException('Staff Department filtering failed');

    return {
      Message: 'Staff Department filtering successful',
      data: filteredStaffDepartments,
    };
  }
}
