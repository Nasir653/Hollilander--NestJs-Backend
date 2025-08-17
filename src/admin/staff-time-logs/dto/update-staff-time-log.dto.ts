import { PartialType } from '@nestjs/swagger';
import { CreateStaffTimeLogDto } from './create-staff-time-log.dto';

export class UpdateStaffTimeLogDto extends PartialType(CreateStaffTimeLogDto) {}
