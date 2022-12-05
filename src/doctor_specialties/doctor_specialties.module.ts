import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DoctorSpecialtiesService } from './doctor_specialties.service';
import { DoctorSpecialty } from './entities/doctor_specialty.entity';
import { SpecialtiesModule } from '../specialties/specialties.module';

@Module({
  imports: [TypeOrmModule.forFeature([DoctorSpecialty]), SpecialtiesModule],
  providers: [DoctorSpecialtiesService],
  exports: [DoctorSpecialtiesService]
})
export class DoctorSpecialtiesModule {}
