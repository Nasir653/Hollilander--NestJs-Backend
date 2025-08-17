# JWT Middleware Implementation

This document explains how to use JWT authentication middleware in your NestJS application.

## Overview

The JWT middleware has been implemented with the following components:

1. **Global AppGuard** - Applied to all routes by default
2. **JwtAuthGuard** - Specific guard for individual routes
3. **Public Decorator** - To mark routes as public (no auth required)
4. **CurrentUser Decorator** - To access authenticated user data

## How It Works

### 1. Global Protection (Default)
All routes are protected by default. The `AppGuard` is applied globally in `app.module.ts`.

### 2. Making Routes Public
Use the `@Public()` decorator to make specific routes accessible without authentication:

```typescript
@Public()
@Get('public-data')
getPublicData() {
  return { message: 'This is public' };
}
```

### 3. Protected Routes
Routes without `@Public()` decorator automatically require JWT authentication:

```typescript
@ApiBearerAuth()
@Post('add-personal-information')
async addPersonalInformation(
  @Body() updateUserDto: UpdateUserDto,
  @CurrentUser() user: JwtPayload
) {
  // user object contains: { sub: 'user-id', email: 'user@example.com' }
  return { message: 'Success', userId: user.sub };
}
```

## Usage Examples

### Public Routes (No Authentication)
```typescript
@Public()
@Post('signup')
async signup(@Body() createUserDto: CreateUserDto) {
  // No JWT token required
}

@Public()
@Post('login')
async login(@Body() loginUserDto: LoginUserDto) {
  // No JWT token required
}
```

### Protected Routes (Requires JWT)
```typescript
@ApiBearerAuth()
@Post('add-personal-information')
async addPersonalInformation(
  @Body() updateUserDto: UpdateUserDto,
  @CurrentUser() user: JwtPayload
) {
  // JWT token required
  // user.sub = user ID
  // user.email = user email
}
```

### Route-Level Guard
```typescript
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Get('protected-data')
getProtectedData(@CurrentUser() user: JwtPayload) {
  return { data: 'Protected content', user };
}
```

## API Testing

### Testing Public Routes
```bash
curl -X POST http://localhost:3000/api/v1/users/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Testing Protected Routes
```bash
# First, get a JWT token by logging in
curl -X POST http://localhost:3000/api/v1/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Use the token in subsequent requests
curl -X POST http://localhost:3000/api/v1/users/add-personal-information \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"dob":"1990-01-01","phone_number":"+1234567890","address":"123 Main St","gender":"male"}'
```

## Environment Variables

Make sure you have the following environment variable set:

```env
JWT_SECRET=your-secret-key-here
```

## Swagger Documentation

Protected routes are automatically documented with the `@ApiBearerAuth()` decorator, which adds an authorization button in Swagger UI.

## Error Responses

### Missing Token
```json
{
  "statusCode": 401,
  "message": "Access token is required"
}
```

### Invalid Token
```json
{
  "statusCode": 401,
  "message": "Invalid or expired token"
}
```

## Files Created

1. `src/common/interfaces/jwt-payload.interface.ts` - JWT payload interface
2. `src/common/decorators/current-user.decorator.ts` - User data decorator
3. `src/common/decorators/public.decorator.ts` - Public route decorator
4. `src/common/guards/jwt-auth.guard.ts` - JWT authentication guard
5. `src/common/guards/app.guard.ts` - Global application guard
6. `src/common/strategies/jwt.strategy.ts` - JWT strategy for passport

## Current Implementation

Your `add-personal-information` endpoint is now protected and will:

1. Require a valid JWT token in the Authorization header
2. Provide the authenticated user's information via `@CurrentUser()`
3. Return user ID and email in the response
4. Be documented in Swagger with an authorization button

The endpoint is ready to use with proper JWT authentication! 