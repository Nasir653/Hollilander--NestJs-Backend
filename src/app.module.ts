import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from './prisma.service';
import { UsersModule } from './api/v1/users/users.module';
import { AppGuard } from './common/guards/app.guard';
import { AdminModule } from './admin/admin.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AdminModule,
  ],
  providers: [
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: AppGuard,
    },
  ],
})
export class AppModule {}