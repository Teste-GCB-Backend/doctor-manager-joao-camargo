import { Module } from '@nestjs/common';
import { DoctorSpecialtiesService } from './doctor_specialties.service';
import { DoctorSpecialtiesController } from './doctor_specialties.controller';

@Module({
  controllers: [DoctorSpecialtiesController],
  providers: [DoctorSpecialtiesService]
})
export class DoctorSpecialtiesModule {}
