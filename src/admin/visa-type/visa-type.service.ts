import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateVisaTypeDto } from './dto/create-visa-type.dto';
import { UpdateVisaTypeDto } from './dto/update-visa-type.dto';
import { VisaTypeRepository } from './visa-type.repository';

@Injectable()
export class VisaTypeService {
  constructor(private visaTypeRepository: VisaTypeRepository) {}

  async create(createVisaTypeDto: CreateVisaTypeDto) {
    const visaType =
      await this.visaTypeRepository.createVisa(createVisaTypeDto);
    if (!visaType) throw new BadRequestException('VisaType not created');

    return {
      message: 'VisaType created successfully',
      data: visaType,
    };
  }

  async findAll() {
    const AllVisaType = await this.visaTypeRepository.findAllVisaType();
    if (!AllVisaType) throw new BadRequestException('VisaType List not found');
    return {
      message: 'VisaType found successfully',
      data: AllVisaType,
    };
  }

  async findOne(id: number) {
    const VisaType = await this.visaTypeRepository.findOneVisaType(id);
    if (!VisaType) throw new NotFoundException('VisaType not found');
    return {
      message: 'VisaType fetched successfully',
      data: VisaType,
    };
  }

  async update(id: number, updateVisaTypeDto: UpdateVisaTypeDto) {
    const updateVisaType = await this.visaTypeRepository.updateVisaType(
      id,
      updateVisaTypeDto,
    );
    if (!updateVisaType) throw new NotFoundException('VisaType not found');
    return {
      message: 'VisaType updated successfully',
      data: updateVisaType,
    };
  }

  async remove(id: number) {
    const deleteVisaType = await this.visaTypeRepository.SoftDeleteVisaType(id);
    if (!deleteVisaType) throw new NotFoundException('VisaType not found');
    return {
      message: 'VisaType deleted successfully',
      data: deleteVisaType,
    };
  }
}
