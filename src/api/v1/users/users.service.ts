import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { VerifyOtpDto, ResendOtpDto } from './dto/otp-user.dto';
import {
  UpdateUserDto,
  UpdateWorkAuthorisationDto,
} from './dto/update-user.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersRepository } from './users.repository';
import { Status } from '.prisma/client';
import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { JwtPayload } from '../../../common/interfaces/jwt-payload.interface';
import { CreateAvailabilityDto } from './dto/create-availability.dto';

@Injectable()
export class UsersService {
  constructor(
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}

  async signup(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;
    const normalizedEmail = email.toLowerCase();
    // Check if user already exists
    const existingUser =
      await this.usersRepository.findFirstByEmail(normalizedEmail);
    if (existingUser) {
      throw new ConflictException('Email already exists.');
    }
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Use default roleId if not provided (assuming role with id '1' exists)
    const defaultRoleId = 1;

    let userInfo = await this.usersRepository.create({
      email: normalizedEmail,
      password: hashedPassword,
      otp: otp,
      status: Status.DISABLED,
      roleId: Number(defaultRoleId),
    });
    const { password: _, otp: __, ...userWithoutSensitive } = userInfo; // Removing password and otp here
    return { email: userInfo.email };
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    // Check if user already exists
    const normalizedEmail = email.toLowerCase();
    const loginUser = await this.usersRepository.findByEmail(normalizedEmail);

    if (!loginUser) {
      throw new UnauthorizedException('Invalid credentials');
    }
    // if (loginUser.status === Status.DISABLED) {
    //   throw new UnauthorizedException('Please verify your email to login');
    // }
    if (loginUser.status === Status.INACTIVE) {
      throw new UnauthorizedException(
        'Your account is inactive. Please contact admin',
      );
    }
    // Verify password
    const isPasswordValid = await bcrypt.compare(password, loginUser.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    // Generate JWT token
    const payload = { sub: loginUser.id, email: loginUser.email };
    const accessToken = this.jwtService.sign(payload);
    const { password: _, otp: __, ...userWithoutSensitive } = loginUser; // Removing password and otp here

    return {
      user: userWithoutSensitive,
      accessToken: accessToken,
    };
  }

  async emailOtpVerify(VerifyOtpDto: VerifyOtpDto) {
    const { email, otp } = VerifyOtpDto;
    // Check if user already exists
    const normalizedEmail = email.toLowerCase();
    const loginUser = await this.usersRepository.findByEmail(normalizedEmail);

    if (!loginUser) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    if (loginUser && 'otp' in loginUser && loginUser.otp !== Number(otp)) {
      throw new UnauthorizedException('Invalid otp');
    }

    let updateData = await this.usersRepository.update(loginUser.id, {
      otp: 0,
      status: 'INACTIVE',
    });
    // Generate JWT token
    const payload = { sub: updateData.id, email: updateData.email };
    const accessToken = this.jwtService.sign(payload);
    const { password: _, otp: __, ...userWithoutSensitive } = updateData; // Removing password and otp here

    return {
      user: userWithoutSensitive,
      accessToken: accessToken,
    };
  }

  async resendEmailOtp(resendOtpDto: ResendOtpDto) {
    const { email } = resendOtpDto;
    // Check if user already exists
    const normalizedEmail = email.toLowerCase();
    const loginUser = await this.usersRepository.findByEmail(normalizedEmail);

    if (!loginUser) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const newOtp = Math.floor(100000 + Math.random() * 900000);
    let updateData = await this.usersRepository.update(loginUser.id, {
      otp: newOtp,
    });

    const { password: _, otp: __, ...userWithoutSensitive } = updateData; // Removing password and otp here

    return {
      user: userWithoutSensitive,
    };
  }

  async addPersonalInformation(updateUserDto: UpdateUserDto, user: JwtPayload) {
    const { firstName, lastName, dob, phoneNumber, address, gender } =
      updateUserDto;
    // Use the user information from JWT payload
    const loginUser = await this.usersRepository.findById(user.sub);
    console.log(loginUser, 'User info', updateUserDto);
    if (!loginUser) {
      throw new UnauthorizedException('Invalid credentials');
    }

    let updateRecord = await this.usersRepository.update(
      loginUser.id,
      updateUserDto,
    );
    const { password: _, otp: __, ...userWithoutSensitive } = updateRecord;

    return {
      user: userWithoutSensitive,
    };
  }

  async addWorkAuthorisation(
    updateWorkAuthorisationDto: UpdateWorkAuthorisationDto,
    user: JwtPayload,
  ) {
    const { isDrive, isIreland, visaType } = updateWorkAuthorisationDto;
    // Use the user information from JWT payload
    const loginUser = await this.usersRepository.findById(user.sub);
    if (!loginUser) {
      throw new UnauthorizedException('Invalid credentials');
    }

    let updateRecord = await this.usersRepository.update(
      loginUser.id,
      updateWorkAuthorisationDto,
    );
    const { password: _, otp: __, ...userWithoutSensitive } = updateRecord;

    return {
      user: userWithoutSensitive,
    };
  }

  async findAll() {
    return this.usersRepository.findAll();
  }

  async findOne(id: string) {
    return this.usersRepository.findById(id);
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    return this.usersRepository.update(id, updateUserDto);
  }

  async deleteUser(id: string) {
    return this.usersRepository.softDelete(id);
  }

  // async updateUserStatus(id: string, status: string) {
  //   return this.usersRepository.updateUserStatus(id, status);
  // }

  // async getActiveUsers() {
  //   return this.usersRepository.findActiveUsers();
  // }

  async getUserCount() {
    return this.usersRepository.count();
  }

    async create(createStaffAvailabilityDto: CreateAvailabilityDto) {
      // Call repo function
      return await this.usersRepository.createStaffAvailability(
        createStaffAvailabilityDto,
      );
    }
 
}
