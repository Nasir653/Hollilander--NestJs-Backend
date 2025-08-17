import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { VerifyOtpDto, ResendOtpDto } from './dto/otp-user.dto';
import {
  UpdateUserDto,
  UpdateWorkAuthorisationDto,
} from './dto/update-user.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Public } from '../../../common/decorators/public.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { JwtPayload } from '../../../common/interfaces/jwt-payload.interface';
import { CreateAvailabilityDto } from './dto/create-availability.dto';

@ApiTags('Users')
@Controller({ path: 'api/users', version: '1' })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.usersService.signup(createUserDto);
      return {
        message: 'Signup successful! Please check your email for the OTP.',
        data: user,
      };
    } catch (error) {
      return {
        message: 'User creation failed',
        error: error,
      };
    }
  }

  // Login
  @Public()
  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    try {
      const { accessToken, user } = await this.usersService.login(loginUserDto);
      return {
        message: 'Login successfully',
        data: user,
        accessToken: accessToken,
      };
    } catch (error) {
      return {
        message: 'Login creation failed',
        error: error,
      };
    }
  }

  // Email OTP Verification
  @Public()
  @Post('email-otp-verify')
  async emailOtpVerify(@Body() verifyOtpDto: VerifyOtpDto) {
    try {
      const { accessToken, user } =
        await this.usersService.emailOtpVerify(verifyOtpDto);
      return {
        message: 'Login successfully',
        data: user,
        accessToken: accessToken,
      };
    } catch (error) {
      return {
        message: 'Login creation failed',
        error: error,
      };
    }
  }

  // Resend Email OTP
  @Public()
  @Post('resend-email-otp')
  async resendEmailOtp(@Body() resendOtpDto: ResendOtpDto) {
    try {
      const resendOtp = await this.usersService.resendEmailOtp(resendOtpDto);
      return {
        message: 'OTP has been resent! Please check your email.',
      };
    } catch (error) {
      return {
        message: 'Login creation failed',
        error: error,
      };
    }
  }

  // Mobile OTP Verification
  @Public()
  @Post('mobile-otp-verify')
  async mobileOtpVerify(@Body() verifyOtpDto: VerifyOtpDto) {
    try {
      const { accessToken, user } =
        await this.usersService.emailOtpVerify(verifyOtpDto);
      return {
        message: 'Login successfully',
        data: user,
        accessToken: accessToken,
      };
    } catch (error) {
      return {
        message: 'Login creation failed',
        error: error,
      };
    }
  }

  // Resend Mobile OTP
  @Public()
  @Post('resend-mobile-otp')
  async resendMobileOtp(@Body() resendOtpDto: ResendOtpDto) {
    try {
      const resendOtp = await this.usersService.resendEmailOtp(resendOtpDto);
      return {
        message: 'OTP has been resent! Please check your email.',
      };
    } catch (error) {
      return {
        message: 'Login creation failed',
        error: error,
      };
    }
  }

  // Update Profile - Protected by JWT
  @ApiBearerAuth()
  @Post('add-personal-information')
  async addPersonalInformation(
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() user: JwtPayload,
  ) {
    try {
      const updatedUser = await this.usersService.addPersonalInformation(
        updateUserDto,
        user,
      );
      return {
        message: 'Personal information updated successfully',
        data: updatedUser,
      };
    } catch (error) {
      return {
        message: 'User creation failed',
        error: error,
      };
    }
  }

  // Update Work authorisation - Protected by JWT
  @ApiBearerAuth()
  @Post('add-work-authorisation')
  async addWorkAuthorisation(
    @Body() updateWorkAuthorisationDto: UpdateWorkAuthorisationDto,
    @CurrentUser() user: JwtPayload,
  ) {
    try {
      const updatedUser = await this.usersService.addWorkAuthorisation(
        updateWorkAuthorisationDto,
        user,
      );
      return {
        message: 'Work authorisation updated successfully',
        data: updatedUser,
      };
    } catch (error) {
      return {
        message: 'User creation failed',
        error: error,
      };
    }
  }

    @ApiBearerAuth()
    @Post('add')
    async addAvailabilty(
      @Body() createStaffAvailabilityDto: CreateAvailabilityDto,
    ) {
      try {
        return this.usersService.create(createStaffAvailabilityDto);
      } catch (error) {
        return {
          message: 'Staff availability creation failed',
          error: error,
        };
      }
    }
}
