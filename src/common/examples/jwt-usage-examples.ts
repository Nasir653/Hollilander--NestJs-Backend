// JWT Authentication Usage Examples

import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from '../decorators/public.decorator';
import { CurrentUser } from '../decorators/current-user.decorator';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@ApiTags('examples')
@Controller('examples')
export class JwtUsageExamples {
  
  // Example 1: Public route (no authentication required)
  @Public()
  @Get('public')
  getPublicData() {
    return { message: 'This is public data' };
  }

  // Example 2: Protected route (requires JWT token)
  // This will be automatically protected by the global AppGuard
  @ApiBearerAuth()
  @Get('protected')
  getProtectedData(@CurrentUser() user: JwtPayload) {
    return { 
      message: 'This is protected data',
      user: {
        id: user.sub,
        email: user.email
      }
    };
  }

  // Example 3: Using specific guard on a route
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('specific-guard')
  useSpecificGuard(@CurrentUser() user: JwtPayload, @Body() data: any) {
    return {
      message: 'Using specific JWT guard',
      user: user,
      data: data
    };
  }

  // Example 4: Controller-level protection
  // @ApiBearerAuth()
  // @Controller('admin')
  // export class AdminController {
  //   // All routes in this controller require authentication
  //   @Get('dashboard')
  //   getDashboard(@CurrentUser() user: JwtPayload) {
  //     return {
  //       message: 'Admin dashboard',
  //       user: user
  //     };
  //   }

  //   @Post('settings')
  //   updateSettings(@CurrentUser() user: JwtPayload, @Body() settings: any) {
  //     return {
  //       message: 'Settings updated',
  //       user: user,
  //       settings: settings
  //     };
  //   }
  // }

  // Example 5: Mixed public and protected routes in same controller
  // @Controller('mixed')
  // export class MixedController {
  //   @Public()
  //   @Get('public-info')
  //   getPublicInfo() {
  //     return { message: 'Public information' };
  //   }

  //   @ApiBearerAuth()
  //   @Get('user-profile')
  //   getUserProfile(@CurrentUser() user: JwtPayload) {
  //     return {
  //       message: 'User profile',
  //       user: user
  //     };
  //   }
  // }
}

/*
HOW TO USE JWT MIDDLEWARE:

1. GLOBAL PROTECTION (Recommended):
   - The AppGuard is applied globally in app.module.ts
   - All routes are protected by default
   - Use @Public() decorator to make routes public

2. ROUTE-LEVEL PROTECTION:
   - Use @UseGuards(JwtAuthGuard) on specific routes
   - Useful when you want different authentication strategies

3. CONTROLLER-LEVEL PROTECTION:
   - Apply guards at controller level
   - All routes in the controller will be protected

4. ACCESSING USER DATA:
   - Use @CurrentUser() decorator to get the authenticated user
   - The user object contains the JWT payload (id, email, etc.)

5. SWAGGER DOCUMENTATION:
   - Use @ApiBearerAuth() for protected routes in Swagger
   - This adds the authorization button in Swagger UI

EXAMPLE API CALLS:

Public Route:
GET /api/v1/examples/public
(No Authorization header needed)

Protected Route:
GET /api/v1/examples/protected
Authorization: Bearer <your-jwt-token>

Your add-personal-information endpoint:
POST /api/v1/users/add-personal-information
Authorization: Bearer <your-jwt-token>
Content-Type: application/json
{
  "firstName": "John",
  "lastName": "Doe",
  "dob": "1990-01-01",
  "phoneNumber": "+1234567890",
  "address": "123 Main St",
  "gender": "male"
}
*/ 