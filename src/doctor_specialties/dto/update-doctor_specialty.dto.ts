import { PartialType } from '@nestjs/mapped-types';
import { CreateDoctorSpecialtyDto } from './create-doctor_specialty.dto';

export class UpdateDoctorSpecialtyDto extends PartialType(CreateDoctorSpecialtyDto) {}
