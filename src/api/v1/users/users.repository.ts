import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { VerifyOtpDto, ResendOtpDto } from './dto/otp-user.dto';
import { Status } from '.prisma/client';
import { CreateAvailabilityDto } from './dto/create-availability.dto';

@Injectable()
export class UsersRepository {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    // Extract only the fields that match the Prisma schema
    const { email, password, otp, status, roleId } = createUserDto;

    return await this.prisma.user.create({
      data: {
        email,
        password,
        otp,
        status,
        roleId: roleId ? Number(roleId) : 1, // Ensure roleId is always provided
      },
    });
  }

  async findByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findFirstByEmail(email: string) {
    return await this.prisma.user.findFirst({
      where: { email },
    });
  }

  async findById(id: string) {
    return await this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findAll() {
    return await this.prisma.user.findMany({
      where: {
        deletedAt: null,
      },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    //console.log("Update user info.........", updateUserDto);
    try {
      // Convert string date to DateTime if dob is provided
      const data: any = { ...updateUserDto };
      if (data.dob && typeof data.dob === 'string') {
        data.dob = new Date(data.dob);
      }

      return await this.prisma.user.update({
        where: { id },
        data: data,
      });
    } catch (error) {
      console.log('Error.........', error);
      throw error;
    }
  }

  async updateOtp(email: string, otp: number) {
    return await this.prisma.user.update({
      where: { email },
      data: { otp },
    });
  }

  async softDelete(id: string) {
    return await this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async delete(id: string) {
    return await this.prisma.user.delete({
      where: { id },
    });
  }

  async findByStatus(status: Status) {
    return await this.prisma.user.findMany({
      where: {
        status: status,
        deletedAt: null,
      },
    });
  }

  async count() {
    return await this.prisma.user.count({
      where: {
        deletedAt: null,
      },
    });
  }

  async findByEmailAndPassword(email: string) {
    return await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        otp: true,
        status: true,
      },
    });
  }

  async updateUserStatus(id: string, status: Status) {
    return await this.prisma.user.update({
      where: { id },
      data: { status: status },
    });
  }

  async findActiveUsers() {
    return await this.prisma.user.findMany({
      where: {
        status: Status.ACTIVE,
        deletedAt: null,
      },
    });
  }

  async createStaffAvailability(
    createStaffAvailabilityDto: CreateAvailabilityDto,
  ) {
    const cleanedDaysAvailability: Record<string, any> = {};

    for (const [day, value] of Object.entries(
      createStaffAvailabilityDto.daysAvailability,
    )) {
      if (!value.isAvailable) {
        cleanedDaysAvailability[day] = { isAvailable: false, shift: null };
      } else {
        if (!value.shift) {
          throw new Error(
            `Shift is required for ${day} when available is true`,
          );
        }
        cleanedDaysAvailability[day] = {
          isAvailable: true,
          shift: value.shift,
        };
      }
    }

    return await this.prisma.staffAvailability.create({
      data: {
        staffId: createStaffAvailabilityDto.staffId,
        startWeekDate: createStaffAvailabilityDto.startWeekDate,
        endWeekDate: createStaffAvailabilityDto.endWeekDate,
        daysAvailability: cleanedDaysAvailability,
      },
    });
  }
}
